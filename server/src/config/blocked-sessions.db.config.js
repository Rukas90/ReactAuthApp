import { DBTableSchema } from '#config/db-table-schema.js'

export const blockedSessionsDBTable = 'blocked_sessions'

export const blockedSessionsDBTableSchema = new DBTableSchema([
  { name: 'session_id',       type: 'UUID REFERENCES sessions(session_id)' },
  { name: 'block_reason',     type: 'VARCHAR(255)' },
  { name: 'block_start_time', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
  { name: 'block_duration',   type: `INTERVAL DEFAULT '24 hours'` },
  { name: 'block_end_time',   type: 'TIMESTAMP WITH TIME ZONE' }
])