const mongoose = require("mongoose");
const teamMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderName: { type: String, required: true },
  text: { type: String, default: "" },
  imageUrl: { type: String, default: null },
  deleted: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMessage", default: null },
  replyPreview: {
    text: { type: String, default: "" },
    senderName: { type: String, default: "" },
  },
}, { timestamps: true });
module.exports = mongoose.model("TeamMessage", teamMessageSchema);
