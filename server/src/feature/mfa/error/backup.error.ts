import { BackupErrorCodes } from "@project/shared"
import { InvalidOperationError, UnexpectedError } from "@shared/errors"

export class BackupCodeInvalidError extends InvalidOperationError {
  constructor() {
    super("Invalid backup code.", BackupErrorCodes.BACKUP_CODE_INVALID)
  }
}
