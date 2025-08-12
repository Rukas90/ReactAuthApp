import { logDevError, logDevMessage } from "#services/logger.js"

export const validateHCaptchaTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.body.hcaptchaToken

    if (token === null) {
      logDevError('HCaptcha:Error Captcha token missing')
      return res.status(400).json({ error: "Captcha token missing" })
    }
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret:   process.env.HCAPTCHA_SECRET,
        response: token,
        remoteip: req.ip
      })
    })
    const result = await response.json();

    if (!result.success) {
      logDevError('HCaptcha:Error', result['error-codes'])
      return res.status(403).json({ error: "Captcha verification failed" })
    }
    req.hcaptcha = result
    logDevMessage("HCaptcha::Success")

    next()
  }
  catch (error) {
    logDevError('HCaptcha:Fetch failed', error);
    return res.status(503).json({ error: "Captcha service unavailable" });
  }
}