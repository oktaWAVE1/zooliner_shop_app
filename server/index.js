require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')
const models = require('./models/models')  // import is required to work
const router = require('./routes')
const path = require("path");
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const cookieParser = require('cookie-parser')
const {update} = require('./service/weight-product-updater')




const port = process.env.PORT || 5000

const app = express()

process.env.TZ = 'Europe/Moscow'

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    next();
})
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)


const lifeposCorsOptions = {
    origin: 'https://api.life-pos.ru',
    methods: ['POST'],
    optionsSuccessStatus: 200
};
app.post('/api/realization/lifepos', cors(lifeposCorsOptions))

app.use(errorHandler)

const weightUpdater = setInterval(() => update(1), 1000*60*20)


const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()


        app.listen(port, () => console.log(`Server's started on port: ${port}`))
    } catch (e) {
        console.log(e)
    }
}

start()