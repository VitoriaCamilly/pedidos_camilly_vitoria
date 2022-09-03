const crud = require("../../crud");
const nomeTabela = "OrdersProducts";

async function adicionarProdutos(dados = { listProducts: {}, orderId: "" }) {
    console.log("aaaa", dados.productId)
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
        await adicionarQuantidade(dados.listProducts);
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
    const newList = [];
    for (let i = 0; i < listaOrdersProducts.length; i++) {
        newList.push(listaOrdersProducts[i].orderId);
        if (newList[i] == dados.orderId) {
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
    console.log("var1", variavel);
    variavel.productId = removido;
    console.log("var2", variavel);
    await crud.save(nomeTabela, dados.orderproductsId, variavel);
    return variavel;
}

async function remover(dados) {
    let newProduto = [];
    let lista = await crud.getById(nomeTabela, dados.orderproductsId);
    console.log("LISTAAAAAA", lista);


    for (let i = 0; i < lista.listProducts.length; i++) { 
        newProduto.push(lista.listProducts[i]);
    }

    for (let i = 0; i < newProduto.productId.length; i++) { 

    }


    // if (newProduto.length < 1) {
    //     const res = await crud.remove(nomeTabela, orderproductsId);
    //     return res;
    // }
    // return newProduto;
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

async function adicionarQuantidade(list) {
    console.log("liss", list);
    const newList = [];
    for (let i = 0; i < list.length; i++) {
        newList.push(list[i].quantity);
        console.log("liss2", list[i].quantity);
    }
}

module.exports = {
    adicionarProdutos,
    mostrarPedidos,
    removerProdutos
}