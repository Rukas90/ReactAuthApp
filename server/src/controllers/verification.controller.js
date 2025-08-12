import { getNewVerificationData }       from "#models/verification.model.js"
import { generateRandomCode }           from "#utils/random.util.js"
import { mail }                         from "#services/mailer.service.js"
import {   
    addNewVerification,   
    getVerification,   
    removeVerification,   
    setVerificationProperty  
}                                       from "#queries/verification.queries.js"
import { timeExpired }                  from "#utils/date.util.js"
import { sendEstablishedResponse }      from "#responses/verifications.response.js"
import { getUserById }                  from "#queries/user.queries.js"
import { logDevError, logDevMessage }   from "#services/logger.js"
import { database }                     from "#services/database.service.js"
import { sendErrorResponse }            from "#responses/error.response.js"
import { compareHashes, decryptObject } from "#utils/security.js"
import { DispachCommand }               from "#commands/dispach.commands.js"
import { sendGenericSuccessResponse }   from "#responses/success.response.js"

const DEFAULT_VERIFICATION_CONFIG = {
    DEFAULT_VALID_DURATION: 24,
    DEFAULT_MAX_ATTEMPTS:   5
}
const CODE_REPLACEMENT_EMAIL_TOKEN        = '{{CODE}}'
const DEFAULT_VERIFICATION_EMAIL_TEMPLATE = `Your verification code is ${CODE_REPLACEMENT_EMAIL_TOKEN}`

export const getCreateVerification = async (req, res) => {
    try {
        const findByType   = req.query.type
        let   verification = null;
        
        if (findByType) {
            verification = await getVerification(['id', 'expires_at', 'attempts_left'], ['user_id', 'type'], [req.user.id, findByType], 
            )

            if (verification && !timeExpired(verification.expires_at) && verification.attempts_left > 0) {
                return sendEstablishedResponse(verification.id)(res)
            }
            else if (verification) /* If found existing verification, but it is no longer valid, remove it */ {
                await removeVerification(verification.id, req.user.id)
            }
        }
        const result = await establishNewVerification(req)

        if (!result.success) {
            return sendErrorResponse(result.status, result.error)(res)
        }
        logDevMessage(`Verification established for user ${req.user.id}, type: ${req.body.settings.type}`)
        return sendEstablishedResponse(result.verification.id)(res)
    }
    catch (error) {
        logDevError('Verification creation failed:', error)
        return sendErrorResponse(500, 'Failed to create verification')(res)
    }
}
export const establishNewVerification = async (req) => {
    const userId       = req.user.id
    const user         = await getUserById(userId, 'email')
    const code         = generateRandomCode()
    const settings     = req.body.settings

    const validation = validateNewVerificationSettings(settings)

    if (!validation.valid) {
        return { success: false, status: validation.status, error: validation.error }
    }
    const verification = await getNewVerificationData(
        userId, 
        settings.type, 
        code, 
        settings.dispatch, 
        settings.validDurationInHours ?? DEFAULT_VERIFICATION_CONFIG.DEFAULT_VALID_DURATION, 
        settings.maxAttempts ?? DEFAULT_VERIFICATION_CONFIG.DEFAULT_MAX_ATTEMPTS
    )
    const operation = async (client) => {
        await addNewVerification(verification, client, false)
    }
    const status = await database.transaction(operation)
    
    if (!status) {
        return { success: false, status: 500, error: 'Invalid server error occurred!' }
    }
    try {
        await sendVerificationEmail(req, user.email, code)
    } catch (error) {
        logDevError('Email sending failed, but verification was created:', error)
    }
    return { success: true, verification }
}
const validateNewVerificationSettings = (settings) => {

    if (!settings?.type) {
        return { valid: false, status: 400, error: 'Verification type is required' }
    }
    if (!settings?.dispatch?.command) {
        return { valid: false, status: 400, error: 'Proper verification dispatch is required' }
    }
    return { valid: true }
}
const sendVerificationEmail = async (req, email, code) => {
    const settings = req.body.email || {}
    let   template = DEFAULT_VERIFICATION_EMAIL_TEMPLATE

    if (settings.body && settings.body.includes(CODE_REPLACEMENT_EMAIL_TOKEN)) {
        template = settings.body
    }
    await mail({
        recipient: email,
        subject:   settings.title ?? 'Verification Code',
        body:      template.replace(CODE_REPLACEMENT_EMAIL_TOKEN, code)
    })
}

export const verifyVerification = async (req, res) => {
    try {
        const user           = req.user
        const verificationId = req.body.verificationId
        const code           = req.body.code

        if (!verificationId || !code) {
            return sendErrorResponse(400, 'Verification ID and code are required!')(res)
        }
        if (typeof code !== 'string' || code.length === 0) {
            return sendErrorResponse(400, 'Invalid verification code format!')(res)
        }
        const verification = await getVerification(
            ['code_hash', 'dispatch', 'expires_at', 'attempts_left'],
            ['id', 'user_id'], 
            [verificationId, req.user.id])

        if (!verification) {
            return sendErrorResponse(400, 'Verification is not valid!')(res)
        }
        if (timeExpired(verification.expires_at)) {
            await removeVerification(verificationId, user.id)
            return sendErrorResponse(401, 'Verification code has expired!')(res)
        }
        const isCorrect = await compareHashes(code, verification.code_hash)

        if (isCorrect) {
            await dispatchVerification(req, verification.dispatch)
            await removeVerification(verificationId, user.id)

            return sendGenericSuccessResponse('Verified successfully!')(res)
        }
        const newAttemptsLeft = verification.attempts_left - 1

        if (newAttemptsLeft <= 0) {
            await removeVerification(verificationId, user.id)

            logDevMessage(`Verification attempts exhausted for user ${user.id}`)
            return sendErrorResponse(401, 'Verification failed! Out of attempts!')(res)
        }
        await setVerificationProperty('attempts_left', newAttemptsLeft, ['id', 'user_id'], [verificationId, user.id])
        return sendErrorResponse(401, 'Verification failed! Try again!')(res)
    }
    catch (error) {
        logDevError('Verification process failed:', error)
        return sendErrorResponse(500, 'Verification process failed!')(res)
    }
}
const dispatchVerification = async (req, dispatch) => {
    const decrypted = decryptObject(dispatch.data, dispatch.iv, dispatch.tag, process.env.PAYLOAD_MASTER_KEY)
    await DispachCommand(req, decrypted.command, decrypted.payload)
}