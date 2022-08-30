const crud = require("../../crud");
const nomeTabela = "Users";

async function cadastrarUsers(dados = {cpf: "", name: "", surname:""}){
    if (!dados.cpf){
        return {error: "0001", 
        message: "É necessário preencher os parametros da requisição!", 
        camposNecessarios: ["cpf"]}
    }
    if(!dados.name){
        return {error: "0002", 
        message: "É necessário preencher os parametros da requisição!", 
        camposNecessarios: ["name"]}
    }   
    if (!dados.surname){
        return {error: "0003", 
        message: "É necessário preencher os parametros da requisição!", 
        camposNecessarios: ["surname"]}
    }
    const user = await crud.save(nomeTabela, undefined, dados);
    return user;
}

async function mostrarUsers(){
    const mostrar = await crud.get(nomeTabela);
    return mostrar;
}

module.exports = {
    cadastrarUsers,
    mostrarUsers
}