import { DBTableSchema } from '#config/db-table-schema.js'

export const sessionsDBTable = 'sessions'

export const sessionsDBTableSchema = new DBTableSchema([
  { name: 'session_id',           type: 'UUID NOT NULL PRIMARY KEY' },
  { name: 'user_id',              type: 'UUID REFERENCES users(id)' },
  { name: 'ip_address',           type: 'TEXT' },
  { name: 'device_type',          type: 'TEXT' },
  { name: 'location',             type: 'TEXT' },
  { name: 'login_time',           type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
  { name: 'last_activity_time' ,  type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
  { name: 'source',               type: 'TEXT' }
])