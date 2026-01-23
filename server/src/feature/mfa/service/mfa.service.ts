import { database } from "@base/app"
import { MfaEnrollment, User } from "@prisma/client"
import { MfaMethod } from "@project/shared"

type EnrollmentStatus =
  | "NULL"
  | "EXPIRED"
  | "INVALID"
  | "AWAITING_VERIFICATION"
  | "CONFIGURED"

export const getEnrollment = async (
  userId: string,
  method: MfaMethod,
): Promise<MfaEnrollment | null> => {
  return await database.client.mfaEnrollment.findUnique({
    where: {
      user_id_method: {
        user_id: userId,
        method: method,
      },
    },
  })
}
export const deleteEnrollment = async (userId: string, method: MfaMethod) => {
  return await database.client.mfaEnrollment.deleteMany({
    where: {
      user_id: userId,
      method: method,
    },
  })
}

export const createNewEnrollment = async (
  userId: string,
  method: MfaMethod,
  expMin: number,
): Promise<MfaEnrollment> => {
  const expiration = new Date(Date.now() + expMin * 60 * 1000)
  return await database.client.mfaEnrollment.upsert({
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
  })
}

export const hasMfaConfigured = async (userId: string) => {
  const enrollments = await getMfaEnrollments(userId)
  return enrollments.length > 0 && enrollments.some((e) => e.configured)
}

export const getMfaEnrollments = async (
  userId: string,
): Promise<MfaEnrollment[]> => {
  return await database.client.mfaEnrollment.findMany({
    where: {
      user_id: userId,
    },
  })
}

export const configureEnrollment = async (
  userId: string,
  method: MfaMethod,
) => {
  return await database.client.mfaEnrollment.updateMany({
    where: {
      user_id: userId,
      method: method,
    },
    data: {
      configured: true,
      expires_At: undefined,
    },
  })
}

export const getEnrollmentStatus = (
  enrollment: MfaEnrollment | null,
): EnrollmentStatus => {
  if (!enrollment) {
    return "NULL"
  }
  if (enrollment.configured) {
    return "CONFIGURED"
  }
  if (!enrollment.expires_At) {
    return "INVALID"
  }
  if (new Date() > enrollment.expires_At) {
    return "EXPIRED"
  }
  return "AWAITING_VERIFICATION"
}
