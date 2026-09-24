const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const { Word, splitHanzi, removeTones } = require("../models/Word");
const upload = require("../middleware/upload");

// GET /api/words/test
router.get("/test", (req, res) => {
  res.json({ message: "Words API is working" });
});

// GET /api/words
router.get("/", async (req, res) => {
  try {
    const {
      search,
      hskLevel,
      type,
      status,
      source,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    // Validate limit
    const ALLOWED_LIMITS = [20, 50, 100];
    const pageLimit = ALLOWED_LIMITS.includes(Number(limit))
      ? Number(limit)
      : 20;
    const pageNumber = Math.max(1, Number(page));
    const skip = (pageNumber - 1) * pageLimit;

    // Build filter query
    const query = {};

    if (search) {
      const normalizedSearch = removeTones(search);
      query.$or = [
        { hanzi: { $regex: search, $options: "i" } },
        { pinyin: { $regex: search, $options: "i" } },
        { pinyinNormalized: { $regex: normalizedSearch, $options: "i" } },
        { "definitions.meanings": { $regex: search, $options: "i" } },
      ];
    }

    if (hskLevel) query.hskLevel = hskLevel;
    if (status) query.status = status;
    if (type) query["definitions.type"] = type;
    if (source) query.source = source;

    // Build sort
    const ALLOWED_SORTS = [
      "hanzi",
      "pinyin",
      "hskLevel",
      "status",
      "source",
      "createdAt",
    ];
    const sortField = ALLOWED_SORTS.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sortQuery = { [sortField]: sortOrder };

    // Execute query
    const [words, total] = await Promise.all([
      Word.find(query).sort(sortQuery).skip(skip).limit(pageLimit),
      Word.countDocuments(query),
    ]);

    // Return response
    res.json({
      words,
      pagination: {
        total,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error("Get words error:", error);
    res.status(500).json({
      message: "There are some bugs found on server!",
      error: error.message,
    });
  }
});

// POST /api/words
router.post("/", async (req, res) => {
  try {
    const existing = await Word.findOne({
      hanzi: req.body.hanzi?.trim(),
      pinyin: req.body.pinyin,
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: `Từ "${req.body.hanzi} đã tồn tại!` });
    }
    const word = new Word(req.body);
    const saved = await word.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: "There are some bugs found on server!",
      error: error.message,
    });
  }
});

// POST /api/words/import
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No File Found!" });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Empty File!" });
    }

    // Transform Data
    // Group rows by hanzi
    const wordMap = new Map();

    for (const row of rows) {
      const chars = row.hanzi?.trim();
      if (!chars) continue;
      if (!wordMap.has(chars)) {
        wordMap.set(chars, {
          hanzi: chars,
          characters: splitHanzi(chars),
          pinyin: row.pinyin?.trim() || "",
          pinyinNormalized: removeTones(row.pinyin?.trim() || ""),
          hskLevel: row.level?.trim() || "Khác",
          source: row.source?.trim() || "",
          definitions: [],
        });
      }
      // Add 'definition' for hanzi
      const meanings = row.meanings
        ? row.meanings
            .split("/")
            .map((m) => m.trim())
            .filter(Boolean)
        : [];
      if (row.type && meanings.length > 0) {
        wordMap.get(chars).definitions.push({
          type: row.type.trim(),
          meanings,
        });
      }
    }

    // Save to MongoDB
    const wordsToUnsert = Array.from(wordMap.values());

    let insertedCount = 0;
    let updatedCount = 0;

    for (const wordData of wordsToUnsert) {
      const existing = await Word.findOne({ hanzi: wordData.hanzi });
      if (!existing) {
        await Word.create(wordData);
        insertedCount++;
      } else {
        const existingTypes = existing.definitions.map((def) => def.type);
        const newDefinitions = wordData.definitions.filter(
          (def) => !existingTypes.includes(def.type),
        );
        await Word.findByIdAndUpdate(existing._id, {
          pinyin: wordData.pinyin,
          pinyinNormalized: wordData.pinyinNormalized,
          hskLevel: wordData.hskLevel,
          source: wordData.source,
          characters: wordData.characters,
          $push: { definitions: { $each: newDefinitions } },
        });
        updatedCount++;
      }
    }

    res.json({
      message: `Import hoàn tất: ${insertedCount} từ mới, ${updatedCount} từ đã cập nhật`,
      inserted: insertedCount,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({
      message: "Import Failed!",
      error: error.message,
    });
  }
});

