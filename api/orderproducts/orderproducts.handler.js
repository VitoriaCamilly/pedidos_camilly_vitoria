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
    if (await verificarListaProdutos(dados.productId)) {
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

async function removerProdutos(dados = { productId: [], orderproductsId: "" }) {
    if (!dados.orderproductsId) {
        return {
            error: "0001",
            message: "É necessário preencher os parametros da requisição!",
            camposNecessarios: ["orderproductsId"]
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
    if (await verificarPedido(dados.orderproductsId)) {
        return {
            error: "0004",
            message: "Not found",
            situacao: "Este pedido não existe"
        }
    }
    if (await pedidosEmAberto(dados.orderproductsId.orderId)) {
        return {
            error: "0005",
            message: "Not found",
            situacao: "Este pedido está fechado"
        }
    }

    const removido = remover(dados.productId, dados.orderproductsId);
    return removido;
}


async function remover(productId, orderproductsId) {
    console.log("teste", productId, orderproductsId)
    //     let numeros = [];
    //     for (let i = 0; i < listaScore.length; i++) {
    //         numeros.push(parseInt(listaScore[i]));
    //     }
    let lista = await crud.get(nomeTabela);
    console.log("teste2", lista);
    for(let i = 0; i < lista.length; i++){
        console.log("AAAAAAAAAAA");
        console.log("BBBBBBBBBB", lista[i].productId);
        console.log("CCCCCCC", productId);
        if(lista[i].productId == productId){
            let variavel = numeros.indexOf(i);
            console.log("vari", variavel);
        }
    }
    // return variavel;
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
    for(const id of list){
        try{
        await crud.getById("Products", id);
        }catch(erro){
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

module.exports = {
    adicionarProdutos,
    mostrarPedidos,
    removerProdutos
}