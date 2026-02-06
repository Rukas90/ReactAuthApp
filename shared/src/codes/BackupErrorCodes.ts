export const BackupErrorCodes = {
  BACKUP_CODE_INVALID: "BACKUP_CODE_INVALID",
  BACKUP_CODE_UNEXPECTED_FAILURE: "BACKUP_CODE_UNEXPECTED_FAILURE",
} as const

export type BackupErrorCode =
  (typeof BackupErrorCodes)[keyof typeof BackupErrorCodes]
