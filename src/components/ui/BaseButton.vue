<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
})
</script>

<template>
  <button
    class="base-button"
    :class="`base-button--${variant}`"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading">Saving...</span>
    <slot v-else />
  </button>
</template>

<style scoped>
.base-button {
  border: none;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

.base-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.base-button--primary {
  background: #0f766e;
  color: #ffffff;
}

.base-button--secondary {
  background: #d9f3f0;
  color: #134e4a;
}

.base-button--danger {
  background: #7f1d1d;
  color: #ffffff;
}
</style>
