const knex = require("../db/connection");

async function create(table){
return knex("tables")
.insert(table)
.returning("*")
.then((createdTable) => createdTable[0])
}

async function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}
module.exports = {
create,
list
}