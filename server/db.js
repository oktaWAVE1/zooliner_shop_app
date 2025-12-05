require('dotenv').config()
const {Sequelize} = require('sequelize')


module.exports = new Sequelize(
    process.env.DB_REMOTE_NAME, // db name
    process.env.DB_REMOTE_USER, // user
    process.env.DB_REMOTE_PASSWORD, // pwd

    {
        dialect: "mysql",
        logging: console.log,
        host: process.env.DB_REMOTE_HOST,
        port: process.env.DB_REMOTE_PORT,
        define: {
            charset: 'utf8',
            engine: 'MYISAM',
            collate: 'utf8_unicode_ci',
            dialectOptions: { collate: 'utf8_unicode_ci' },
            timestamps: false,
        },
        pool: {
            max: 5,        // максимум одновременно открытых соединений
            min: 0,        // минимум соединений
            acquire: 30000, // ждать соединение 30 секунд
            idle: 10000     // закрывать соединение через 10 секунд простоя
        }
    }

)