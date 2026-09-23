const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const wordRoutes = require('./routes/words');
const grammarRoutes = require('./routes/grammar');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/words', wordRoutes);
app.use('/api/grammar', grammarRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
