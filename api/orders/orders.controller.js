const express = require("express");
const router = express.Router();
const ordersHandler = require("./orders.handler");

router.post("/", async (req, res) => {
    const dadosSalvos = await ordersHandler.cadastrarPedidos(req.body);
    res.json(dadosSalvos);
});

router.post("/fechar", async (req, res) => {
    const dadosSalvos = await ordersHandler.fecharPedido(req.body);
    res.json(dadosSalvos);
});


router.get("/", async (req, res) => {
    const dados = await ordersHandler.mostrarPedidos();
    res.json(dados);
});

module.exports = router;