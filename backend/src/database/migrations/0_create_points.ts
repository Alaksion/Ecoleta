import Knex from 'knex'

export async function up(knex: Knex){
    // realiza alteraçoes no banco
    return( knex.schema.createTable("points", (table)=> {
        table.increments("id").primary(),
        table.string('image').notNullable(),
        table.string('name').notNullable(),
        table.string("city").notNullable(),
        table.string("uf", 2).notNullable(),
        table.decimal("longitude").notNullable(),
        table.decimal("latitude").notNullable(),
        table.string("whatsapp").notNullable(),
        table.string("email").notNullable()
    }))


}

export async function down(knex :Knex){
    // utilizado para rollbacks
    // deve fazer sempre o contrário do método up
   return knex.schema.dropTable("points")
}