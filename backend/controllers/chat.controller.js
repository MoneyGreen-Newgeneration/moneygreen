const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    const conversations = {};
    messages.forEach((msg) => {
      const uid = msg.userId?._id?.toString();
      if (uid && !conversations[uid]) {
        conversations[uid] = {
          userId: uid,
          username: msg.userId.username,
          email: msg.userId.email,
          lastMessage: msg.text,
          lastAt: msg.createdAt,
          unread: 0,
        };
      }
      if (uid && msg.sender === "client" && !msg.read) {
        conversations[uid].unread += 1;
      }
    });
    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reader } = req.body;
    const senderToMark = reader === "admin" ? "client" : "admin";
    await Message.updateMany(
      { userId, sender: senderToMark, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, getAllConversations, markAsRead };
