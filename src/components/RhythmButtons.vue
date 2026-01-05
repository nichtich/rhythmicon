<script setup>
/**
 * A sequence of beat buttons, encoding a Rhythm.
 */
import BeatButton from "./BeatButton.vue"

defineProps({ rhythm: Array, pulse: Number })
const emit = defineEmits(["toggle"])
</script>

<template>
  <ul class="rhythm-buttons">
    <li v-for="(item, i) in rhythm" :key="i">
      <BeatButton
        :pressed="!!rhythm[i]" :active="pulse === i"
        @toggle="emit('toggle',i)"
      />
    </li>
  </ul>
</template>

<style>
.rhythm-buttons {
  list-style-type: none;
  display: inline-block;
  padding: 0;
  margin: 0;
}
.rhythm-buttons li {
  display: inline-block;
  padding: 1px;
}
</style>
