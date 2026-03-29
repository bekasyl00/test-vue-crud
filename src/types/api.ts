export interface ApiError {
  message: string
  status?: number
}

export interface UserQuery {
  q?: string
  role?: string
}
