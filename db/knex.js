const enviroment = "development";

const config = require("../knexfile.js")[enviroment];

const knex = require("knex")(config);

module.exports = knex;