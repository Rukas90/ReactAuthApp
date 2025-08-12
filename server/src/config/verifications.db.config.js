import { DBTableSchema } from '#config/db-table-schema.js'

export const verificationsDBTable = 'verifications'

export const verificationCodeDBTableSchema = new DBTableSchema([
  { name: 'id',             type: 'UUID NOT NULL PRIMARY KEY' },
  { name: 'user_id',        type: 'UUID REFERENCES users(id)' },
  { name: 'type',           type: 'TEXT NOT NULL' },
  { name: 'code_hash',      type: 'TEXT NOT NULL' },
  { name: 'dispatch',       type: 'JSON NOT NULL' },
  { name: 'expires_at',     type: 'TIMESTAMP WITH TIME ZONE NOT NULL' },
  { name: 'attempts_left',  type: 'SMALLINT DEFAULT 0 NOT NULL' },
  { name: 'created_at',     type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL' },
])