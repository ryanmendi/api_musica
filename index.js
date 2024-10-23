const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Plano = require('./models/plano');
const Usuario = require('./models/Usuario');
const Genero = require('./models/Genero');
const Musica = require('./models/Musica');

const app = express();
const PORT = 3000;

// Configuração da criptografia
const cipher = {
    algorithm: 'aes256',
    secret: 'chaves',
    type: 'hex'
};

// Função para criptografar senhas
async function getCrypto(password) {
    return new Promise((resolve, reject) => {
        const cipherStream = crypto.createCipher(cipher.algorithm, cipher.secret);
        let encryptedData = '';

        cipherStream.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipherStream.read())) {
                encryptedData += chunk.toString(cipher.type);
            }
        });

        cipherStream.on('end', () => {
            resolve(encryptedData);
        });

        cipherStream.on('error', (error) => {
            reject(error);
        });

        cipherStream.write(password);
        cipherStream.end();
    });
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota 1
app.get('/', (req, res) => {
    res.json({ message: 'funciona' });
});

// -- Rota Plano -- //

//rota get para puxar a media de preço dos planos cadastrados
app.get("/plano/media-preco", async (req, res) => {
    try {
        const planos = await Plano.find(); // Busca todos os planos
        if (planos.length === 0) {
            return res.status(200).json({ media: 0 }); // Retorna 0 se não houver planos
        }

        const totalPreco = planos.reduce((acc, plano) => acc + plano.preco, 0); // Soma os preços
        const mediaPreco = totalPreco / planos.length; // Calcula a média

        res.status(200).json({ media: mediaPreco }); // Retorna a média
    } catch (error) {
        res.status(500).json({ erro: error });
        console.log("não funfo")
    }
});
 
