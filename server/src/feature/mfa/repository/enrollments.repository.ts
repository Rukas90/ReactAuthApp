import { database } from "@base/app"
import { DatabaseError } from "@shared/errors"
import { MfaEnrollment } from "@prisma/client"
import { MfaMethod, Result } from "@project/shared"
import logger from "@base/shared/logger"

const enrollmentRepository = {
  findAllByUserId: async (
    userId: string,
  ): Promise<Result<MfaEnrollment[], DatabaseError>> => {
    try {
      return Result.success(
        await database.client.mfaEnrollment.findMany({
          where: {
            user_id: userId,
          },
        }),
      )
    } catch (error) {
      logger.error("Failed to find all enrollments by user id.", error)
      return Result.error(
        new DatabaseError("Failed to find all enrollments by user id."),
      )
    }
  },
  findAllByUserIdAndMethod: async (
    userId: string,
    method: MfaMethod,
  ): Promise<Result<MfaEnrollment | null, DatabaseError>> => {
    try {
      return Result.success(
        await database.client.mfaEnrollment.findUnique({
          where: {
            user_id_method: {
              user_id: userId,
              method: method,
            },
          },
        }),
      )
    } catch (error) {
      logger.error("Failed to find the method enrollment.", error)
      return Result.error(
        new DatabaseError("Failed to find the method enrollment."),
      )
    }
  },
  markMethodAsConfiguredByUserId: async (
    userId: string,
    method: MfaMethod,
  ): Promise<Result<{ count: number }, DatabaseError>> => {
    try {
      const payload = await database.client.mfaEnrollment.updateMany({
        where: {
          user_id: userId,
          method: method,
        },
        data: {
          configured: true,
          expires_At: undefined,
        },
      })
      return Result.success({
        count: payload.count,
      })
    } catch (error) {
      logger.error("Failed to configure enrollment method by user id.", error)
      return Result.error(
        new DatabaseError("Failed to configure enrollment method by user id."),
      )
    }
  },
  create: async (
    userId: string,
    method: MfaMethod,
    expMin: number,
  ): Promise<Result<MfaEnrollment, DatabaseError>> => {
    try {
      const expiration = new Date(Date.now() + expMin * 60 * 1000)
      return Result.success(
        await database.client.mfaEnrollment.upsert({
          where: {
            user_id_method: {
              user_id: userId,
              method: method,
            },
          },
          update: {
            configured: false,
            expires_At: expiration,
            credentials: undefined,
          },
          create: {
            user_id: userId,
            method: method,
            configured: false,
            expires_At: expiration,
          },
        }),
      )
    } catch (error) {
      logger.error("Failed to create new enrollment method.", error)
      return Result.error(
        new DatabaseError("Failed to create new enrollment method."),
      )
    }
  },
  deleteByUserIdAndMethod: async (
    userId: string,
    method: MfaMethod,
  ): Promise<Result<{ count: number }, DatabaseError>> => {
    try {
      const payload = await database.client.mfaEnrollment.deleteMany({
        where: {
          user_id: userId,
          method: method,
        },
      })
      return Result.success({
        count: payload.count,
      })
    } catch (error) {
      logger.error("Failed to delete the enrollment method.", error)
      return Result.error(
        new DatabaseError("Failed to delete the enrollment method."),
      )
    }
  },
}

export default enrollmentRepository
