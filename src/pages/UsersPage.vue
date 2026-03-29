<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import UserFilters from '../components/users/UserFilters.vue'
import UserForm from '../components/users/UserForm.vue'
import UserList from '../components/users/UserList.vue'
import BaseAlert from '../components/ui/BaseAlert.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { useUsersStore } from '../stores/users.store'
import type { CreateUserDto, User, UserRole } from '../types/user'
import { debounce } from '../utils/debounce'

const usersStore = useUsersStore()
const editingUser = ref<User | null>(null)

const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const saving = computed(() => usersStore.saving)
const error = computed(() => usersStore.error)
const successMessage = computed(() => usersStore.successMessage)
const isEmpty = computed(() => usersStore.isEmpty)
const search = computed(() => usersStore.search)
const role = computed(() => usersStore.role)

onMounted(async () => {
  await usersStore.fetchUsers()
})

const debouncedFetch = debounce(async () => {
  await usersStore.fetchUsers()
}, 300)

function onSearchChange(value: string): void {
  usersStore.setSearch(value)
  debouncedFetch()
}

async function onRoleChange(value: string): Promise<void> {
  usersStore.setRole(value as UserRole | '')
  await usersStore.fetchUsers()
}

function onEditUser(user: User): void {
  editingUser.value = user
}

function resetForm(): void {
  editingUser.value = null
  usersStore.clearStatus()
}

async function onDeleteUser(user: User): Promise<void> {
  try {
    await usersStore.deleteUser(user.id)
    await usersStore.fetchUsers()
  } catch {
    // Error state is already handled by store.
  }
}

async function onSubmit(payload: CreateUserDto): Promise<void> {
  try {
    if (editingUser.value) {
      await usersStore.updateUser(editingUser.value.id, payload)
      editingUser.value = null
    } else {
      await usersStore.createUser(payload)
    }

    await usersStore.fetchUsers()
  } catch {
    // Error state is already handled by store.
  }
}

async function retryFetch(): Promise<void> {
  await usersStore.fetchUsers()
}
</script>

<template>
  <main class="users-page">
    <header class="users-page__header">
      <h1>Users</h1>
      <BaseButton variant="secondary" :disabled="loading || saving" @click="retryFetch">
        Refresh
      </BaseButton>
    </header>

    <section class="users-page__grid">
      <UserForm :initial-user="editingUser" :busy="saving" @submit="onSubmit" @cancel="resetForm" />

      <section class="users-page__content">
        <UserFilters
          :search="search"
          :role="role"
          :disabled="loading || saving"
          @update:search="onSearchChange"
          @update:role="onRoleChange"
        />

        <BaseAlert v-if="successMessage" type="success">{{ successMessage }}</BaseAlert>

        <section v-if="loading" class="users-page__state">Loading users...</section>

        <section v-else-if="error" class="users-page__state users-page__state--error">
          <BaseAlert type="error">{{ error.message }}</BaseAlert>
          <BaseButton variant="secondary" @click="retryFetch">Retry</BaseButton>
        </section>

        <section v-else-if="isEmpty" class="users-page__state">No users found.</section>

        <section v-else>
          <UserList :users="users" :busy="saving" @edit="onEditUser" @delete="onDeleteUser" />
        </section>
      </section>
    </section>
  </main>
</template>

<style scoped>
.users-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.2rem 1rem;
}

.users-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.users-page__header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.users-page__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(260px, 330px) minmax(0, 1fr);
}

.users-page__content {
  display: grid;
  gap: 0.8rem;
}

.users-page__state {
  padding: 1rem;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  display: grid;
  gap: 0.7rem;
}

.users-page__state--error {
  border-color: #ffb3b3;
  background: #fff5f5;
}

@media (max-width: 960px) {
  .users-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