// Create
app.post('/plano', async (req, res) => {
    const { nome_plano, preco, beneficios } = req.body;

    const plano = {
        nome_plano,
        preco,
        beneficios
    };

    try {
        await Plano.create(plano);
        res.status(200).json({ message: "Plano inserido" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read
app.get("/plano", async (req, res) => {
    try {
        const planos = await Plano.find();
        res.status(200).json(planos);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read by ID
app.get("/plano/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const plano = await Plano.findOne({ _id: id });
        if (!plano) {
            res.status(422).json({ message: "Plano não encontrado!" });
            return;
        }
        res.status(200).json(plano);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Update
app.patch("/plano/:id", async (req, res) => {
    const id = req.params.id;
    const { nome_plano, preco, beneficios } = req.body;

    const plano = {
        nome_plano,
        preco,
        beneficios
    };

    try {
        const updatePlano = await Plano.updateOne({ _id: id }, plano);
        if (updatePlano.matchedCount === 0) {
            res.status(422).json({ message: "O Plano não foi encontrado!" });
            return;
        }
        res.status(200).json({ message: "Plano atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Delete
app.delete("/plano/:id", async (req, res) => {
    const id = req.params.id;

    const plano = await Plano.findOne({ _id: id });
    if (!plano) {
        res.status(422).json({ mensagem: "Plano não encontrado!" });
        return;
    }

    try {
        await Plano.deleteOne({ _id: id });
        res.status(200).json({ mensagem: "Plano removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// -- Rota Usuário -- //

//rota get que pega a receita mensal da empresa baseada no plano dos usuarios
app.get("/user/soma-precos-planos", async (req, res) => {
    try {
        // Encontrar todos os usuários e popular o campo de plano
        const usuarios = await Usuario.find().populate('fk_plano_id_plano');

        // Somar os preços dos planos
        const totalPreco = usuarios.reduce((total, usuario) => {
            const plano = usuario.fk_plano_id_plano; // Assume que fk_plano_id_plano é populado
            return total + (plano ? plano.preco : 0); // Adiciona o preço se o plano existir
        }, 0);

        res.status(200).json({ total: totalPreco });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


// Create
app.post('/user', async (req, res) => {
    const { nome_user, email_user, senha_user, fk_plano_id_plano } = req.body;
    const encryptedPassword = await getCrypto(senha_user);

    const user = {
        nome_user,
        email_user,
        senha_user: encryptedPassword,
        fk_plano_id_plano
    };

    try {
        await Usuario.create(user);
        res.status(200).json({ message: 'Usuário inserido' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read
app.get("/user", async (req, res) => {
    try {
        const users = await Usuario.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read by ID
app.get("/user/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Usuario.findOne({ _id: id });
        if (!user) {
            res.status(422).json({ message: "Usuário não encontrado!" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read by email and senha
// Login do Usuário
app.post("/user/login", async (req, res) => {
    const { email_user, senha_user } = req.body;
    try {
        // Criptografar a senha fornecida
        const encryptedPassword = await getCrypto(senha_user);

        // Buscar o usuário pelo email e senha criptografada
        const user = await Usuario.findOne({ email_user, senha_user: encryptedPassword });
        if (!user) {
            res.status(422).json({ message: "Credenciais inválidas!" });
            return;
        }

        res.status(200).json({ message: "Usuário encontrado", user });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});


// Update
app.patch("/user/:id", async (req, res) => {
    const id = req.params.id;
    const { nome_user, email_user, senha_user, fk_plano_id_plano } = req.body;

    const user = {
        nome_user,
        email_user,
        senha_user: senha_user ? await getCrypto(senha_user) : undefined,
        fk_plano_id_plano
    };

    try {
        const updateUser = await Usuario.updateOne({ _id: id }, user);
        if (updateUser.matchedCount === 0) {
            res.status(422).json({ message: "O Usuário não foi encontrado!" });
            return;
        }
        res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Delete
app.delete("/user/:id", async (req, res) => {
    const id = req.params.id;

    const user = await Usuario.findOne({ _id: id });
    if (!user) {
        res.status(422).json({ mensagem: "Usuário não encontrado!" });
        return;
    }

    try {
        await Usuario.deleteOne({ _id: id });
        res.status(200).json({ mensagem: "Usuário removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// -- Rota Musica -- //

//rota get que conta quantas musicas tem mais de um genero
app.get("/music/contar-multigenero", async (req, res) => {
    try {
        const totalMusicasMultigenero = await Musica.countDocuments({
            fk_genero_id_genero: { $exists: true, $type: "array", $not: { $size: 0 } }, // Verifica se é um array e não vazio
            $expr: { $gt: [{ $size: "$fk_genero_id_genero" }, 1] } // Conta músicas com mais de um gênero
        });

        res.status(200).json({ total: totalMusicasMultigenero });
    } catch (error) {
        res.status(500).json({ erro: error });
        console.log("nao funfo")
    }
});

//rota get que mostra o total de musicas inseridas
app.get("/music/total", async (req, res) => {
    try {
        const totalMusicas = await Musica.countDocuments(); // Conta o número de documentos na coleção Musica
        res.status(200).json({ total: totalMusicas }); // Retorna o total em um objeto JSON
    } catch (error) {
        res.status(500).json({ erro: error }); // Em caso de erro, retorna o erro
        console.log("nao funfo")
    }
});


// Create
app.post('/music', async (req, res) => {
    const { nome_music, autor, fk_genero_id_genero } = req.body;

    const music = {
        nome_music,
        autor,
        fk_genero_id_genero
    };

    try {
        await Musica.create(music);
        res.status(200).json({ message: "Música inserida" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read
app.get("/music", async (req, res) => {
    try {
        const musicas = await Musica.find();
        res.status(200).json(musicas);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read by ID
app.get("/music/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const music = await Musica.findOne({ _id: id });
        if (!music) {
            res.status(422).json({ message: "Música não encontrada!" });
            return;
        }
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Update
app.patch("/music/:id", async (req, res) => {
    const id = req.params.id;
    const { nome_music, autor, fk_genero_id_genero } = req.body;

    const music = {
        nome_music,
        autor,
        fk_genero_id_genero
    };

    try {
        const updateMusica = await Musica.updateOne({ _id: id }, music);
        if (updateMusica.matchedCount === 0) {
            res.status(422).json({ message: "A música não foi encontrada!" });
            return;
        }
        res.status(200).json({ message: "Música atualizada com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Delete
app.delete("/music/:id", async (req, res) => {
    const id = req.params.id;

    const music = await Musica.findOne({ _id: id });
    if (!music) {
        res.status(422).json({ mensagem: "Música não encontrada!" });
        return;
    }

    try {
        await Musica.deleteOne({ _id: id });
        res.status(200).json({ mensagem: "Música removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// -- Rota Genero -- //

// Create
app.post('/genero', async (req, res) => {
    const { nome_genero } = req.body;

    const genero = {
        nome_genero
    };

    try {
        await Genero.create(genero);
        res.status(200).json({ message: "Gênero inserido" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read
app.get("/genero", async (req, res) => {
    try {
        const generos = await Genero.find();
        res.status(200).json(generos);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read by ID
app.get("/genero/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const genero = await Genero.findOne({ _id: id });
        if (!genero) {
            res.status(422).json({ message: "Gênero não encontrado!" });
            return;
        }
        res.status(200).json(genero);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Update
app.patch("/genero/:id", async (req, res) => {
    const id = req.params.id;
    const { nome_genero } = req.body;

    const genero = {
        nome_genero
    };

    try {
        const updateGenero = await Genero.updateOne({ _id: id }, genero);
        if (updateGenero.matchedCount === 0) {
            res.status(422).json({ message: "O Gênero não foi encontrado!" });
            return;
        }
        res.status(200).json({ message: "Gênero atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Delete
app.delete("/genero/:id", async (req, res) => {
    const id = req.params.id;

    const genero = await Genero.findOne({ _id: id });
    if (!genero) {
        res.status(422).json({ mensagem: "Gênero não encontrado!" });
        return;
    }

    try {
        await Genero.deleteOne({ _id: id });
        res.status(200).json({ mensagem: "Gênero removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Conexão com o MongoDB
mongoose.connect("mongodb://localhost:27017/music").then(() => {
    console.log("Uhull, conectamo!");
}).catch(err => {
    console.error("Erro ao conectar ao MongoDB", err);
});
