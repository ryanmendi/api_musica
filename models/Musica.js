const mongoose = require("mongoose");

const Musica = mongoose.model("Musica", {
    nome_music: { type: String, required: true },
    autor: { type: String, required: true },
    fk_genero_id_genero: { type: mongoose.Schema.Types.ObjectId, ref: 'Genero' }, // Referência ao gênero
});

module.exports = Musica;
