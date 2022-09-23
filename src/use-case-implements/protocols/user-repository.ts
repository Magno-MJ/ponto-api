export interface UserRepository {
  findOne(email: string, password: string): 
    Promise<{ id: string, email: string, created_at: string, deleted_at: string}>
}