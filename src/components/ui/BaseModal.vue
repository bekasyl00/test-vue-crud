<script setup lang="ts">
interface Props {
  open: boolean
  title: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="base-modal" @click.self="emit('close')">
      <div class="base-modal__content" role="dialog" aria-modal="true" :aria-label="title">
        <header class="base-modal__header">
          <h2>{{ title }}</h2>
          <button type="button" @click="emit('close')">×</button>
        </header>
        <section>
          <slot />
        </section>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.base-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 20;
}

.base-modal__content {
  width: min(560px, 100%);
  border-radius: 16px;
  background: #ffffff;
  padding: 1rem;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.base-modal__header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.base-modal__header button {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
