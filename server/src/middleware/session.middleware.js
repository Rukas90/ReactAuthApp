import moment                                                               from 'moment'
import geoip                                                                from 'geoip-lite'
import useragent                                                            from 'express-useragent'
import { v4 as uuidv4 }                                                     from 'uuid'
import { isSessionBlocked }                                                 from '#controllers/session.controller.js'
import { isUserAuthenticated }                                              from '#validators/user.validator.js'
import { getUser2FAActiveState }                                            from '#queries/user.2fa.queries.js'
import { addNewUserSession, getExistingSession, updateUserSessionActivity } from '#queries/user.session.queries.js'
import { logDevError, logDevMessage } from '#services/logger.js'

export const captureSessionInfoMiddleware = async (req, _, next) => {
    try {
        if (!isUserAuthenticated(req)) {
            logDevError("User not authenticated")
            return // User is not logged in...
        }
        const user = req.user

        if (!user) {
            logDevError("User not found")
            return // User is not found...
        }
        const sessionData     = await getCurrentSessionData(req, user.id)
        const existingSession = await getExistingSession(sessionData.user_id, sessionData.ip_address, sessionData.device_type, sessionData.source)

        // Update the existing session
        if (existingSession) {
            await updateUserSessionActivity(existingSession.session_id, sessionData.last_activity_time)
            req.user.sessionID = existingSession.session_id

            return
        }
        await addNewUserSession(sessionData)

        req.user.sessionID  = sessionData.session_id
        req.session.blocked = await isSessionBlocked(req)
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
const isPrivateIp = (ip) => {
  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.') && (parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31) ||
    ip === '127.0.0.1' ||
    ip === '::1'
  )
}
const getPublicGeo = async (ip) => {
  try {
    const res  = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await res.json()

    if (data.status === 'success') {
      return `${data.city}, ${data.regionName}, ${data.country}`
    }
  } catch (err) {
    console.error('Public geo lookup failed:', err)
  }
  return 'Unknown Location'
}
export const getCurrentSessionData = async (req, userID) => {

    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress || ''
    ip = ip.replace(/^::ffff:/, '')

    let location = 'Unknown Location'

    if (isPrivateIp(ip)) {
        location = 'Local Network'
    } 
    else 
    {
      const geo = geoip.lookup(ip)

      if (geo) 
      {
        location = `${geo.city || 'Unknown'}, ${geo.region || 'Unknown'}, ${geo.country || 'Unknown'}`
      } 
      else 
      {
        location = await getPublicGeo(ip)
      }
    }
    const ua     = useragent.parse(req.headers['user-agent'])
    const osType = ua.os.toString().split(' ')[0]
    const source = `${ua.browser}, ${osType}`

    return {
        session_id:         uuidv4(),
        user_id:            userID,
        ip_address:         ip,
        device_type:        getDeviceType(ua),
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

export const validateSession2FAStateMiddleware = async (req, _, next) => {
    try {
        if (!req.isAuthenticated()) {
            return // User is not logged in...
        }
        const user = req.user

        if (!user) {
            return // User is not found...
        }
        const state = await getUser2FAActiveState(user.id)

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
    finally {
        next()
    }
}