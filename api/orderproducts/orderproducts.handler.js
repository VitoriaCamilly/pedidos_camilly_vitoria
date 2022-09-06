const crud = require("../../crud");
const nomeTabela = "OrdersProducts";
let newQtd = 0;


async function adicionarProdutos(dados = { listProducts: {}, orderId: "" }) {
    if (!dados.orderId) {
        return {
            error: "0001",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["orderId"]
        }
    }
    if (!dados.listProducts) {
        return {
            error: "0002",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["listProducts"]
        }
    }
    if (await verificarListaProdutos(dados.listProducts)) {
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
    if (await mesmoPedido(dados.orderId)) {
        console.log("Inicio", dados);
        console.log("Inicio lista", dados.listProducts);
        const novaQuantidade = await adicionarQuantidade(dados.listProducts, dados);
        dados.listProducts = novaQuantidade;
        const add = await adicionarMesmo(dados);
        return add;
    } else {
        const pedidos = await crud.save(nomeTabela, undefined, dados);
        return pedidos;
    }
}

async function adicionarMesmo(dados) {
    const listaOrdersProducts = await crud.get(nomeTabela);
    if (listaOrdersProducts.length < 1) {
        const pedidos = await crud.save(nomeTabela, undefined, dados);
        return pedidos;
    }
    const listaAdiciona = [];
    for (let i = 0; i < listaOrdersProducts.length; i++) {
        listaAdiciona.push(listaOrdersProducts[i].orderId);
        if (listaAdiciona[i] == dados.orderId) {
            const pedidos = await crud.save(nomeTabela, listaOrdersProducts[i].id, dados);
            return pedidos;
        }

    }
}

async function removerProdutos(dados = { listProducts: {}, orderproductsId: "" }) {
    if (!dados.orderproductsId) {
        return {
            error: "0001",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["orderproductsId"]
        }
    }
    if (!dados.listProducts) {
        return {
            error: "0002",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["listProducts"]
        }
    }

    if (await verificarListaProdutos(dados.listProducts)) {
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

    const removido = await remover(dados);
    console.log("rem", removido);
    if (removido == undefined) {
        return {
            error: "0006",
            message: "Not found",
            situacao: "Este pedido está zerado! Documento removido!"
        }
    }
    const variavel = await crud.getById(nomeTabela, dados.orderproductsId);
    variavel.listProducts = removido;
    await crud.save(nomeTabela, dados.orderproductsId, variavel);
    return variavel;
}

async function remover(dados) {
    const listaOrdersProducts = await crud.get(nomeTabela);
    let novaLista = [];

    for (let i = 0; i < listaOrdersProducts.length; i++) {
        const pedidos = await crud.getById(nomeTabela, listaOrdersProducts[i].id);
        for (let m = 0; m < pedidos.listProducts.length; m++) {
            novaLista.push(pedidos.listProducts[m]);
        }
    }

    const produtosList = [];
    for (let k = 0; k < dados.listProducts.length; k++) {
        produtosList.push(dados.listProducts[k].productId);
    }
    const produtosNewList = [];
    for (let l = 0; l < novaLista.length; l++) {
        produtosNewList.push(novaLista[l].productId);
    }

    for (let i = 0; i < dados.listProducts.length; i++) {
        if (novaLista.length > 1) {
            for (let j = 0; j < novaLista.length; j++) {
                if (dados.listProducts[i].productId == novaLista[j].productId) {
                    newQtd = novaLista[j].quantity - dados.listProducts[i].quantity;
                    if (newQtd <= 0) {
                       novaLista.splice(j, 1);
                    } else {

                        novaLista[j].quantity = newQtd;
                    }
                    break;
                }
            }
        }
        return novaLista;
    }
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

async function mesmoPedido(orderId) {
    console.log("order", orderId)
    let existe = true;
    try {
        await crud.getById("Orders", orderId);
    } catch (erro) {
        existe = false;
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
    console.log("list", list);
    const newList = [];
    for (let i = 0; i < list.length; i++) {
        newList.push(list[i].productId);
    }
    console.log("new", newList);
    let naoCadastrado = false;
    for (const id of newList) {
        try {
            console.log("id", id);
            await crud.getById("Products", id);
        } catch (erro) {
            console.log("Entrou aqui")
            naoCadastrado = true
            return naoCadastrado;
        }
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

async function adicionarQuantidade(list, dados) {
    const listaOrdersProducts = await crud.get(nomeTabela);
    const listaAdiciona = [];
    let newList = [];

    for (let i = 0; i < listaOrdersProducts.length; i++) {
        listaAdiciona.push(listaOrdersProducts[i].orderId);
        if (listaAdiciona[i] == dados.orderId) {
            const pedidos = await crud.getById(nomeTabela, listaOrdersProducts[i].id);
            for (let m = 0; m < pedidos.listProducts.length; m++) {
                newList.push(pedidos.listProducts[m]);
            }
        }
    }

    const produtosList = [];
    for (let k = 0; k < list.length; k++) {
        produtosList.push(list[k].productId);
    }
    const produtosNewList = [];
    for (let l = 0; l < newList.length; l++) {
        produtosNewList.push(newList[l].productId);
    }

    for (let i = 0; i < list.length; i++) {
        if (newList.length > 1) {
            for (let j = 0; j < newList.length; j++) {
                if (list[i].productId == newList[j].productId) {
                    newQtd = list[i].quantity + newList[j].quantity;
                    newList[j].quantity = newQtd;
                    break;
                }
            }
        }
        if (produtosNewList.indexOf(produtosList[i]) > -1) {
            console.log("new", produtosNewList.indexOf(list[i]) > -1);
        } else {
            newList.push(list[i]);
        }
    }
    return newList;
}

module.exports = {
    adicionarProdutos,
    mostrarPedidos,
    removerProdutos
}