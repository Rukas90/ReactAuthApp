import { database }                                             from "#services/database.service.js"
import { blockedSessionsDBTable, blockedSessionsDBTableSchema } from "./blocked-sessions.db.config.js"
import { oAuthProviderDBTable, oAuthProvidersDBTableSchema }    from "./oauth-providers.db.config.js"
import { sessionsDBTable, sessionsDBTableSchema }               from "./sessions.db.config.js"
import { usersDBTable, usersDBTableSchema }                     from "./user.db.config.js"
import { verificationCodeDBTableSchema, verificationsDBTable }  from "./verifications.db.config.js"

export const initializeDatabaseTables = async () => {
    await database.validateDBTable(usersDBTable, usersDBTableSchema)
    await database.validateDBTable(sessionsDBTable, sessionsDBTableSchema)
    await database.validateDBTable(oAuthProviderDBTable, oAuthProvidersDBTableSchema)
    await database.validateDBTable(blockedSessionsDBTable, blockedSessionsDBTableSchema)
    await database.validateDBTable(verificationsDBTable, verificationCodeDBTableSchema)
}