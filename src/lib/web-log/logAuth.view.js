import { fireDbRef } from "../db/firebase";
import moment from 'moment'

export default async function (req, res, config) {
    const arrayLog = []

    const requestRef = fireDbRef()

    const data = await requestRef.child('request').once('value')

    const logSnapshot = data.val()

    for (let key in logSnapshot) {
        if (logSnapshot.hasOwnProperty(key)) {
            const log = logSnapshot[key]
            if (log['startTime']) {
                log['startTime'] = moment(log['startTime']).format("YYYY-MM-DD HH:mm:ss");
            }
            arrayLog.push(log)
        }
    }

    res.render('index', { logs: arrayLog })
}