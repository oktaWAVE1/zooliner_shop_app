require('dotenv').config()
const nodemailer = require('nodemailer')
const fs = require("fs");


class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
        }
        })
    }

    async sendPassMail(to, pass) {
        console.log("Email is sending...")
        let html = fs.readFileSync('templates/email/pass.html', { encoding: 'utf-8' })

        html = html.replace("${text}", `
                <div>
                    <h1>Пароль для входа: </h1>                    
                    <h2>${pass}</h2>
                </div>`)
        await this.transporter.sendMail({
            from: `"ЗооЛАЙНЕР" <${process.env.SMTP_USER}>`,
            to,
            subject: 'Авторизация на ' + process.env.API_URL,
            text: '',
            html
        })
            .then(() => {
                console.log('Email has been sent')
            })
            .catch(async (e) => {
            console.log(e)
            const date = new Date()
            const timeStampLog = date.toLocaleString()

            await fs.appendFile(`./logs/logs.txt`, `${timeStampLog} Ошибка: ${e} \n`, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        })

    }





}

module.exports = new MailService()