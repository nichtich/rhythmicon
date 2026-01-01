<script setup>
import { ref, watch, computed } from "vue"
import Rhythm from "../Rhythm.js"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const pattern = computed(() => rhythm.value?.toString() || "")
const text = ref(pattern.value)

watch(rhythm.value, () => {
  text.value = pattern.value 
})

function reset() {
  text.value = pattern.value 
}

function submit() {
  text.value = text.value.replaceAll(/[^A-Za-z0-9&+_ .-]/g,"")
  rhythm.value.replace(text.value)
}
</script>

<template>
  <input
    v-model="text" class="rhythm-text-input"
    type="text" pattern="[A-Za-z0-9&\+ _.\-]+"
    @keydown.esc="reset" @blur="reset"
    @keydown.enter="submit"
  >
</template>

<style>
.rhythm-text-input {
  font-family: monospace;
}
</style>
