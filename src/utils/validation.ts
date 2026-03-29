import type { CreateUserDto } from '../types/user'

export interface UserFormErrors {
  name?: string
  email?: string
}

const MIN_NAME_LENGTH = 2

export function validateUserForm(payload: CreateUserDto): UserFormErrors {
  const errors: UserFormErrors = {}

  if (!payload.name.trim()) {
    errors.name = 'Name is required.'
  } else if (payload.name.trim().length < MIN_NAME_LENGTH) {
    errors.name = `Name must be at least ${MIN_NAME_LENGTH} characters.`
  }

  if (!payload.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Email format is invalid.'
  }

  return errors
}

export function hasValidationErrors(errors: UserFormErrors): boolean {
  return Boolean(errors.name || errors.email)
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
