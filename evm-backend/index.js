const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/evm_chain", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// Define schema
const transactionSchema = new mongoose.Schema({}, { strict: false });
const Transaction = mongoose.model("Transaction", transactionSchema);

// API endpoint
app.get("/api/transactions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments();
    const data = await Transaction.find()
      .skip(skip)
      .limit(limit)
      
    res.json({
      data,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
