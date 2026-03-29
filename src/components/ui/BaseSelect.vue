<script setup lang="ts">
interface Option {
  label: string
  value: string
}

interface Props {
  modelValue: string
  label: string
  options: Option[]
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="base-select">
    <span>{{ label }}</span>
    <select
      :value="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.base-select {
  display: grid;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.base-select select {
  border: 1px solid #a8c8c4;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  background: #ffffff;
}
</style>
