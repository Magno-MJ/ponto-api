export interface AuthenticatedUserDTO {
  id: string
  name: string
  email: string
  created_at: string
  toke: string
  refresh_token: string
}