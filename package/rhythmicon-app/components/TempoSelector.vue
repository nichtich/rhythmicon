<script setup>
import { ref, watch, computed, onMounted } from "vue"

const tempo = defineModel({ type: Number, required: true })
const props = defineProps({ length: { type: Number } })
const length = computed(() => props.length || 1)

const ppm = ref(240)
const bpm = ref(80)
const beats = ref(1)
const cycles = ref(80)
const duration = ref(750)

const validTempo = t => t >= 10 && t <= 60000

onMounted(() => {
  if (!validTempo(tempo.value)) {
    tempo.value = 250
  }
})

watch(tempo, () => updateInputsFromTempo(), { immediate: true })

function round(n,digits) {
  n = n.toFixed(digits)
  return( (!digits || n.match(/\.0+$/)) ? parseInt(n) : parseFloat(n))
}

/*
function change(what,how) {
  return ({target}) => {
    if (target.value > 0) {
      what.value = target.value
      tempo.value = how(target.value)
    } else {
      console.log(`not >0, so reset to ${what.value}`)
      target.value = what.value
    }
  }
}

//const ppmChange = change(ppm, v => 60000 / v)
*/

function ppmChange({target}) {
  if (target.value > 0) {
    ppm.value = target.value
    tempo.value = 60000 / target.value
  } else {
    target.value = ppm.value
  }
}

function bpmChange({ target }) {
  if (target.value > 0) {
    bpm.value = target.value
    tempo.value = round(60000 / (bpm.value * beats.value * length.value), 1)
  } else {
    target.value = bpm.value
  }
}

function beatsChange({ target }) {
  if (target.value > 0) {
    beats.value = target.value
    bpm.value  = ppm.value / beats.value / length.value
  } else {
    target.value = beats.value
  }
}

function cyclesChange({ target }) {
  if (target.value > 0) {
    cycles.value = target.value
    tempo.value = 60000 / target.value / length.value
  } else {
    target.value = cycles.value
  }
}

function durationChange({ target }) {
  if (target.value > 0) {
    duration.value = target.value
    tempo.value = target.value / length.value
  } else {
    target.value = duration.value
  }
}

function updateInputsFromTempo() {
  const ms = tempo.value
  if (!validTempo(ms)) {
    return
  }

  // pulses and beats per minute
  ppm.value = round(60000 / ms, 1)

  beats.value = 1
  bpm.value = round(60000 / (ms * beats.value * length.value),1)

  // cycles per minute and cyle duration
  cycles.value = round(60000 / (ms * length.value),2)
  duration.value = round(ms * length.value,0)
}
</script>

<template>
  <div class="tempo-selector">
    <div>
      <label for="tempo-ppm">
        <input
          v-model.number="ppm" type="number"
          min="1" step="1"
          style="width:4em"
          @change="ppmChange"
        >
        pulses per minute
      </label>
      <br>
      <label>
        <input
          v-model.number="bpm" type="number"
          min="10" step="0.1"
          style="width:4em"
          @change="bpmChange"
        >
        basic BPM
      </label>
      <br>
      <label>
        <input
          :value="beats" type="number"
          min="1" max="32"
          style="width:2.5em" 
          @change="beatsChange"
        > base beats per cycle        
      </label>
      <br>
      <small>1 base beat = {{ round(length / beats,2) }} pulses of {{ length }}</small>
    </div>
    <div>
      <label for="tempo-cycles">
        <input
          :value="cycles" type="number"
          min="1" step="0.1"
          style="width:4em"
          @change="cyclesChange" 
        >
        cycles per minute
      </label><br>
      cycle duration 
      <input :value="duration" style="width:4em" @change="durationChange"> ms
    </div>
  </div>
</template>
