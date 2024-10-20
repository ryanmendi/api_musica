const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Plano = require('./models/plano');
const Usuario = require('./models/Usuario');
const Genero = require('./models/Genero');
const Musica = require('./models/Musica');

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

// rota 1
app.get('/', (req, res) => {
    res.json({ message: 'funciona' });
});

//puxando da pasta routes
//const planoRoutes = require('./routes/planoRoutes');
//Uso das rotas
//app.use('/plano', planoRoutes);

//--Rota Plano--// 

//create
app.post('/plano', async(req, res)=> {
    const {nome_plano, preco, beneficios} = req.body;
 
    const plano = {
        nome_plano,
        preco,
        beneficios
    }
 
    try{
        await Plano.create(plano)
        res.status(200).json({message : "Plano inserido"})
    } catch(error){
        res.status(500).json({erro: error})
    }
})
 
//read
app.get("/plano", async (req, res) =>{
    try{
        const plano = await Plano.find()
        res.status(200).json(plano)
    }catch(error){
        res.status(500).json({erro: error})
    }
})
 
//read by id
app.get("/plano/:id", async (req, res)=>{
    const id = req.params.id
    try{
        const plano = await Plano.findOne({_id: id})
 
        if(!plano){
            res.status(422).json({message: "Plano não encontrado!"})
            return
        }
 
    res.status(200).json(plano)
   
    } catch(error){
        res.status(500).json({erro: error})
    }
})
 
//update
app.patch("/plano/:id", async (req, res)=>{
    const id = req.params.id
 
    const {nome_plano, preco, beneficios} = req.body;
 
    const plano = {
        nome_plano,
        preco,
        beneficios
    }
 
    try{
        const updatePlano = await Plano.updateOne({_id: id}, plano)
 
        if(updatePlano.matchedCount === 0){
            res.status(422).json({message: "O Plano não foi encontrado!"})
            return
        }
        res.status(200).json(Plano)
    } catch(error){
        res.status(500).json({erro: eroor})
    }
})
 
//delete
app.delete("/plano/:id", async (req, res)=>{
 
    const id = req.params.id
 
    const plano = await Plano.findOne({_id: id})
 
    if(!plano){
        res.status(422).json({menssage: "Plano não encontrado!"})
        return
    }
 
    try{
        await Plano.deleteOne({_id: id})
        res.status(200).json({menssage: "Plano removido com sucesso!"})
    }catch(error){
        res.status(500).json({erro: error})
    }
})
 
//--Rota Usuario--//

//create
app.post('/user', async(req, res)=> {
    const {nome_user, email_user, senha_user, fk_plano_id_plano} = req.body;
 
    const user = {
        nome_user,
        email_user,
        senha_user,
        fk_plano_id_plano
    }
 
    try{
        await Usuario.create(user)
        res.status(200).json({message : "Usuário inserido"})
    } catch(error){
        res.status(500).json({erro: error})
    }
})

//read
app.get("/user", async (req, res) =>{
    try{
        const user = await Usuario.find()
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({erro: error})
    }
})

//read by id
app.get("/user/:id", async (req, res)=>{
    const id = req.params.id
    try{
        const user = await Usuario.findOne({_id: id})
 
        if(!user){
            res.status(422).json({message: "Usuário não encontrado!"})
            return
        }
 
    res.status(200).json(user)
   
    } catch(error){
        res.status(500).json({erro: error})
    }
})

//update
app.patch("/user/:id", async (req, res)=>{
    const id = req.params.id
 
    const {nome_user, email_user, senha_user, fk_plano_id_plano} = req.body;
 
    const user = {
        nome_user,
        email_user,
        senha_user,
        fk_plano_id_plano
    }
 
    try{
        const updateUser = await Usuario.updateOne({_id: id}, user)
 
        if(updateUser.matchedCount === 0){
            res.status(422).json({message: "O Usuário não foi encontrado!"})
            return
        }
        res.status(200).json(Usuario)
    } catch(error){
        res.status(500).json({erro: eroor})
    }
})

//delete
app.delete("/user/:id", async (req, res)=>{
 
    const id = req.params.id
 
    const user = await Usuario.findOne({_id: id})
 
    if(!user){
        res.status(422).json({menssage: "Usuário não encontrado!"})
        return
    }
 
    try{
        await Usuario.deleteOne({_id: id})
        res.status(200).json({menssage: "Usuário removido com sucesso!"})
    }catch(error){
        res.status(500).json({erro: error})
    }
})

