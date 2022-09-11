export interface AuthenticatedUserDTO {
  id: string
  name: string
  email: string
  created_at: string
  token: string
  refresh_token: string
}