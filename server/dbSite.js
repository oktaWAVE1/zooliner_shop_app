require('dotenv').config()
const {Sequelize} = require('sequelize')


module.exports = new Sequelize(
    process.env.DBSITE_NAME, // db name
    process.env.DBSITE_USER, // user
    process.env.DBSITE_PASSWORD, // pwd
    {
        dialect: "postgres",
        host: process.env.DBSITE_HOST,
        port: process.env.DBSITE_PORT

    }

)