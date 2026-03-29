<script setup lang="ts">
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'

interface Props {
  search: string
  role: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:role': [value: string]
}>()

const roleOptions = [
  { label: 'All roles', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Student', value: 'student' },
]
</script>

<template>
  <section class="user-filters">
    <BaseInput
      label="Search"
      :model-value="search"
      placeholder="Find by name or email"
      :disabled="disabled"
      @update:model-value="emit('update:search', $event)"
    />

    <BaseSelect
      label="Role"
      :model-value="role"
      :options="roleOptions"
      :disabled="disabled"
      @update:model-value="emit('update:role', $event)"
    />
  </section>
</template>

<style scoped>
.user-filters {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 200px;
}

@media (max-width: 720px) {
  .user-filters {
    grid-template-columns: 1fr;
  }
}
</style>
