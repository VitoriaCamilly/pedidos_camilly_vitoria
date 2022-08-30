const crud = require("../../crud");
const nomeTabela = "Orders";
let contador = 1; let number; let status; let userId; let dado;

async function cadastrarPedidos(dados = {userId: ""}){

    if(!dados.userId){
        return {error: "0001", 
        message: "É necessário preencher os parametros da requisição!", 
        camposNecessarios: ["userId"]}
    }  
    if (await verificarUser(dados.userId)) {
        return {error: "0002", 
        message: "Not found",
        situacao: "Este usuário não existe"
       }
    }
    if (await pedidosEmAberto(dados.userId)) {
        return {error: "0003", 
        message: "Not found",
        situacao: "Este usuário já possui pedidos com o status em aberto"
       }
    }
    number = contador++; 
    userId = dados.userId;
    status = "Aberto";
    dado = {number, userId, status};
    const pedidos = await crud.save(nomeTabela, undefined, dado);
    return pedidos;
}

async function mostrarPedidos(){
    const mostrar = await crud.get(nomeTabela);
    return mostrar;
}

async function fecharPedido(orderId){
    if (await pedidosEmAberto(orderId)) {
        return {error: "0003", 
        message: "Not found",
        situacao: "Este usuário já possui pedidos com o status em aberto"
       }
    }
}

async function pedidosEmAberto(userId){
    let existe = false;
        try{
        const teste = await crud.getById("Users", userId);
        if(teste){
            const verifOrder = await crud.get(nomeTabela);
            for (let i = 0; i < verifOrder.length; i++) {
                if (verifOrder[i].userId == userId){
                    if(verifOrder[i].status == "Aberto"){
                        return true;
                    }
                }
            }
        }
        }catch(erro){
            existe = true
            return existe;
        }
    return existe;
}

async function verificarPedido(orderId){
    let existe = false;
        try{
        await crud.getById(nomeTabela, orderId);
        }catch(erro){
            existe = true
            return existe;
        }
    return existe;
}

async function verificarUser(userId){
    let existe = false;
        try{
        await crud.getById("Users", userId);
        }catch(erro){
            existe = true
            return existe;
        }
    return existe;
}


module.exports = {
    cadastrarPedidos,
    mostrarPedidos,
    fecharPedido
}