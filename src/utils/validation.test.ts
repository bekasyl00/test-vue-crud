import { describe, expect, it } from 'vitest'

import { hasValidationErrors, validateUserForm } from './validation'

describe('validateUserForm', () => {
  it('returns errors for empty name and invalid email', () => {
    const result = validateUserForm({
      name: '',
      email: 'wrong-email',
      role: 'student',
    })

    expect(result.name).toBe('Name is required.')
    expect(result.email).toBe('Email format is invalid.')
    expect(hasValidationErrors(result)).toBe(true)
  })
})
