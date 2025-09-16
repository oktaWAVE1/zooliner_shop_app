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
const axios = require('axios');



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

app.use(errorHandler)

const weightUpdater = setInterval(() => update(1), 1000*60*20)




const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        // await axios.get(`https://api.life-pos.ru/orgs/${process.env.LIFE_POS_ORG_ID}/deals/sales`, {headers: {
        //         Accept: "*/*",
        //         Authorization: `Bearer ${process.env.LIFE_POS_API_KEY}`
        //     }}) .then((response) => {
        //     console.log((response.data));
        // })
        //     .catch((error) => {
        //         console.log(error);
        //     });



        app.listen(port, () => console.log(`Server's started on port: ${port}`))
    } catch (e) {
        console.log(e)
    }
}

start()