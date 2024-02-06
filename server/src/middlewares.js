import moment                               from 'moment'
import geoip                                from 'geoip-lite'
import useragent                            from 'express-useragent'
import { v4 as uuidv4 }                     from 'uuid'
import { 
    getSessionsDBTableSchema, 
    sessionsDBTable 
}                                           from './utils.js'
import { isSessionBlocked } from './session-management.js'

export const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized")
    }
    next()
}
export const validateAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
export const captureSessionInfo = async (req, _, next) => {
    
    try {
        if (!req.isAuthenticated()) {
            return // User is not logged in...
        }
        const user = req.user

        if (!user) {
            return // User is not found...
        }
        const database    = req.app.locals.database
        const sessionData = getCurrentSessionData(req, user.id)

        const selector        = "user_id = $1 AND ip_address = $2 AND device_type = $3 AND source = $4"
        const existingSession = await database.query(`SELECT * FROM sessions WHERE ${selector}`, 
            [
                sessionData.user_id, 
                sessionData.ip_address,
                sessionData.device_type, 
                sessionData.source
            ])

        // Update the existing session
        if (existingSession.rowCount > 0) {
            const existingSessionID = existingSession.rows[0].session_id

            await database.query('UPDATE sessions SET last_activity_time = $1 WHERE session_id = $2',
                [sessionData.last_activity_time, existingSessionID])

            req.user.sessionID = existingSessionID
            return
        }
        // Insert a new session
        await database.push(sessionsDBTable, sessionData, getSessionsDBTableSchema())

        req.user.sessionID  = sessionData.session_id
        req.session.blocked = await isSessionBlocked(req)
    }
    catch (error) {
        throw error
    }
    finally {
        req.session.passport.user = { 
            userID:    req.user.id,
            sessionID: req.user.sessionID 
        }
        req.session.save()
        next()
    }
}
export const getCurrentSessionData = (req, userID) => {
    const ip          = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const isLocalhost = ip === '127.0.0.1'
    const geo         = geoip.lookup(ip)
    const location    = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : isLocalhost ? 'Localhost' : 'Unknown Location'

    const ua = useragent.parse(req.headers['user-agent'])

    const deviceType = getDeviceType(ua)
    const osType     = ua.os.split(' ')[0];
    const source     = `${ua.browser}, ${osType}`;

    return {
        session_id:         uuidv4(),
        user_id:            userID,
        ip_address:         ip,
        device_type:        deviceType,
        location:           location,
        login_time:         moment().format('LLLL'),
        last_activity_time: moment().format('LLLL'),
        source:             source
    }
}
const getDeviceType = (ua) => {
    if (ua.isDesktop) {
        return 'Desktop'
    }
    else if (ua.isTablet) {
        return 'Tablet'
    }
    else if (ua.isMobile) {
        return 'Mobile'
    }
    else if (ua.isSmartTV) {
        return 'SmartTV'
    }
    else {
        return 'Unknown'
    }
}

export const validateSession2FAState = async (req, _, next) => {
    try {
        if (!req.isAuthenticated()) {
            return // User is not logged in...
        }
        const user = req.user

        if (!user) {
            return // User is not found...
        }
        const database = req.app.locals.database
        const state    = await database.isUser2FAEnabled(user.id)

        if (!state) {
            return
        }
        const authState = req.session.AuthentificationState

        if (authState === 3) /* <-- Fully authenticated */ {
            return
        }
        req.session.AuthentificationState = 2 /* <-- Partially authenticated */
        req.session.save()
    }
    catch (error) {
        throw error
    }
    finally {
        next()
    }
}