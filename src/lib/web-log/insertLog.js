const { fireDbRef } = require('../db/firebase')

const insertLog = (message, ctx = 'general', tag = 'noTag') => {
    const dbRef = fireDbRef()
    dbRef.child('request').push(
        message
    ).catch((err) => {
        console.error(err);
    })
}

export {
    insertLog
}