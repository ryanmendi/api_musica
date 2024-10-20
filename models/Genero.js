const mongoose = require("mongoose");

const Genero = mongoose.model("Genero", {
    nome_genero: { type: String, required: true }
});

module.exports = Genero;
