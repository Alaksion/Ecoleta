import Knex from 'knex'

export async function up(knex:Knex){
    return(
        knex.schema.createTable("point_items", (table)=>{
            table.increments("id").primary(),

            table.integer("item_id").notNullable().references("id").inTable("items"),

            table.integer("point_Id").notNullable().references("id").inTable("points")

        })

    )

}


export async function down(knex:Knex){
    return(
        knex.schema.dropTable("point_items")

    )
}