// GET /api/words/export
router.get("/export", async (req, res) => {
  try {
    const { format = "xlsx", hskLevel, status, type } = req.query;

    const query = {};
    if (hskLevel) query.hskLevel = hskLevel;
    if (status) query.status = status;
    if (type) query["definitions.type"] = type;

    const words = await Word.find(query).sort({
      hskLevel: 1,
      createdAt: 1,
    });

    if (words.length === 0) {
      return res.status(404).json({ message: "Không có từ nào để export!" });
    }

    const rows = [];
    for (const word of words) {
      if (word.definitions.length === 0) {
        rows.push({
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          type: "",
          meanings: "",
          level: word.hskLevel,
          source: word.source || "",
          status: word.status,
        });
      } else {
        for (const def of word.definitions) {
          rows.push({
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            type: def.type,
            meanings: def.meanings.join("/"),
            level: word.hskLevel,
            source: word.source || "",
            status: word.status,
          });
        }
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Words");

    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 22 },
      { wch: 40 },
      { wch: 8 },
      { wch: 12 },
      { wch: 10 },
    ];

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `words_export_${timestamp}`;

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.csv"`,
      );
      res.send("\uFEFF" + csv);
    } else {
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.xlsx"`,
      );
      res.send(buffer);
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Export thất bại!", error: error.message });
  }
});

// GET /api/words/review/stats?hskLevel=HSK2
router.get("/review/stats", async (req, res) => {
  try {
    const { hskLevel, source } = req.query;
    const query = {};
    if (hskLevel) query.hskLevel = hskLevel;
    if (source) query.source = source;

    const [total, reviewed] = await Promise.all([
      Word.countDocuments(query),
      Word.countDocuments({ ...query, status: "Đã Ôn" }),
    ]);

    res.json({
      total,
      reviewed,
      unreviewed: total - reviewed,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server:", error: error.message });
  }
});

// GET /api/words/review/session?hskLevel=HSK2&limit=20
router.get("/review/session", async (req, res) => {
  try {
    const { hskLevel, source, limit = 20 } = req.query;
    const query = { status: "Chưa Ôn" };
    if (hskLevel) query.hskLevel = hskLevel;
    if (source) query.source = source;

    const unreviewed = await Word.countDocuments(query);
    if (unreviewed === 0) {
      return res.status(400).json({
        message: "Tất cả các từ đã được ôn. Hãy làm mới để ôn lại từ đầu!",
        shouldReset: true,
      });
    }

    const actualLimit = Math.min(Number(limit), unreviewed);
    const words = await Word.aggregate([
      {
        $match: query,
      },
      { $sample: { size: actualLimit } },
    ]);

    res.json({ words, total: unreviewed, selected: actualLimit });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server:", error: error.message });
  }
});

// POST /api/words/review/complete
router.post("/review/complete", async (req, res) => {
  try {
    const { remembered, forgotten } = req.body;
    const now = new Date();
    await Promise.all([
      Word.updateMany(
        { _id: { $in: remembered } },
        { status: "Đã Ôn", lastReviewedAt: now, $inc: { reviewCount: 1 } },
      ),
      Word.updateMany(
        { _id: { $in: forgotten } },
        { lastReviewedAt: now, $inc: { reviewCount: 1 } },
      ),
    ]);
    res.json({ message: "Lưu kết quả thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server:", error: error.message });
  }
});

// POST /api/words/review/reset
router.post("/review/reset", async (req, res) => {
  try {
    const { hskLevel, source } = req.body;
    const query = {};
    if (hskLevel) query.hskLevel = hskLevel;
    if (source) query.source = source;
    await Word.updateMany(query, { status: "Chưa Ôn" });
    const total = await Word.countDocuments(query);
    res.json({ message: `Đã làm mới ${total} từ về 'Chưa Ôn'!`, total });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server:", error: error.message });
  }
});

// GET /api/words/:id
router.get("/:id", async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: "Word Not Found!" });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({
      message: "There are some bugs found on server!",
      error: error.message,
    });
  }
});

// PUT /api/words/:id
router.put("/:id", async (req, res) => {
  try {
    const { hanzi, pinyin } = req.body;

    // Hanzi is modified, update its characters
    if (hanzi) {
      req.body.characters = splitHanzi(hanzi);
    }

    if (pinyin) req.body.pinyinNormalized = removeTones(pinyin);
    const updated = await Word.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Word Not Found!" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "There are some bugs found on server!",
      error: error.message,
    });
  }
});

// DELETE /api/words/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Word.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Word Not Found!" });
    }
    res.json({ message: "Deleted Successfully!", word: deleted });
  } catch (error) {
    res.status(500).json({
      message: "There are some bugs found on server!",
      error: error.message,
    });
  }
});

// PATCH /api/words/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: "Không tìm thấy từ!" });
    }

    word.status = word.status === "Chưa Ôn" ? "Đã Ôn" : "Chưa Ôn";
    await word.save();
    res.json(word);
  } catch (error) {
    res.status(500).json({
      message: "There are some bugs found on server!",
      error: error.message,
    });
  }
});

module.exports = router;
