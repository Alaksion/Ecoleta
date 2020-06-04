// seeds serão as informaçoes padrão inseridas no banco de dados
import Knex from 'knex'

export async function seed(knex:Knex){
    await knex("items").insert([
        {name: "Lampadas", image:"lampadas.svg"},
        {name: "Pilhas e Baterias", image:"baterias.svg"},
        {name: "Papes e Papelão", image:"papeis-papelao.svg"},
        {name: "Resíduos Eletronicos", image:"eletronicos.svg"},
        {name: "Resíduos Organicos", image:"organicos.svg"},
        {name: "Óleo de Cozinha", image:"oleo.svg"}
    ])

}
