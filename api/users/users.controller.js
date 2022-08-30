const express = require("express");
const router = express.Router();
const usersHandler = require("./users.handler");

router.post("/", async (req, res) => {
    const dadosSalvos = await usersHandler.cadastrarUsers(req.body);
    res.json(dadosSalvos);
});

router.get("/", async (req, res) => {
    const dados = await usersHandler.mostrarUsers();
    res.json(dados);
});

module.exports = router;