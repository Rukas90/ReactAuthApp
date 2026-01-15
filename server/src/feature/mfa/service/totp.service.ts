import { MfaEnrollment, User } from "@prisma/client"
import { getEnrollment } from "./mfa.service"
import speakeasy, { GeneratedSecret } from "speakeasy"
import { appConfig, database } from "@base/app"
import { CipherGCMOptions, decryptGCM, encryptGCM } from "@shared/security"
import QRCode from "qrcode"
import { Result } from "@project/shared"
import { TotpGetDataError } from "@shared/errors"

type TotpCredentials = {
  secret_enc: string
}
export type TotpData = {
  qrCodeURi: string
}
const EncryptionOptions: CipherGCMOptions = {
  key: Buffer.from(process.env.TOTP_SECRET_AES_256_MASTER_KEY!, "base64"),
  algorithm: "aes-256-gcm",
}

export const getTotpData = async (
  user: User
): Promise<Result<TotpData, TotpGetDataError>> => {
  const enrollment = await getEnrollment(user.id, "TOTP", {
    ensureCreated: true,
  })
  if (!enrollment) {
    return Result.error(new TotpGetDataError())
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
      return Result.error(new TotpGetDataError())
    }
    secretKey = decrypted.data
  }
  const otpAuthUrl =
    generatedSecret?.otpauth_url ?? createOtpAuthUrl(user, secretKey)

  const qrCodeURi = await generateQRCodeURi(otpAuthUrl)

  if (!qrCodeURi) {
    return Result.error(new TotpGetDataError())
  }
  return Result.success({ qrCodeURi })
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
