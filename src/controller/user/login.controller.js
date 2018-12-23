import { requestLog } from "../../lib/web-log/loggerMiddleware"

module.exports = {
    method: 'GET',
    path: '/login/',
    handler: async function (req, res) { //handler can be separate it doesnt have to be inline here
        const hello = req.params.name
        const length = hello.length
        res.send({
            hello: name,
            name_length: length
        })
    },
    middleware: [
        // requestLog
    ]
}