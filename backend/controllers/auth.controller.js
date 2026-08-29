const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { buildPhoneCandidates, normalizePhoneForStorage } = require("../utils/phone");
const { isRateLimited } = require("../utils/rateLimit");

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

    const phoneExists = await User.findOne({ phoneNumber: { $in: buildPhoneCandidates(phoneNumber) } });
    if (phoneExists) {
      return res.status(400).json({ message: "Ce numéro de téléphone est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      phoneNumber: normalizePhoneForStorage(phoneNumber),
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

    // Les comptes existants ont ete crees avec des formats de numero
    // heterogenes (indicatif present ou non, "+" ou non, "0" initial ou non) :
    // on compare toutes les variantes plausibles plutot qu'une chaine exacte.
    const user = await User.findOne({ phoneNumber: { $in: buildPhoneCandidates(phoneNumber) } }).select("+password");
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

// Reinitialisation directe par numero de telephone, sans verification
// supplementaire (email, code...) : choix assume pour reduire au maximum la
// friction de reconnexion, le numero de telephone servant deja d'identifiant
// de connexion. Un rate-limit par IP evite qu'un tiers automatise des essais
// sur de nombreux numeros.
const resetPasswordByPhone = async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;
    if (!phoneNumber || !newPassword) {
      return res.status(400).json({ message: "Numéro de téléphone et nouveau mot de passe requis." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    if (isRateLimited(req.ip, 8, 15 * 60 * 1000)) {
      return res.status(429).json({ message: "Trop de tentatives. Réessayez plus tard." });
    }

    const user = await User.findOne({ phoneNumber: { $in: buildPhoneCandidates(phoneNumber) } });
    if (!user) {
      return res.status(400).json({ message: "Aucun compte trouvé avec ce numéro de téléphone." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
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

module.exports = { register, login, resetPasswordByPhone };
