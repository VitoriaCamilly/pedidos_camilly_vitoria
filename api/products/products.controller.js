const express = require("express");
const router = express.Router();
const productsHandler = require("./products.handler");

router.post("/", async (req, res) => {
    const dadosSalvos = await productsHandler.cadastrarProdutos(req.body);
    res.json(dadosSalvos);
});

router.get("/", async (req, res) => {
    const dados = await productsHandler.mostrarProdutos();
    res.json(dados);
});

module.exports = router;