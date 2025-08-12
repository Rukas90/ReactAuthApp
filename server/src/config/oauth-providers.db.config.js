import { DBTableSchema } from '#config/db-table-schema.js'

export const oAuthProviderDBTable = 'oauth_providers'

export const oAuthProvidersDBTableSchema = new DBTableSchema([
  { name: 'id',             type: 'UUID NOT NULL PRIMARY KEY'},
  { name: 'user_id',        type: 'UUID REFERENCES users(id)'},
  { name: 'provider_name',  type: 'TEXT'},
  { name: 'provider_id',    type: 'TEXT'},
  { name: 'profile',        type: 'JSON'}
])