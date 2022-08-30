const crud = require("../../crud");
const nomeTabela = "OrdersProducts";
let contador = 1; let number; let status; let userId; let dado;

async function adicionarProdutos(dados = { productId: [], orderId: "" }) {
    if (!dados.orderId) {
        return {
            error: "0001",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["orderId"]
        }
    }
    if (!dados.productId) {
        return {
            error: "0002",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["productId"]
        }
    }
    if (await verificarProduto(dados.productId)) {
        return {
            error: "0003",
            message: "Not found",
            situacao: "Produto indisponível"
        }
    }
    if (await verificarPedido(dados.orderId)) {
        return {
            error: "0004",
            message: "Not found",
            situacao: "Este pedido não existe"
        }
    }
    if (await pedidosEmAberto(dados.orderId)) {
        return {
            error: "0005",
            message: "Not found",
            situacao: "Este pedido está fechado"
        }
    }
    const pedidos = await crud.save(nomeTabela, undefined, dados);
    return pedidos;
}

async function mostrarPedidos() {
    const mostrar = await crud.get(nomeTabela);
    return mostrar;
}

async function pedidosEmAberto(orderId) {
    let existe = false;
    try {
        const verifOrder = await crud.get("Orders");
        for (let i = 0; i < verifOrder.length; i++) {
            if (verifOrder[i].id == orderId) {
                if (verifOrder[i].status == "Aberto") {
                    return true;
                }
            }
        }
    } catch (erro) {
        existe = true
        return existe;
    }
    return existe;
}

async function verificarProduto(productId) {
    let existe = false;
    try {
        await crud.getById("Products", productId);
    } catch (erro) {
        existe = true
        return existe;
    }
    return existe;
}

async function verificarPedido(productId) {
    let existe = false;
    try {
        await crud.getById("Orders", productId);
    } catch (erro) {
        existe = true
        return existe;
    }
    return existe;
}

module.exports = {
    adicionarProdutos,
    mostrarPedidos
}