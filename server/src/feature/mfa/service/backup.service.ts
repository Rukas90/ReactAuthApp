import { database } from "@base/app"
import { hashing } from "@shared/security"
import crypto from "crypto"
import { Result, VoidResult } from "@project/shared"
import { BackupCodeInvalidError } from "../error/backup.error"
import backupRepository from "../repository/backup.repository"
import { DatabaseError } from "@shared/errors"

const BACKUP_CODES_COUNT = 8

const backupService = {
  createUserCodes: async (
    userId: string,
  ): Promise<Result<string[], DatabaseError>> => {
    return await database.client.$transaction(async (client) => {
      await backupRepository.deleteAllByUserId(userId, client)

      const codes = generateBackupCodes()

      const promises = codes.map(
        async (code) => await backupRepository.create(userId, code, client),
      )
      const results = await Promise.all(promises)
      const failure = results.find((r) => !r.ok)

      if (failure) {
        return failure
      }
      return Result.success(codes)
    })
  },
  verifyBackupCode: async (
    userId: string,
    code: string,
  ): Promise<VoidResult<BackupCodeInvalidError | DatabaseError>> => {
    const backupCode = await backupRepository.findByUserAndCode(userId, code)

    if (!backupCode.ok) {
      return VoidResult.error(backupCode.error)
    }
    const isValid = await hashing.argon2.compare(
      code,
      backupCode.data.code_hash,
    )
    if (!isValid) {
      return VoidResult.error(new BackupCodeInvalidError())
    }
    const marked = await backupRepository.markAsUsedById(backupCode.data.id)

    if (!marked.ok) {
      return VoidResult.error(marked.error)
    }
    return VoidResult.ok()
  },
  clearUserBackupCodes: async (
    userId: string,
  ): Promise<Result<number, DatabaseError>> => {
    return await backupRepository.deleteAllByUserId(userId)
  },
}

const generateBackupCodes = (count: number = BACKUP_CODES_COUNT): string[] => {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase()
    codes.push(code)
  }
  return codes
}

export default backupService
