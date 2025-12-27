<script setup>
/**
 * A single button with status (pressed or not pressed).
 */
import { computed } from "vue"

const props = defineProps({ modelValue: [Number, Boolean], active: Boolean })
const emit = defineEmits(["update:modelValue"])
const pressed = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value ? 1 : 0),
})
const toggle = () => pressed.value = pressed.value ? 0 : 1
</script>

<template>
  <button
    :class="{ 'beat-button': true, 'active': active }"
    :aria-pressed="modelValue ? 'true' : 'false'"
    @click="toggle"
  >
    {{ modelValue ? "x" : "-" }}
  </button>
</template>

<style>
.beat-button {
  font-family: monospace;
}
.beat-button[aria-pressed="true"] {
  background: #00aa00;
  border: 2px inset;
}
.beat-button[aria-pressed="false"] {
  border: 2px outset;
}
</style>
