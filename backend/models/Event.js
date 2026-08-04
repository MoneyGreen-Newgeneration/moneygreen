const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    anonId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
