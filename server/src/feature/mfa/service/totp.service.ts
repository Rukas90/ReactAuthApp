import { MfaEnrollment, User } from "@prisma/client"
import { getEnrollment } from "./mfa.service"
import speakeasy, { GeneratedSecret } from "speakeasy"
import { appConfig, database } from "@base/app"
import { CipherGCMOptions, decryptGCM, encryptGCM } from "@shared/security"
import QRCode from "qrcode"
import { Result, TotpData } from "@project/shared"
import { TotpError } from "@shared/errors"

type TotpCredentials = {
  secret_enc: string
}
const EncryptionOptions: CipherGCMOptions = {
  key: Buffer.from(process.env.TOTP_SECRET_AES_256_MASTER_KEY!, "base64"),
  algorithm: "aes-256-gcm",
}
type EnrollmentStatus =
  | "NULL"
  | "ALREADY_CONFIGURED"
  | "EXPIRED"
  | "INVALID"
  | "AWAITING_VERIFICATION"

const SETUP_EXPIRATION_MINUTES = 15

export const getTotpData = async (
  user: User
): Promise<Result<TotpData, TotpError>> => {
  let enrollment = await getEnrollment(user.id, "TOTP")

  const status = getEnrollmentStatus(enrollment)

  switch (status) {
    case "ALREADY_CONFIGURED":
      return Result.error(
        new TotpError("TOTP is already configured", "ALREADY_CONFIGURED")
      )
    case "EXPIRED":
    case "INVALID":
      if (enrollment) {
        await database.client.mfaEnrollment.delete({
          where: { id: enrollment.id },
        })
      }
      enrollment = null
      break
    case "NULL":
    case "AWAITING_VERIFICATION":
      break
  }
  if (!enrollment) {
    enrollment = await createNewEnrollment(user)
  }
  const { credentials, generatedSecret } = await getCredentials(
    user,
    enrollment
  )
  let secretKey: string

  if (generatedSecret) {
    secretKey = generatedSecret.base32
  } else {
    const decrypted = decryptGCM(credentials.secret_enc, EncryptionOptions)
    if (!decrypted.ok) {
      return Result.error(
        new TotpError("Failed to decrypt TOTP secret", "DECRYPTION_FAILED")
      )
    }
    secretKey = decrypted.data
  }
  const otpAuthUrl =
    generatedSecret?.otpauth_url ?? createOtpAuthUrl(user, secretKey)

  const qrCodeURi = await generateQRCodeURi(otpAuthUrl)

  if (!qrCodeURi) {
    return Result.error(
      new TotpError("Failed to generate QR code", "QR_GENERATION_FAILED")
    )
  }
  return Result.success({
    qrCodeURi,
    setupKey: secretKey,
    expiresAt: enrollment.expires_At!,
  })
}

export const getEnrollmentStatus = (
  enrollment: MfaEnrollment | null
): EnrollmentStatus => {
  if (!enrollment) {
    return "NULL"
  }
  if (enrollment.configured) {
    return "ALREADY_CONFIGURED"
  }
  if (!enrollment.expires_At) {
    return "INVALID"
  }
  if (new Date() > enrollment.expires_At) {
    return "EXPIRED"
  }
  return "AWAITING_VERIFICATION"
}
const createNewEnrollment = async (user: User): Promise<MfaEnrollment> => {
  return await database.client.mfaEnrollment.create({
    data: {
      user_id: user.id,
      method: "TOTP",
      configured: false,
      expires_At: new Date(Date.now() + SETUP_EXPIRATION_MINUTES * 60 * 1000),
    },
  })
}

const generateQRCodeURi = async (
  otpAuthUrl: string
): Promise<string | null> => {
  try {
    return await QRCode.toDataURL(otpAuthUrl)
  } catch {
    return null
  }
}
const createOtpAuthUrl = (user: User, secret: string) => {
  return speakeasy.otpauthURL({
    secret,
    label: encodeURIComponent(`${appConfig.name}::${user.email}`),
    issuer: appConfig.name,
    algorithm: "sha1",
    digits: 6,
    period: 30,
  })
}

const getCredentials = async (
  user: User,
  enrollment: MfaEnrollment
): Promise<{
  credentials: TotpCredentials
  generatedSecret: GeneratedSecret | null
}> => {
  if (enrollment.credentials) {
    return {
      credentials: JSON.parse(
        enrollment.credentials.toString()
      ) as TotpCredentials,
      generatedSecret: null,
    }
  }
  const secret = generateSecret(user)
  const encrypted = encryptGCM(secret.base32, EncryptionOptions)

  if (!encrypted.ok) {
    console.error(encrypted.error)
    throw encrypted.error
  }
  const credentials = {
    secret_enc: encrypted.data,
  }
  await updateCredentials(enrollment.id, credentials)

  return {
    credentials,
    generatedSecret: secret,
  }
}

const generateSecret = (user: User): GeneratedSecret => {
  return speakeasy.generateSecret({
    name: `${appConfig.name}::${user.email}`,
    length: 32,
  })
}
const updateCredentials = async (
  enrollmentId: string,
  credentials: TotpCredentials
) => {
  await database.client.mfaEnrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      credentials: JSON.stringify(credentials),
    },
  })
}
