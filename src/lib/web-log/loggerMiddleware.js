import { insertLog } from './insertLog'

function requestLog(req, res, next) {

    if (!global.firebaseRef) {
        throw new Error("Loggin request require you initiate firebase first, checkout at http:/")
    }

    const message = {
        method: req.method,
        startTime: Date.now(),
        url: req.url,
        clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }

    if (Object.keys(req.params).length !== 0) {
        message['payload'] = req.params
    }

    if (Object.keys(req.body).length !== 0) {
        message['payload'] = req.body
    }

    insertLog(message, 'request', req.method)

    next()
}

export {
    requestLog
}