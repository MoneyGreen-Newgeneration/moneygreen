const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Origine(s) autorisée(s) pour le CORS, configurable via .env.
// Supporte une liste séparée par des virgules pour gérer plusieurs
// environnements (ex: front local + front en prod).
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: corsOrigins, methods: ["GET", "POST"] }
});
app.set("io", io);

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const loanRoutes = require("./routes/loan.routes");
const adminRoutes = require("./routes/admin.routes");
const chatRoutes = require("./routes/chat.routes");
const uploadRoutes = require("./routes/upload.routes");
const teamchatRoutes = require("./routes/teamchat.routes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/teamchat", teamchatRoutes);

const Message = require("./models/Message");
const TeamMessage = require("./models/TeamMessage");

const onlineClients = new Map();
const onlineAdmins = new Set();

// ===== SECURITE SOCKET.IO =====
// Chaque connexion socket doit presenter un token JWT valide (envoye par le
// frontend via `io(url, { auth: { token } })`). Sans ca, la connexion est refusee.
// On ne fait plus jamais confiance a un userId/isAdmin envoye dans les evenements :
// on utilise uniquement socket.user, derive du token verifie.
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentification requise"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id, isAdmin: !!decoded.isAdmin };
    next();
  } catch (err) {
    next(new Error("Session invalide ou expirée"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connecté:", socket.id, socket.user.isAdmin ? "(admin)" : "");

  socket.on("join", () => {
    if (socket.user.isAdmin) return; // un admin n'a pas de room "client"
    const userId = socket.user.id;
    socket.join(userId);
    socket.data.userId = userId;
    if (!onlineClients.has(userId)) onlineClients.set(userId, new Set());
    onlineClients.get(userId).add(socket.id);
    io.to("admin").emit("user_status", { userId, online: true });
    // etat actuel de l'admin, envoye tout de suite (plus besoin de rafraichir)
    socket.emit("admin_status", { online: onlineAdmins.size > 0 });
  });

  socket.on("join_admin", () => {
    if (!socket.user.isAdmin) return; // securite : reserve aux admins
    socket.join("admin");
    socket.data.isAdmin = true;
    const wasEmpty = onlineAdmins.size === 0;
    onlineAdmins.add(socket.id);
    if (wasEmpty) io.emit("admin_status", { online: true });
    // liste des clients actuellement en ligne, envoyee tout de suite
    socket.emit("online_users", Array.from(onlineClients.keys()));
  });

  socket.on("typing", ({ userId }) => {
    if (socket.user.isAdmin) {
      if (!userId) return;
      io.to(userId).emit("typing", { sender: "admin" });
      io.to("admin").emit("typing", { userId, sender: "admin" });
    } else {
      const selfId = socket.user.id;
      io.to("admin").emit("typing", { userId: selfId, sender: "client" });
    }
  });

  socket.on("stop_typing", ({ userId }) => {
    if (socket.user.isAdmin) {
      if (!userId) return;
      io.to(userId).emit("stop_typing", { sender: "admin" });
      io.to("admin").emit("stop_typing", { userId, sender: "admin" });
    } else {
      const selfId = socket.user.id;
      io.to("admin").emit("stop_typing", { userId: selfId, sender: "client" });
    }
  });

  socket.on("team_typing", ({ senderName }) => {
    if (!socket.user.isAdmin) return;
    socket.to("admin").emit("team_typing", { senderId: socket.user.id, senderName });
  });

  socket.on("team_stop_typing", () => {
    if (!socket.user.isAdmin) return;
    socket.to("admin").emit("team_stop_typing", { senderId: socket.user.id });
  });

  socket.on("client_message", async ({ text, imageUrl, replyTo }) => {
    if (socket.user.isAdmin) return;
    try {
      const userId = socket.user.id;
      let replyPreview = undefined;
      if (replyTo) {
        const original = await Message.findById(replyTo);
        if (original) replyPreview = { text: original.deleted ? "Message supprime" : (original.text || (original.imageUrl ? "Photo" : "")), sender: original.sender };
      }
      const msg = await Message.create({ userId, sender: "client", text: text || "", imageUrl: imageUrl || null, replyTo: replyTo || null, replyPreview });
      io.to(userId).emit("new_message", msg);
      io.to("admin").emit("new_message", { ...msg.toObject(), userId });
    } catch (err) {
      console.error("Erreur message client:", err);
    }
  });

  socket.on("admin_message", async ({ userId, text, imageUrl, replyTo }) => {
    if (!socket.user.isAdmin) return;
    try {
      let replyPreview = undefined;
      if (replyTo) {
        const original = await Message.findById(replyTo);
        if (original) replyPreview = { text: original.deleted ? "Message supprime" : (original.text || (original.imageUrl ? "Photo" : "")), sender: original.sender };
      }
      const msg = await Message.create({ userId, sender: "admin", text: text || "", imageUrl: imageUrl || null, replyTo: replyTo || null, replyPreview });
      io.to(userId).emit("new_message", msg);
      io.to("admin").emit("new_message", { ...msg.toObject(), userId });
    } catch (err) {
      console.error("Erreur message admin:", err);
    }
  });

  socket.on("delete_message", async ({ messageId, userId }) => {
    try {
      const original = await Message.findById(messageId);
      if (!original) return;
      const isOwner = !socket.user.isAdmin && original.sender === "client" && original.userId.toString() === socket.user.id;
      const isAdminAuthor = socket.user.isAdmin && original.sender === "admin";
      if (!isOwner && !isAdminAuthor) return;

      await Message.findByIdAndUpdate(messageId, { deleted: true, text: "", imageUrl: null });
      io.to(userId).emit("message_deleted", { messageId });
      io.to("admin").emit("message_deleted", { messageId, userId });
    } catch (err) {
      console.error("Erreur delete_message:", err);
    }
  });

  socket.on("team_message", async ({ senderName, text, imageUrl, replyTo }) => {
    if (!socket.user.isAdmin) return;
    try {
      const senderId = socket.user.id;
      let replyPreview = undefined;
      if (replyTo) {
        const original = await TeamMessage.findById(replyTo);
        if (original) replyPreview = { text: original.deleted ? "Message supprime" : original.text, senderName: original.senderName };
      }
      const msg = await TeamMessage.create({ senderId, senderName, text: text || "", imageUrl: imageUrl || null, replyTo: replyTo || null, replyPreview, readBy: [senderId] });
      io.to("admin").emit("new_team_message", msg);
    } catch (err) {
      console.error("Erreur team_message:", err.message);
    }
  });

  socket.on("delete_team_message", async ({ messageId }) => {
    if (!socket.user.isAdmin) return;
    try {
      const original = await TeamMessage.findById(messageId);
      if (!original || original.senderId !== socket.user.id) return;
      await TeamMessage.findByIdAndUpdate(messageId, { deleted: true, text: "", imageUrl: null });
      io.to("admin").emit("team_message_deleted", { messageId });
    } catch (err) {
      console.error("Erreur delete_team_message:", err);
    }
  });

  socket.on("team_mark_read", async () => {
    if (!socket.user.isAdmin) return;
    try {
      const userId = socket.user.id;
      await TeamMessage.updateMany(
        { readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
      io.to("admin").emit("team_messages_read", { userId });
    } catch (err) {
      console.error("Erreur team_mark_read:", err);
    }
  });

  socket.on("mark_read", async ({ userId, reader }) => {
    try {
      if (reader === "admin" && !socket.user.isAdmin) return;
      if (reader === "client" && socket.user.id !== userId) return;

      const senderToMark = reader === "admin" ? "client" : "admin";
      await Message.updateMany(
        { userId, sender: senderToMark, read: false },
        { $set: { read: true } }
      );
      io.to(userId).emit("messages_read", { userId, reader });
      io.to("admin").emit("messages_read", { userId, reader });
    } catch (err) {
      console.error("Erreur mark_read:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket déconnecté:", socket.id);
    const { userId, isAdmin } = socket.data;
    if (userId && onlineClients.has(userId)) {
      onlineClients.get(userId).delete(socket.id);
      if (onlineClients.get(userId).size === 0) {
        onlineClients.delete(userId);
        io.to("admin").emit("user_status", { userId, online: false, lastSeen: new Date() });
      }
    }
    if (isAdmin) {
      onlineAdmins.delete(socket.id);
      if (onlineAdmins.size === 0) {
        io.emit("admin_status", { online: false, lastSeen: new Date() });
      }
    }
  });
});

app.get("/", (req, res) => res.send("🚀 Backend MoneyGreen2 fonctionne !"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté");
    server.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Serveur lancé sur le port 5000");
    });
  })
  .catch((err) => console.error("Erreur MongoDB:", err));
