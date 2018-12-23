import firebase from 'firebase'
import { Debug } from '../index'
import Joi from 'joi'

const dbConfigSchema = Joi.object().keys({
    apiKey: Joi.string().required(),
    authDomain: Joi.string().required(),
    databaseURL: Joi.string().required(),
    projectId: Joi.string().required(),
    storageBucket: Joi.string().required(),
    messagingSenderId: Joi.string().required(),
})

function validateDbConfig(config) {
    return new Promise((resolve, reject) => {
        Joi.validate(config, dbConfigSchema, function (err, value) {
            if (err) {
                reject(`Config doesnt meet the requirement ERR: ${err}`)
                throw new Error(`Config doesnt meet the requirement ERR: ${err}`)
            } else (
                resolve(value)
            )
        })
    })
}

/**
 * get firebase realtime db instance
 * @param {object} config contain firebase config key, check out https://firebase.google.com/docs/database/
 */
function fireDbRef(config) {
    if (!global.firebaseRef)
        firebaseInit(config)
    else
        return global.firebaseRef
}

/**
 * initialization of firebase db
 * @param {object} config contain firebase config key, check out https://firebase.google.com/docs/database/
 */
async function firebaseInit(config) {
    try {
        await validateDbConfig(config)
        if (!global.firebaseRef) {
            Debug.db('firebase is being initiated')
            firebase.initializeApp(config)
            global.firebaseRef = firebase.app().database().ref('/')
        }
        return global.firebaseRef
    } catch (error) {
        throw new Error(error)
    }
}

export {
    fireDbRef,
    firebaseInit
}