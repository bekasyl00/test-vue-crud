<script setup lang="ts">
interface Props {
  type?: 'success' | 'error' | 'info'
}

withDefaults(defineProps<Props>(), {
  type: 'info',
})
</script>

<template>
  <div class="base-alert" :class="`base-alert--${type}`">
    <slot />
  </div>
</template>

<style scoped>
.base-alert {
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  font-size: 0.95rem;
}

.base-alert--info {
  background: #ecfeff;
  color: #155e75;
}

.base-alert--success {
  background: #dcfce7;
  color: #166534;
}

.base-alert--error {
  background: #fee2e2;
  color: #991b1b;
}
</style>
