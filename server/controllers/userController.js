require('dotenv').config()
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const {User} = require('../models/models')
const mailService = require('../service/mail-service')
const tokenService = require('../service/token-service')
const UserDto = require("../dtos/user-dto");



class UserController {

    async login (req, res, next) {
        try {

            const {email} = req.body
            const user = await User.findOne({where: {email}})

            if (!user) {
                return next(ApiError.badRequest("Такого пользователя не существует"))
            }

            const password = uuid.v4()

            await User.update({pass: password, attempt: 1}, {where: {id: user.id}})
            await mailService.sendPassMail(email, password)

            return res.json("Пароль отправлен на почту")


        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async checkPassword (req, res, next){
        try {
            const {email, pass} = req.body
            const user = await User.findOne({where: {email}})

            if (!user) {
                return next(ApiError.badRequest("Такого пользователя не существует"))
            }

            if (user.attempt > 3){
                return next(ApiError.forbidden("Лимит использования пароля исчерпан. Запросите новый."))
            }

            if (pass !== user.pass) {

                await User.update({attempt: user.attempt+1}, {where: {id: user.id}}).then(() => {
                    return next(ApiError.forbidden("Введен неверный пароль"))
                })
            }
            const userDto = new UserDto(user);
            const tokens = tokenService.generateJwt({...userDto});
            await tokenService.saveToken(user.id, tokens.refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 60*24*60*60*1000, httpOnly: true, sameSite: "none", secure: true})
            return res.json(tokens)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }




    async check (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return
            }

            const user = await tokenService.refresh(refreshToken, next)
            if (!user) {
                res.clearCookie('refreshToken')
                return next(ApiError.internal("Не авторизован"))
            } else {

                const userDto = new UserDto(user);
                const tokens = tokenService.generateJwt({...userDto});
                await tokenService.saveToken(user.id, tokens.refreshToken)
                res.cookie('refreshToken', tokens.refreshToken, {maxAge: 60*24*60*60*1000, httpOnly: true, sameSite: "none", secure: true})
                return res.json(tokens)
            }

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await tokenService.removeToken({refreshToken})
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}

module.exports = new UserController()