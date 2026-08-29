const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendPasswordResetEmail, FRONTEND_URL } = require("../mailer");

const register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    if (!phoneNumber) {
      return res.status(400).json({ message: "WhatsApp phone number required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).json({ message: "Ce numéro de téléphone est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();

    // On connecte directement l'utilisateur apres inscription (meme forme de
    // reponse que /login) pour lui eviter une double saisie de ses identifiants.
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    };

    res.status(201).json({
      message: "User created successfully",
      token,
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    };

    res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Demande de reinitialisation : on repond toujours le meme message generique,
// que l'email corresponde ou non a un compte, pour ne pas laisser un
// attaquant deviner quelles adresses sont enregistrees.
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Adresse email requise." });
    }

    const genericMessage = "Si un compte existe avec cette adresse email, un lien de réinitialisation vient de lui être envoyé.";

    const user = await User.findOne({ email });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
      await user.save();

      const resetLink = `${FRONTEND_URL}/reinitialiser-mot-de-passe?token=${rawToken}`;
      // Jamais attendu : un envoi lent ne doit pas retarder la reponse, et on
      // renvoie le meme message que l'email existe ou non.
      sendPasswordResetEmail(user, resetLink);
    }

    res.json({ message: genericMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Reconnecte directement le client : c'est tout l'interet de ce flux
    // (faciliter le retour dans son espace), pas la peine de lui refaire
    // saisir ses identifiants juste apres qu'il vient de choisir un mot de passe.
    const jwtToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    };

    res.json({ message: "Mot de passe réinitialisé.", token: jwtToken, user: safeUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
