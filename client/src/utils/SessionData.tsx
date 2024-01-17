export interface SessionData {
  session_id: string
  user_id: string
  ip_address: string
  device_type: string
  location: string
  login_time: string
  last_activity_time: string
  source: string
  geo: GeoLocation
  is_current: boolean
}
