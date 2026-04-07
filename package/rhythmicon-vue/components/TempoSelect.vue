<script setup>
import { ref, watch, computed } from "vue"

const props = defineProps({
  length: { type: Number },
  division: { type: Number },
  min: { type: Number, default: 20 },
  max: { type: Number, default: 60000 },
})

const stable = defineModel("stable", { type: Boolean })

// tempo value and its internal state
const tempo = defineModel("tempo", { type: Number })
const tempoInput = ref(tempo.value || 250)
const tempoKey = ref(false)

watch(tempo, value => {
    //console.error(`setting tempoInput.value to ${value}`)
    tempoInput.value = Math.round(value).toString()
})

watch(tempoInput, (cur, old) => {
  //if (cur === old) return
  //console.error(`tempoInput changed '${old}' => '${cur}'`)
  //if (`${tempo.value}` !== `${cur}`) {
  //    console.error(`${old} '${tempo.value}' => '${cur}'`)
  const value = parseInt(cur)
  if (value >= props.min && value <= props.max) {
    if (`${tempoInput.value}` !== `${value}`) {
      // console.error(`normalize tempoInput value '${value}' from '${cur}'`)
      tempoInput.value = `${value}` // normalize input => trigger again
    } else {
        // TODO: only if rounded differs?
      tempo.value = value   // update
    }
  } else { // reset
    tempoInput.value = old  // reset
    tempoKey.value = !tempoKey.value // trigger update
  //}
  }
}, { immediate: true })


// TODO: multiple selectors MUST be synchronized! Better outside of this component.
// length changed: TODO
watch(() => props.length, (newLength, oldLength) => {
  if (stable.value && rhythm.value) {
    // TODO: this does not work properly because tempo is rounded
    // rhythm.value = tempo.value * newLength / 1000 =>
    // tempo.value = rhythm.value * 1000 / oldLength
    // tempo * length should be stable
    // tempoInput.value) * props.lengt
    //  console.log("before", tempo.value)
    tempo.value = tempo.value * oldLength / newLength
    //  console.log(tempo.value)
  }
})

const bpmKey = ref(false)
const bpm = computed({
  get() {
    return Math.round(60000 / tempoInput.value * props.division)
  },
  set(value) {
    value = parseInt(value)
    if (value > 0) {
      const t = 60000 / value * props.division / (props.length || 1)
      if (t >= props.min && t <= props.max) {
        tempo.value = t
        return
      }
    }
    bpmKey.value = !bpmKey.value // reset
  },
})

const rhythmKey = ref(false)
const rhythm = computed({
  get() {
    return (parseFloat(tempoInput.value) * props.length / 1000).toFixed(3)
  },
  set(value) {
    value = parseFloat(value)
    if (value > 0) {
      tempo.value = value / props.length * 1000
    } else {
      rhythmKey.value = !rhythmKey.value // triger update
    }
  },
})

const apporox = (value, pow=1) => {
  const round = Math.round(value*pow)/pow
  return round === value ? `= ${round}` : `≈ ${round}`
}
</script>

<template>
  <div class="tempo-select">
    <template v-if="division">
      <label>BPM</label>
      <span>
        <input :key="bpmKey" v-model.lazy="bpm" class="tempo-select-bpm">
        at {{division}} {{ division == 1 ? "pulse" : "pulses" }}
      </span>
    </template>
    <button v-if="length" :aria-pressed="!stable" @click="stable=false">
      pulse
    </button>
    <label v-else>pulse</label>
    <div>
      <input :key="tempoKey" v-model.lazy="tempoInput" class="tempo-select-pulse">
      ms
      <span v-if="length">
        {{ apporox(60000 / tempoInput) }}
        per minute 
      </span>
    </div>
    <button v-if="length" :aria-pressed="stable" @click="stable=true">
      rhythm
    </button>
    <div v-if="length">
      <input :key="rhythmKey" v-model.lazy="rhythm" class="tempo-select-total"> 
      s&emsp;
      {{ apporox(60 / rhythm, 100) }}
      per minute 
    </div>
  </div>
</template>

<style>
.tempo-select {
  display: inline-grid;
  grid-template-columns: 5em 19em;
  grid-gap: 0.25em;
}
.tempo-select > label {
  text-align: right;
  font-weight: bold;
}
.tempo-select input {
  width: 5em;
  text-align: right;
}
.tempo-select input {
  border-right: 1px solid #000;
}
.tempo-select button,
.tempo-select input {
  font-size: 100%;
  padding: 0.3em;
}
.tempo-select button {
  border: none;
  text-align: center;
}
.tempo-select button[aria-pressed="true"] {
  background: #222;
  color: #fff;
}
.tempo-select button[aria-pressed="true"]:hover {
  background: #444;
}
.tempo-select > label {
  line-height: 2em;
} 
.tempo-select-division {
  width: 3em;
}
</style>
