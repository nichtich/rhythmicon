<script setup>
import { ref, watch } from "vue"
import Rhythm from "rhythmicon-rhythm"

const rhythm = defineModel({ type: Array })
const durations = ref(false)

const computeInput = () => (durations.value ? rhythm.value?.toDurationString() : rhythm.value?.toString()) || ""
const input = ref(computeInput())

function reset() {
  input.value = computeInput()
}

watch(rhythm.value, reset)

function submit() {
  let str = input.value.replaceAll(/\s+/g,"")
  if (Rhythm.isDurationsString(str)) {
    str = Rhythm.fromDurations(str).toString()
    durations.value = true
  } else {
    str = Rhythm.fromPattern(str).toString()
    durations.value = false
  }
  rhythm.value.replace(str)
}

function toggleDurations() {
  let str = input.value.replaceAll(/\s+/g,"")
  let r
  console.log(`toggleDurations: ${input.value}`)
  if (Rhythm.isDurationsString(str)) {
    r = Rhythm.fromDurations(str)
    durations.value = false
  } else if (str.match(/^[a-z._ -]+$/i)) { // TODO: document this
    r = Rhythm.fromPattern(str)
    durations.value = true
  }
  if (r) {
    input.value = durations.value ? r.toDurationString() : r.toString()
  }
}
</script>

<template>
  <input
    v-model="input" class="rhythm-input"
    type="text" pattern="^([A-Za-z_. \t\-]+|\s*(\+|-)*\s*[1-9][0-9]*(\s*(\+|-)\s*[1-9][0-9]*)*\s*)$"
    placeholder="pattern (x-x--...) or durations (2+3...)"
    @keydown.esc="reset"
    @blur="reset"
    @keydown.enter="submit"
    @keydown.up="toggleDurations"
    @keydown.down="toggleDurations"
  >
</template>

<style>
.rhythm-input {
  font-family: monospace;
  width: 32em;
}
.rhythm-input:invalid {
  background: #f66;
} 
</style>
