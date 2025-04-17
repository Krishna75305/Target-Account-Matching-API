const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  matchScore: { type: Number, required: true, min: 0, max: 1 },
  status: {
    type: String,
    required: true,
    enum: ["Researching", "Pending", "Approved", "Declined", "Target"],
    default: "Researching",
  },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Account", accountSchema);
