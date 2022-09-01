const crud = require("../../crud");
const nomeTabela = "OrdersProducts";

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
    if (await verificarListaProdutos(dados.productId)) {
        return {
            error: "0003",
            message: "Not found",
            situacao: "Produto indisponível"
        }
    }
    if (await verificarPedidoOrder(dados.orderId)) {
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

async function removerProdutos(productId, dados = { orderproductsId: "" }) {
    if (!dados.orderproductsId) {
        return {
            error: "0001",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["orderproductsId"]
        }
    }
    if (!productId) {
        return {
            error: "0002",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["productId"]
        }
    }
    if (await verificarProduto(productId)) {
        return {
            error: "0003",
            message: "Not found",
            situacao: "Produto indisponível"
        }
    }
    if (await verificarPedido(dados.orderproductsId)) {
        return {
            error: "0004",
            message: "Not found",
            situacao: "Este pedido não existe"
        }
    }
    if (await pedidosEmRemove(dados.orderproductsId)) {
        return {
            error: "0005",
            message: "Not found",
            situacao: "Este pedido está fechado"
        }
    }

    const removido = await remover(productId, dados.orderproductsId);
    console.log("rem", removido);
    if(removido == undefined){
        return {
            error: "0006",
            message: "Not found",
            situacao: "Este pedido está zerado! Documento removido!"
        }
    }
    const variavel = await crud.getById(nomeTabela, dados.orderproductsId);
    console.log("var1", variavel);
    variavel.productId = removido;
    console.log("var2", variavel);
    await crud.save(nomeTabela, dados.orderproductsId, variavel);
    return variavel;
}

async function remover(productId, orderproductsId) {
    let newProduto = [];
    let lista = await crud.getById(nomeTabela, orderproductsId);
    for (let i = 0; i < lista.productId.length; i++) {
        if (lista.productId[i] == productId) {
            const dados = await crud.remove(nomeTabela, productId);
        } else {
            newProduto.push(lista.productId[i]);
        }
    }
    if(newProduto.length < 1){
        console.log("entrou aqui");
        const res = await crud.remove(nomeTabela, orderproductsId);
        return res;
    }
    return newProduto;
}

async function mostrarPedidos() {
    const mostrar = await crud.get(nomeTabela);
    return mostrar;
}

async function pedidosEmAberto(orderId) {
    console.log("order", orderId)
    let existe = false;
    try {
        const verifOrder = await crud.get("Orders");
        for (let i = 0; i < verifOrder.length; i++) {
            if (verifOrder[i].id == orderId) {
                if (verifOrder[i].status == "Fechado") {
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

async function pedidosEmRemove(orderproductsId) {
    let existe = false;
    let newProd = await crud.getById(nomeTabela, orderproductsId);
    try {
        const verifOrder = await crud.get("Orders");
        for (let i = 0; i < verifOrder.length; i++) {
            if (verifOrder[i].id == newProd.orderId) {
                if (verifOrder[i].status == "Fechado") {
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

async function verificarListaProdutos(list = []) {
    let naoCadastrado = false;
    for (const id of list) {
        try {
            await crud.getById("Products", id);
        } catch (erro) {
            naoCadastrado = true
            return naoCadastrado;
        }
    }
    return naoCadastrado;
}

async function verificarProduto(productId) {
    let naoCadastrado = false;
        try {
            await crud.getById("Products", productId);
        } catch (erro) {
            naoCadastrado = true
            return naoCadastrado;
        }
    return naoCadastrado;
}


async function verificarPedido(orderproductsId) {
    let existe = false;
    try {
        await crud.getById("OrdersProducts", orderproductsId);
    } catch (erro) {
        existe = true
        return existe;
    }
    return existe;
}

async function verificarPedidoOrder(orderId) {
    let existe = false;
    try {
        await crud.getById("Orders", orderId);
    } catch (erro) {
        existe = true
        return existe;
    }
    return existe;
}

module.exports = {
    adicionarProdutos,
    mostrarPedidos,
    removerProdutos
}