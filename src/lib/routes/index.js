import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const routes = Router()
const routePath = path.join(__dirname, '..', '..', 'controller')

fs.readdirSync(routePath).forEach(function (file) {

    const route = require(path.join(__dirname, '..', '..', 'controller', file))

    switch (route.method) {
        case 'POST':
            routes.post(route.path, route.middleware, route.handler)
            break;
        case 'GET':
            routes.get(route.path, route.middleware, route.handler)
            break;
        case 'PUT':
            routes.put(route.path, route.middleware, route.handler)
            break;
        case 'DELETE':
            routes.delete(route.path, route.middleware, route.handler)
            break;
        default:
            throw new Error("Method undefined")
    }

})


export {
    routes
}