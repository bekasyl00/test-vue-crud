<script setup lang="ts">
import BaseButton from '../ui/BaseButton.vue'
import type { User } from '../../types/user'

interface Props {
  users: User[]
  busy?: boolean
}

withDefaults(defineProps<Props>(), {
  busy: false,
})

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()
</script>

<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id" class="user-list__item">
      <div>
        <strong>{{ user.name }}</strong>
        <p>{{ user.email }}</p>
        <small>{{ user.role }}</small>
      </div>

      <div class="user-list__actions">
        <BaseButton variant="secondary" :disabled="busy" @click="emit('edit', user)">
          Edit
        </BaseButton>
        <BaseButton variant="danger" :disabled="busy" @click="emit('delete', user)">
          Delete
        </BaseButton>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.user-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.user-list__item {
  border: 1px solid #cde1de;
  border-radius: 12px;
  padding: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.user-list__item p {
  margin: 0.3rem 0;
}

.user-list__actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 720px) {
  .user-list__item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
