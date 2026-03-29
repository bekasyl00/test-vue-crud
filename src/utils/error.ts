import axios from 'axios'

import type { ApiError } from '../types/api'

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : error.message

    return {
      message: message || 'Unexpected API error',
      status: error.response?.status,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Unexpected API error' }
}
