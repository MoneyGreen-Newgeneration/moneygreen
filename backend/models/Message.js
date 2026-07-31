const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: String, enum: ["client", "admin"], required: true },
  text: { type: String, default: "" },
  imageUrl: { type: String, default: null },
  read: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  replyPreview: {
    text: { type: String, default: "" },
    sender: { type: String, default: "" },
  },
}, { timestamps: true });
module.exports = mongoose.model("Message", messageSchema);
