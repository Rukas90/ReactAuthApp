import { MfaEnrollment, User } from "@prisma/client"
import {
  createNewEnrollment,
  getEnrollment,
  getEnrollmentStatus,
} from "./mfa.service"
import speakeasy, { GeneratedSecret } from "speakeasy"
import { appConfig, database } from "@base/app"
import { CipherGCMOptions, decryptGCM, encryptGCM } from "@shared/security"
import QRCode from "qrcode"
import { Result, TotpData, VoidResult } from "@project/shared"
import { DomainError, UnexpectedError } from "@shared/errors"
import {
  MfaAlreadyConfiguredError,
  MfaNotFoundError,
  MfaEnrollmentExpiredError,
  MfaCredentialsMissingError,
  MfaVerificationError,
  MfaInvalidCodeError,
} from "../error/validation.error"

type TotpCredentials = {
  secret_enc: string
}
const EncryptionOptions: CipherGCMOptions = {
  key: Buffer.from(process.env.TOTP_SECRET_AES_256_MASTER_KEY!, "base64"),
  algorithm: "aes-256-gcm",
}

const SETUP_EXPIRATION_MINUTES = 15

export const getTotpData = async (
  user: User,
): Promise<Result<TotpData, DomainError>> => {
  let enrollment = await getEnrollment(user.id, "totp")

  const status = getEnrollmentStatus(enrollment)

  switch (status) {
    case "CONFIGURED":
      return Result.error(new MfaAlreadyConfiguredError())
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
    enrollment = await createNewEnrollment(
      user.id,
      "totp",
      SETUP_EXPIRATION_MINUTES,
    )
  }
  const { credentials, generatedSecret } = await getCredentials(
    user,
    enrollment,
  )
  let secretKey: string

  if (generatedSecret) {
    secretKey = generatedSecret.base32
  } else {
    const decrytionResult = decryptSecret(credentials.secret_enc)

    if (!decrytionResult.ok) {
      return decrytionResult
    }
    secretKey = decrytionResult.data
  }
  const otpAuthUrl =
    generatedSecret?.otpauth_url ?? createOtpAuthUrl(user, secretKey)

  const qrCodeURi = await generateQRCodeURi(otpAuthUrl)

  if (!qrCodeURi) {
    return Result.error(
      new UnexpectedError("Failed to generate QR code", "QR_GENERATION_FAILED"),
    )
  }
  return Result.success({
    qrCodeURi,
    setupKey: secretKey,
    expiresAt: enrollment.expires_At!,
  })
}

export const verifyTotpCode = async (
  userId: string,
  code: string,
  options?: { ensureConfigured?: boolean },
): Promise<VoidResult<DomainError>> => {
  let enrollment = await getEnrollment(userId, "totp")

  if (!enrollment) {
    return VoidResult.error(new MfaNotFoundError())
  }
  const status = getEnrollmentStatus(enrollment)

  switch (status) {
    case "AWAITING_VERIFICATION":
    case "CONFIGURED":
      break
    case "EXPIRED":
      return VoidResult.error(new MfaEnrollmentExpiredError())
    case "INVALID":
      return VoidResult.error(new MfaCredentialsMissingError())
    default:
      return VoidResult.error(new MfaVerificationError())
  }
  if (status === "AWAITING_VERIFICATION" && options?.ensureConfigured) {
    return VoidResult.error(new MfaVerificationError())
  }
  const credentials = enrollment.credentials

  if (!credentials) {
    return VoidResult.error(new MfaCredentialsMissingError())
  }
  const parsed = JSON.parse(credentials.toString()) as TotpCredentials
  const decrytionResult = decryptSecret(parsed.secret_enc)

  if (!decrytionResult.ok) {
    return decrytionResult
  }
  const secretKey = decrytionResult.data

  const verified = speakeasy.totp.verify({
    secret: secretKey,
    encoding: "base32",
    token: code,
    window: 2,
  })
  if (!verified) {
    return VoidResult.error(new MfaInvalidCodeError())
  }
  return VoidResult.ok()
}

const getCredentials = async (
  user: User,
  enrollment: MfaEnrollment,
): Promise<{
  credentials: TotpCredentials
  generatedSecret: GeneratedSecret | null
}> => {
  if (enrollment.credentials) {
    return {
      credentials: JSON.parse(
        enrollment.credentials.toString(),
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

const updateCredentials = async (
  enrollmentId: string,
  credentials: TotpCredentials,
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

const decryptSecret = (
  secretEnrypted: string,
): Result<string, UnexpectedError> => {
  const decrypted = decryptGCM(secretEnrypted, EncryptionOptions)
  if (!decrypted.ok) {
    return Result.error(
      new UnexpectedError("Failed to decrypt TOTP secret", "DECRYPTION_FAILED"),
    )
  }
  return Result.success(decrypted.data)
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

const generateSecret = (user: User): GeneratedSecret => {
  return speakeasy.generateSecret({
    name: `${appConfig.name}::${user.email}`,
    length: 32,
  })
}
const generateQRCodeURi = async (
  otpAuthUrl: string,
): Promise<string | null> => {
  try {
    return await QRCode.toDataURL(otpAuthUrl)
  } catch {
    return null
  }
}
