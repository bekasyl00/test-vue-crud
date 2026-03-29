<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useUsersStore } from '../stores/users.store'

const usersStore = useUsersStore()

const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)
const successMessage = computed(() => usersStore.successMessage)
const isEmpty = computed(() => usersStore.isEmpty)

onMounted(async () => {
  await usersStore.fetchUsers()
})

async function retryFetch(): Promise<void> {
  await usersStore.fetchUsers()
}
</script>

<template>
  <main class="users-page">
    <header class="users-page__header">
      <h1>Users</h1>
      <button type="button" @click="retryFetch" :disabled="loading">Refresh</button>
    </header>

    <p v-if="successMessage" class="users-page__success">{{ successMessage }}</p>

    <section v-if="loading" class="users-page__state">Loading users...</section>

    <section v-else-if="error" class="users-page__state users-page__state--error">
      <p>{{ error.message }}</p>
      <button type="button" @click="retryFetch">Retry</button>
    </section>

    <section v-else-if="isEmpty" class="users-page__state">No users found.</section>

    <section v-else>
      <ul class="users-page__list">
        <li v-for="user in users" :key="user.id">
          <strong>{{ user.name }}</strong>
          <span>{{ user.email }}</span>
          <span>{{ user.role }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.users-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.users-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.users-page__state {
  padding: 1rem;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
}

.users-page__state--error {
  border-color: #ffb3b3;
  background: #fff5f5;
}

.users-page__success {
  color: #0a7d3a;
}

.users-page__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
}

.users-page__list li {
  display: grid;
  gap: 0.25rem;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 0.75rem;
}
</style>
