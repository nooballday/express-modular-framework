module.exports = {
    method: 'POST',
    path: '/login',
    handler: async function (req, res) { //handler can be separate it doesnt have to be inline here
        res.send({
            hello: "World"
        })
    },
    middleware: [
        (req, res, next) => {
            next() //middleware example use next to move to handler
        }
    ]
}