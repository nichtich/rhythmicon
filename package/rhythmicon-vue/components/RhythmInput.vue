<script setup>
import { ref, watch } from "vue"
import Rhythm from "rhythmicon-rhythm"

const rhythm = defineModel({ type: Array })
const mode = ref("pattern") // pattern | durations | tracy

function toString(r) {
  if (r?.length) {
    if (mode.value === "durations") {
      return r.toDurations() 
    } else if (mode.value === "tracy" && r.length % 3 === 0) {
      return "T" + r.toTracy()
    } else {
      return r.toString()
    }
  }
  return ""
}

const computeInput = () => toString(rhythm.value)
const input = ref(computeInput())

function reset() {
  input.value = computeInput()
}

watch(rhythm.value, reset)

function submit() {
  let str = input.value.replaceAll(/\s+/g,"")
  let r
  if (Rhythm.isDurationsString(str)) {
    r = Rhythm.fromDurations(str)
    mode.value = "durations"
  } else if (str.match(/^T[0-7]+$/)) {
    r = Rhythm.fromTracy(str)
    mode.value = "tracy"
  } else {
    r = Rhythm.fromPattern(str)
    mode.value = "pattern"
  }
  rhythm.value.replace(r.toString())
}

function toggleMode(up=false) {
  let str = input.value.replaceAll(/\s+/g,"")
  let r
  if (Rhythm.isDurationsString(str)) {
    r = Rhythm.fromDurations(str)
    mode.value = up || r.length % 3 ? "pattern" : "tracy"
  } else if (str.match(/^[a-z_.0 -]+$/i)) { // TODO: document this
    r = Rhythm.fromPattern(str)
    mode.value = !up || r.length % 3 ? "durations" : "tracy"
  } else if (str.match(/^T[0-7]+$/)) {
    r = Rhythm.fromTracy(str)
    mode.value = up ? "durations" : "pattern"
  }
  if (r) {
    input.value = toString(r)
  }
}
</script>

<template>
  <input
    v-model="input" class="rhythm-input"
    type="text" pattern="^([A-Za-z_.0 \-]+|T[0-7]+|\s*(\+|-)*\s*[1-9][0-9]*(\s*(\+|-)\s*[1-9][0-9]*)*\s*)$"
    placeholder="pattern (x-x--...) or durations (2+3...)"
    @keydown.esc="reset"
    @blur="reset"
    @keydown.enter="submit"
    @keydown.up.prevent="toggleMode(1)"
    @keydown.down.prevent="toggleMode()"
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
