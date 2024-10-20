const mongoose = require("mongoose");

const Usuario = mongoose.model("Usuario", {
    nome_user: { type: String, required: true },
    email_user: { type: String, required: true, unique: true },
    senha_user: { type: String, required: true },
    fk_plano_id_plano: { type: mongoose.Schema.Types.ObjectId, ref: 'Plano' }, // objectId é a forma em que o mongo gurda o id no banco
});

module.exports = Usuario;
