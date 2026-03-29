import { http } from './http'
import type { CreateUserDto, UpdateUserDto, User } from '../types/user'
import type { UserQuery } from '../types/api'

export const usersApi = {
  async getUsers(query: UserQuery = {}): Promise<User[]> {
    const response = await http.get<User[]>('/users', {
      params: query,
    })

    return response.data
  },

  async createUser(payload: CreateUserDto): Promise<User> {
    const response = await http.post<User>('/users', payload)
    return response.data
  },

  async updateUser(id: number, payload: UpdateUserDto): Promise<User> {
    const response = await http.patch<User>(`/users/${id}`, payload)
    return response.data
  },

  async deleteUser(id: number): Promise<void> {
    await http.delete(`/users/${id}`)
  },
}
