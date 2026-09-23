const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { Grammar } = require('../models/Grammar');

// GET /api/grammar/test
router.get('/test', (req, res) => {
  res.json({ message: 'Grammars API is working' });
});

// GET /api/grammar
router.get('/', async (req, res) => {
  try {
    const {
      search,
      hskLevel,
      category,
      status,
      sort = 'createdAt',
      order = 'desc',
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
      query.$or = [
        { title: { $regex: search, $option: 'i' } },
        { structure: { $regex: search, $option: 'i' } },
        { explanation: { $regex: search, $option: 'i' } },
      ];
    }

    if (hskLevel) query.hskLevel = hskLevel;
    if (category) query.category = category;
    if (status) query.status = status;

    // Build sort
    const ALLOWED_SORTS = [
      'title',
      'hskLevel',
      'category',
      'status',
      'createdAt',
    ];
    const sortField = ALLOWED_SORTS.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortQuery = { [sortField]: sortOrder };

    // Execute query
    const [grammars, total] = await Promise.all([
      Grammar.find(query).sort(sortQuery).skip(skip).limit(pageLimit),
      Grammar.countDocuments(query),
    ]);

    // Return response
    res.json({
      grammars,
      pagination: {
        total,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// GET /api/grammar/ids
router.get('/ids', async (req, res) => {
  try {
    const {
      search,
      hskLevel,
      category,
      status,
      sort = 'hskLevel',
      order = 'asc',
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $option: 'i' } },
        { structure: { $regex: search, $option: 'i' } },
        { explanation: { $regex: search, $option: 'i' } },
      ];
    }
    if (hskLevel) query.hskLevel = hskLevel;
    if (category) query.category = category;
    if (status) query.status = status;

    const ALLOWED_SORTS = [
      'title',
      'hskLevel',
      'category',
      'status',
      'createdAt',
    ];
    const sortField = ALLOWED_SORTS.includes(sort) ? sort : 'hskLevel';
    const sortOrder = order === 'asc' ? 1 : -1;

    const grammars = await Grammar.find(query)
      .sort({ [sortField]: sortOrder })
      .select('_id');
    res.json({ ids: grammars.map((grammar) => grammar._id) });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// GET /api/grammar/review/stats
router.get('/review/stats', async (req, res) => {
  try {
    const { hskLevel } = req.query;
    const query = {};
    if (hskLevel) query.hskLevel = hskLevel;

    const [total, reviewed] = await Promise.all([
      Grammar.countDocuments(query),
      Grammar.countDocuments({ ...query, status: 'Đã Ôn' }),
    ]);

    res.json({ total, reviewed, unreviewed: total - reviewed });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// GET /api/grammary/review/session
router.get('/review/session', async (req, res) => {
  try {
    const { hskLevel, limit = 20 } = req.query;
    const query = { status: 'Chưa Ôn' };
    if (hskLevel) query.hskLevel = hskLevel;

    const unreviewed = await Grammar.countDocuments(query);
    if (unreviewed === 0) {
      return res.status(400).json({
        message: 'Tất cả điểm ngữ pháp đã được ôn. Hãy làm mới để ôn lại!',
        shoudReset: true,
      });
    }

    const actualLimit = Math.min(Number(limit), unreviewed);
    const grammars = await Grammar.aggregate([
      { $match: query },
      { $sample: { size: actualLimit } },
    ]);
    res.json({ grammars, total: unreviewed, selected: actualLimit });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// GET /api/grammar/:id
router.get('/:id', async (req, res) => {
  try {
    const grammar = await Grammar.findById(req.params.id);
    if (!grammar) {
      return res.status(404).json({ message: 'Không tìm thấy điểm ngữ pháp!' });
    }
    res.json(grammar);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// POST /api/grammar
router.post('/', async (req, res) => {
  try {
    const existing = await Grammar.findOne({ title: req.body.title?.trim() });
    if (existing) {
      return res
        .status(409)
        .json({ message: `"${req.body.title}" đã tồn tại!` });
    }
    const grammar = new Grammar(req.body);
    const saved = await grammar.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// PUT /api/grammar/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Grammar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy điểm ngữ pháp!' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// PATCH /api/grammar/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const grammar = await Grammar.findById(req.params.id);
    if (!grammar) {
      return res.status(404).json({ message: 'Không tìm thấy điểm ngữ pháp!' });
    }
    grammar.status = grammar.status === 'Chưa Ôn' ? 'Đã Ôn' : 'Chưa Ôn';
    await grammar.save();
    res.json(grammar);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// DELETE /api/grammar/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Grammar.findByIdAndUpdate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy điểm ngữ pháp!' });
    }
    res.json({ message: 'Xóa thành công!', grammar: deleted });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// POST /api/grammar/import
router.post('/import', async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of items) {
      const existing = await Grammar.findOne({ title: item.title });
      if (!existing) {
        await Grammar.create(item);
        insertedCount++;
      } else {
        await Grammar.findByIdAndUpdate(existing._id, item);
        updatedCount++;
      }
    }

    res.json({
      message: `Import hoàn tất: ${insertedCount} mới, ${updatedCount} cập nhật.`,
      inserted: insertedCount,
      updated: updatedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Import thất bại!', error: error.message });
  }
});

// POST /api/grammar/review/complete
router.post('/review/complete', async (req, res) => {
  try {
    const { remembered, forgotten } = req.body;
    const now = new Date();

    await Promise.all([
      Grammar.updateMany(
        { _id: { $in: remembered } },
        { status: 'Đã Ôn', lastReviewedAt: now },
      ),
      Grammar.updateMany({ _id: { $in: forgotten } }, { lastReviewedAt: now }),
    ]);

    res.json({ message: 'Lưu kết quả thành công!' });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

// POST /api/grammar/review/reset
router.post('/review/reset', async (req, res) => {
  try {
    const { hskLevel } = req.body;
    const query = {};
    if (hskLevel) query.hskLevel = hskLevel;

    await Grammar.updateMany(query, { status: 'Chưa Ôn' });
    const total = await Grammar.countDocuments(query);
    res.json({
      message: `Đã làm mới ${total} điểm ngữ pháp về Chưa Ôn!`,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server!',
      error: error.message,
    });
  }
});

module.exports = router;
