const express = require("express");
const router = express.Router();
const orderproductsHandler = require("./orderproducts.handler");

router.post("/", async (req, res) => {
    const dadosSalvos = await orderproductsHandler.adicionarProdutos(req.body);
    res.json(dadosSalvos);
});

router.delete("/:cod", async (req, res) => {
    const dadosSalvos = await orderproductsHandler.removerProdutos(req.params.cod, req.body);
    res.json(dadosSalvos);
});

router.get("/", async (req, res) => {
    const dados = await orderproductsHandler.mostrarPedidos();
    res.json(dados);
});

module.exports = router;