//--Rota Musica--//

//create
app.post('/music', async(req, res)=> {
    const {nome_music, autor, fk_genero_id_genero} = req.body;
 
    const music = {
        nome_music,
        autor,
        fk_genero_id_genero
    }
 
    try{
        await Musica.create(music)
        res.status(200).json({message : "Musica inserida"})
    } catch(error){
        res.status(500).json({erro: error})
    }
})

//read
app.get("/music", async (req, res) =>{
    try{
        const music = await Musica.find()
        res.status(200).json(music)
    }catch(error){
        res.status(500).json({erro: error})
    }
})

//read by id
app.get("/music/:id", async (req, res)=>{
    const id = req.params.id
    try{
        const music = await Musica.findOne({_id: id})
 
        if(!music){
            res.status(422).json({message: "Musica não encontrada!"})
            return
        }
 
    res.status(200).json(music)
   
    } catch(error){
        res.status(500).json({erro: error})
    }
})

//update
app.patch("/music/:id", async (req, res)=>{
    const id = req.params.id
 
    const {nome_music, autor, fk_genero_id_genero} = req.body;
 
    const music = {
        nome_music,
        autor,
        fk_genero_id_genero
    }

    try{
        const updateMusica = await Musica.updateOne({_id: id}, music)
 
        if(updateMusica.matchedCount === 0){
            res.status(422).json({message: "A musica não foi encontrada!"})
            return
        }
        res.status(200).json(Musica)
    } catch(error){
        res.status(500).json({erro: eroor})
    }
})

//delete
app.delete("/music/:id", async (req, res)=>{
 
    const id = req.params.id
 
    const music = await Musica.findOne({_id: id})
 
    if(!music){
        res.status(422).json({menssage: "Musica não encontrada!"})
        return
    }
 
    try{
        await Musica.deleteOne({_id: id})
        res.status(200).json({menssage: "Musica removida com sucesso!"})
    }catch(error){
        res.status(500).json({erro: error})
    }
})

//--Rota Genero--//

//create
app.post('/genero', async(req, res)=> {
    const {nome_genero} = req.body;
 
    const genero = {
        nome_genero,
    }
 
    try{
        await Genero.create(genero)
        res.status(200).json({message : "Gênero musical inserido"})
    } catch(error){
        res.status(500).json({erro: error})
    }
})

//read
app.get("/genero", async (req, res) =>{
    try{
        const genero = await Genero.find()
        res.status(200).json(genero)
    }catch(error){
        res.status(500).json({erro: error})
    }
})

//read by id
app.get("/genero/:id", async (req, res)=>{
    const id = req.params.id
    try{
        const genero = await Genero.findOne({_id: id})
 
        if(!genero){
            res.status(422).json({message: "Gênero não encontrado!"})
            return
        }
 
    res.status(200).json(genero)
   
    } catch(error){
        res.status(500).json({erro: error})
    }
})

//update
app.patch("/genero/:id", async (req, res)=>{
    const id = req.params.id
 
    const {nome_genero} = req.body;
 
    const genero = {
        nome_genero,
    }

    try{
        const updateGenero = await Genero.updateOne({_id: id}, genero)
 
        if(updateGenero.matchedCount === 0){
            res.status(422).json({message: "O Gênero não foi encontrado!"})
            return
        }
        res.status(200).json(Genero)
    } catch(error){
        res.status(500).json({erro: eroor})
    }
})

//delete
app.delete("/genero/:id", async (req, res)=>{
 
    const id = req.params.id
 
    const genero = await Genero.findOne({_id: id})
 
    if(!genero){
        res.status(422).json({menssage: "Gênero não encontrado!"})
        return
    }
 
    try{
        await Genero.deleteOne({_id: id})
        res.status(200).json({menssage: "Gênero removido com sucesso!"})
    }catch(error){
        res.status(500).json({erro: error})
    }
})

// conexão
mongoose.connect("mongodb://localhost:27017/music").then(() => {
    console.log("Uhull, conectamo!");
}).catch(err => {
    console.error("Erro ao conectar ao MongoDB", err);
});
