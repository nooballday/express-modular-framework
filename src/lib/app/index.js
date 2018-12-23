'use strict'

import { config as env } from "dotenv"

import express, { Router as server } from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'
import { routes } from '../routes'
import LoggerUI from '../web-log/logAuth.view'
import debug from './debug-constant'
import { firebaseInit } from '../db/firebase'
import { ErrorEvents as emitter } from "../plugin/errorHandler"

env()

const app = express()
let isErrorHanlder = false

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

function webLog(config) {
    if (!global.firebaseRef) {
        firebaseInit(config)
    }
    debug.app(`Logging with firebase is running`)
    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '..', 'web-log/views'))
    app.get('/logs', LoggerUI);
}

function serveStatic(dir) {
    if (!dir) {
        const err = `you should provide static directory, cannot find directory ${dir}`
        debug.app(err)
        throw new Error(err)
    } else {
        const assetsDirectory = dir
        debug.app(`Serving static file at directory ${dir}`)
        fs.existsSync(assetsDirectory) || fs.mkdirSync(assetsDirectorys)
        app.use('/files', express.static(assetsDirectory))
    }
}

emitter.on('onControllerError', params => {
    const err = params.err
    const res = params.res
    const req = params.req
    const next = params.nex

    debug.controller(`error at controller ERRMESSAGE ${err}`)

    if (!res.headerSent) {
        if (!isErrorHanlder) {
            res.send({
                status: 500,
                url: process.env.DEBUG ? req.url : undefined,
                message: process.env.DEBUG ? err.message : "Something went wrong!"
            })
        }
    }
})

/**
 * 
 * @param {string} type include the name of error event
 * @param {function} fnErrorHandler contain 4 parameters (err, req, res, next)
 */
function errorHook(type, fnErrorHandler = undefined) {
    isErrorHanlder = true
    emitter.on(type, params => {
        const err = params.err
        const res = params.res
        const req = params.req
        const next = params.nex

        if (!fnErrorHandler) {
            debug.controller(`error at controller ERRMESSAGE ${err}`)
            res.send({
                status: 500,
                url: req.url,
                message: err.message
            })
        } else {
            fnErrorHandler(err, req, res, next)
        }
    })
}

export {
    webLog,
    serveStatic,
    debug,
    app as App,
    routes as Routes,
    errorHook
}