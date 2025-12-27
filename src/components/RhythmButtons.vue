<script setup>
/**
 * A sequence of beat buttons.
 */
import BeatButton from "./BeatButton.vue"

defineProps({ modelValue: Array })
</script>

<template>
  <ul class="rhythm-buttons">
    <li
      v-for="(item, i) in modelValue"
      :key="i"
    >
      <BeatButton v-model="modelValue[i]" />
    </li>
  </ul>
</template>

<style>
.rhythm-buttons {
  list-style-type: none;
  display: inline-block;
  padding: 0;
}
.rhythm-buttons li {
  display: inline-block;
  padding: 1px;
}
</style>
