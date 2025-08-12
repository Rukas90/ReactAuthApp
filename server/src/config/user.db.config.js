import { DBTableSchema } from '#config/db-table-schema.js'

export const usersDBTable = 'users'

export const usersDBTableSchema = new DBTableSchema([
  { name: 'id',                 type: 'UUID NOT NULL PRIMARY KEY' },
  { name: 'email',              type: 'TEXT' },
  { name: 'password',           type: 'TEXT' },
  { name: 'is_verified',        type: 'BOOLEAN DEFAULT FALSE' },
  { name: 'date',               type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
  { name: 'verification_code',  type: 'VARCHAR' },
  { name: 'code_expire_date' ,  type: 'TIMESTAMP WITH TIME ZONE' },
  { name: 'two_fa_secret',      type: 'TEXT' },
  { name: 'two_fa_active',      type: 'BOOLEAN DEFAULT FALSE' }
])