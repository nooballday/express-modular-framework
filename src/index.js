import debug from 'debug'

global.__basedir = __dirname

import { App as express } from "./lib"

const app = express.App
const routes = express.Routes

app.use('/api/v1', routes)

app.listen(process.env.SERVER_PORT, () => {
    debug('server:init')(`server running at port : ${process.env.SERVER_PORT} at ${new Date()}`)
})