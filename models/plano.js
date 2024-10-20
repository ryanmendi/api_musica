const mongoose = require("mongoose");

const Plano = mongoose.model("Plano", {
    nome_plano: { type: String, required: true },
    preco: { type: Number, required: true },
    beneficios: { type: String, required: true }
});

module.exports = Plano;
