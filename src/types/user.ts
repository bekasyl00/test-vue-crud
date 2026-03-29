export type UserRole = 'admin' | 'manager' | 'student'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export type CreateUserDto = Omit<User, 'id'>
export type UpdateUserDto = Partial<CreateUserDto>
