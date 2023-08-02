const enviroment = "development";

const config = rquire("../knexfile.js")[enviroment];

const knex = require("knex")(config);

module.exports = knex;