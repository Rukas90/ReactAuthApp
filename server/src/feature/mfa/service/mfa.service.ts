import { database } from "@base/app"
import { MfaEnrollment, MfaMethod } from "@prisma/client"

export const getEnrollment = async (
  userId: string,
  method: MfaMethod,
  options: { ensureCreated?: boolean } = { ensureCreated: false }
): Promise<MfaEnrollment | null> => {
  const enrollment = await database.client.mfaEnrollment.findUnique({
    where: {
      user_id_method: {
        user_id: userId,
        method: method,
      },
    },
  })
  if (!enrollment && options.ensureCreated) {
    return await database.client.mfaEnrollment.create({
      data: {
        user_id: userId,
        method,
        configured: false,
      },
    })
  }
  return enrollment
}

export const hasMfaConfigured = async (userId: string) => {
  const enrollments = await getMfaEnrollments(userId)
  return enrollments.length > 0 && enrollments.some((e) => e.configured)
}

export const getMfaEnrollments = async (
  userId: string
): Promise<MfaEnrollment[]> => {
  return await database.client.mfaEnrollment.findMany({
    where: {
      user_id: userId,
    },
  })
}
