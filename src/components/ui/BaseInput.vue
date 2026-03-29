<script setup lang="ts">
interface Props {
  modelValue: string
  label: string
  type?: 'text' | 'email'
  placeholder?: string
  error?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="base-input">
    <span>{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="error" class="base-input__error">{{ error }}</small>
  </label>
</template>

<style scoped>
.base-input {
  display: grid;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.base-input input {
  border: 1px solid #a8c8c4;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
}

.base-input__error {
  color: #b91c1c;
}
</style>
