const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["auto", "immobilier", "scolaire", "personnel"],
      required: true,
    },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    neighborhood: { type: String, required: true },
    profession: { type: String, required: true },
    amount: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    monthlyIncome: { type: Number },
    purpose: { type: String },
    documents: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "payment_required", "payment_done", "approved", "rejected"],
      default: "pending",
    },
    // Empeche la creation d'un doublon si le client retente son envoi apres
    // un timeout reseau alors que le serveur avait deja enregistre la demande.
    idempotencyKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
