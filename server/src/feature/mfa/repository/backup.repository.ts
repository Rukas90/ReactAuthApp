import { database } from "@base/app"
import { BackupCode, Prisma } from "@prisma/client"
import { BackupCodeInvalidError } from "../error/backup.error"
import { generateLookupHash } from "../util/backup.util"
import { Result, VoidResult } from "@project/shared"
import { hashing } from "@shared/security"
import logger from "@shared/logger"
import { DatabaseError } from "@shared/errors"

type TransactionClient = Prisma.TransactionClient

const backupRepository = {
  create: async (
    userId: string,
    code: string,
    client?: TransactionClient,
  ): Promise<Result<BackupCode, DatabaseError>> => {
    try {
      const codeHash = await hashing.argon2.hash(code)
      const lookupHash = await generateLookupHash(code)
      const backupCode = await (client ?? database.client).backupCode.create({
        data: {
          user_id: userId,
          code_hash: codeHash,
          lookup_hash: lookupHash,
        },
      })
      return Result.success(backupCode)
    } catch (error) {
      logger.error("Failed to create backup code.", error)
      return Result.error(new DatabaseError("Failed to create backup code."))
    }
  },
  findByUserAndCode: async (
    userId: string,
    code: string,
    client?: TransactionClient,
  ): Promise<Result<BackupCode, BackupCodeInvalidError | DatabaseError>> => {
    try {
      const lookupHash = await generateLookupHash(code)
      const backupCode = await (
        client ?? database.client
      ).backupCode.findUnique({
        where: {
          user_id: userId,
          lookup_hash: lookupHash,
        },
      })
      if (!backupCode) {
        return Result.error(new BackupCodeInvalidError())
      }
      return Result.success(backupCode)
    } catch (error) {
      logger.error("Failed to get backup code.", error)
      return Result.error(new DatabaseError("Failed to get backup code."))
    }
  },
  deleteAllByUserId: async (
    userId: string,
    client?: TransactionClient,
  ): Promise<Result<number, DatabaseError>> => {
    try {
      const payload = await (client ?? database.client).backupCode.deleteMany({
        where: {
          user_id: userId,
        },
      })
      return Result.success(payload.count)
    } catch (error) {
      logger.error("Failed to delete backup code.", error)
      return Result.error(new DatabaseError("Failed to delete backup code."))
    }
  },
  markAsUsedById: async (
    id: string,
    client?: TransactionClient,
  ): Promise<VoidResult<DatabaseError>> => {
    try {
      await (client ?? database.client).backupCode.update({
        where: {
          id,
        },
        data: {
          used_at: new Date(),
        },
      })
      return VoidResult.ok()
    } catch (error) {
      logger.error("Failed to mark backup code as used.", error)
      return VoidResult.error(
        new DatabaseError("Failed to mark backup code as used."),
      )
    }
  },
}
export default backupRepository
