import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { usersApi } from '../api/users.api'
import type { ApiError } from '../types/api'
import type { CreateUserDto, UpdateUserDto, User, UserRole } from '../types/user'
import { normalizeApiError } from '../utils/error'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<ApiError | null>(null)
  const successMessage = ref('')
  const search = ref('')
  const role = ref<UserRole | ''>('')

  const isEmpty = computed(() => !loading.value && users.value.length === 0)

  function clearStatus(): void {
    error.value = null
    successMessage.value = ''
  }

  async function fetchUsers(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      users.value = await usersApi.getUsers({ q: search.value, role: role.value })
    } catch (e: unknown) {
      error.value = normalizeApiError(e)
    } finally {
      loading.value = false
    }
  }

  async function createUser(payload: CreateUserDto): Promise<void> {
    saving.value = true
    clearStatus()

    try {
      const created = await usersApi.createUser(payload)
      users.value = [created, ...users.value]
      successMessage.value = 'User created successfully.'
    } catch (e: unknown) {
      error.value = normalizeApiError(e)
      throw error.value
    } finally {
      saving.value = false
    }
  }

  async function updateUser(id: number, payload: UpdateUserDto): Promise<void> {
    saving.value = true
    clearStatus()

    try {
      const updated = await usersApi.updateUser(id, payload)
      users.value = users.value.map((user) => (user.id === id ? updated : user))
      successMessage.value = 'User updated successfully.'
    } catch (e: unknown) {
      error.value = normalizeApiError(e)
      throw error.value
    } finally {
      saving.value = false
    }
  }

  async function deleteUser(id: number): Promise<void> {
    saving.value = true
    clearStatus()

    try {
      await usersApi.deleteUser(id)
      users.value = users.value.filter((user) => user.id !== id)
      successMessage.value = 'User deleted successfully.'
    } catch (e: unknown) {
      error.value = normalizeApiError(e)
      throw error.value
    } finally {
      saving.value = false
    }
  }

  function setSearch(value: string): void {
    search.value = value
  }

  function setRole(value: UserRole | ''): void {
    role.value = value
  }

  return {
    users,
    loading,
    saving,
    error,
    successMessage,
    search,
    role,
    isEmpty,
    clearStatus,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setSearch,
    setRole,
  }
})
