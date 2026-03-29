import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useUsersStore } from './users.store'
import { usersApi } from '../api/users.api'

vi.mock('../api/users.api', () => ({
  usersApi: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}))

describe('users store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches users with current search and role filters', async () => {
    vi.mocked(usersApi.getUsers).mockResolvedValue([
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    ])

    const store = useUsersStore()
    store.setSearch('alice')
    store.setRole('admin')

    await store.fetchUsers()

    expect(usersApi.getUsers).toHaveBeenCalledWith({ q: 'alice', role: 'admin' })
    expect(store.users).toHaveLength(1)
    expect(store.error).toBeNull()
  })
})
