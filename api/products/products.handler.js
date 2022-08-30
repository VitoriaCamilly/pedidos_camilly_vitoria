const crud = require("../../crud");
const nomeTabela = "Products";

async function cadastrarProdutos(dados = {name: "", price: 0}){
    if (!dados.name){
        return {error: "0001", 
        message: "É necessário preencher os parametros da requisição!", 
        camposNecessarios: ["name"]}
    }
    if(!dados.price){
        return {error: "0002", 
        message: "É necessário preencher os parametros da requisição!", 
        camposNecessarios: ["price"]}
    }   
    const produto = await crud.save(nomeTabela, undefined, dados);
    return produto;
}

async function mostrarProdutos(){
    const mostrar = await crud.get(nomeTabela);
    return mostrar;
}

module.exports = {
    cadastrarProdutos,
    mostrarProdutos
}