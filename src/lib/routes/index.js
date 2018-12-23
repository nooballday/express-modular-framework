import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import Debug from "../app/debug-constant"
import { errorExceptionHandler } from '../plugin/errorHandler'

const routes = Router()
const routePath = path.join(__dirname, '..', '..', 'controller')

fs.readdirSync(routePath).forEach((file) => {
    const fileRegex = /^[^.]+.controller.js$/
    const controllerRoute = path.join(routePath, file)
    if (fs.lstatSync(controllerRoute).isDirectory()) {
        fs.readdirSync(controllerRoute).forEach((controllerFile) => {
            if (fileRegex.test(controllerFile)) {
                const endPoint = require(path.join(controllerRoute, controllerFile))
                if (endPoint.path || endPoint.handler) {
                    const endPointPath = `/${file}${endPoint.path}`
                    switch (endPoint.method) {
                        case 'POST':
                            routes.post(endPointPath, endPoint.middleware, errorExceptionHandler(endPoint.handler))
                            break
                        case 'GET':
                            routes.get(endPointPath, endPoint.middleware, errorExceptionHandler(endPoint.handler))
                            break
                        case 'PUT':
                            routes.put(endPointPath, endPoint.middleware, errorExceptionHandler(endPoint.handler))
                            break
                        case 'DELETE':
                            routes.delete(endPointPath, endPoint.middleware, errorExceptionHandler(endPoint.handler))
                            break
                        default:
                            console.error('\x1b[31m%s\x1b[0m', `Undefined Request Method at ${file}/${controllerFile}`)
                            process.exit(1)
                    }
                }
            }
        })
    } else {
        Debug.controller(`${file} is not a directory, therefore it's being ignored`)
    }
})

export {
    routes
}