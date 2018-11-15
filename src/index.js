'use strict'

import { config as env } from "dotenv"

import express, { Router as server } from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import rfs from 'rotating-file-stream'
import fs from 'fs'
import morgan from 'morgan'
import moment from 'moment'

import { routes } from './lib/routes'

env()
global.__basedir = __dirname

const app = express()

const logDirectory = path.join(__dirname, '../logs/request')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = rfs(`${moment().format('YYYY-MM-DD')}.log`, {
    interval: '1d', // rotate daily
    path: logDirectory
})

app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/files', express.static(path.join(__dirname, 'assets/images')))

app.use('/api/v1', routes)

app.get('/hello', (req, res) => {
    res.send('world')
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server Running at Port : ${process.env.SERVER_PORT}`)
})