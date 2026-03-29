<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import type { CreateUserDto, User } from '../../types/user'
import { hasValidationErrors, validateUserForm } from '../../utils/validation'

interface Props {
  initialUser?: User | null
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialUser: null,
  busy: false,
})

const emit = defineEmits<{
  submit: [payload: CreateUserDto]
  cancel: []
}>()

const form = reactive<CreateUserDto>({
  name: '',
  email: '',
  role: 'student',
})

const errors = reactive<{ name: string; email: string }>({
  name: '',
  email: '',
})

const submitLabel = computed(() => (props.initialUser ? 'Save changes' : 'Create user'))

watch(
  () => props.initialUser,
  (user) => {
    if (!user) {
      form.name = ''
      form.email = ''
      form.role = 'student'
      errors.name = ''
      errors.email = ''
      return
    }

    form.name = user.name
    form.email = user.email
    form.role = user.role
    errors.name = ''
    errors.email = ''
  },
  { immediate: true },
)

function onSubmit(): void {
  const result = validateUserForm({ ...form })
  errors.name = result.name ?? ''
  errors.email = result.email ?? ''

  if (hasValidationErrors(result)) {
    return
  }

  emit('submit', { ...form })
}
</script>

<template>
  <form class="user-form" @submit.prevent="onSubmit">
    <h2>{{ initialUser ? 'Edit user' : 'New user' }}</h2>

    <BaseInput
      label="Name"
      :model-value="form.name"
      :error="errors.name"
      :disabled="busy"
      placeholder="John Doe"
      @update:model-value="form.name = $event"
    />

    <BaseInput
      label="Email"
      type="email"
      :model-value="form.email"
      :error="errors.email"
      :disabled="busy"
      placeholder="john@example.com"
      @update:model-value="form.email = $event"
    />

    <BaseSelect
      label="Role"
      :model-value="form.role"
      :disabled="busy"
      :options="[
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Student', value: 'student' },
      ]"
      @update:model-value="form.role = $event as CreateUserDto['role']"
    />

    <div class="user-form__actions">
      <BaseButton type="submit" :loading="busy">{{ submitLabel }}</BaseButton>
      <BaseButton type="button" variant="secondary" :disabled="busy" @click="emit('cancel')">
        Cancel
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.user-form {
  display: grid;
  gap: 0.8rem;
  border: 1px solid #cde1de;
  border-radius: 14px;
  padding: 1rem;
  background: #ffffff;
}

.user-form h2 {
  margin: 0;
  font-size: 1.1rem;
}

.user-form__actions {
  display: flex;
  gap: 0.55rem;
}
</style>
