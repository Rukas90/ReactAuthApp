import { hashing } from "@shared/security"

export const generateLookupHash = async (code: string): Promise<string> => {
  return await hashing.hmac.hash(code, process.env.BACKUP_CODE_LOOKUP_SECRET!)
}
