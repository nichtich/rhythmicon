<script setup>
import { ref, watch, onUnmounted } from "vue"
import Looper from "../Looper.js"

const props = defineProps({ rhythm: Array })

const emit = defineEmits(["pulse"])

const running = ref(false)
const pulse = ref(undefined)
watch(pulse, value => emit("pulse", value))

const bpm = ref(90)
const beats = ref( Math.round(props.rhythm.length / 2) )

function pulseDuration() {
  return 60000 / (bpm.value * beats.value)
}

const soundType = ref("click") // 'click' | 'sample'
const sampleUrl = ref("")
const volume = ref(0.2)

const looper = new Looper({
  rhythmRef: props.rhythm,
  volume: volume.value,
  pulseMs: pulseDuration(),
  soundType: soundType.value,
  sampleUrl: sampleUrl.value,
  running,
  pulse,
})

watch(bpm, () => looper.setTempo(pulseDuration()))
watch(beats, () => looper.setTempo(pulseDuration()))
watch(soundType, t => looper.setSoundType(t))
watch(sampleUrl, url => looper.setSampleUrl(url))
watch(volume, v => looper.setVolume(v))

onUnmounted(() => looper.pause())
</script>

<template>
  <div class="rhythm-player">
    <div style="display:flex; gap:0.5rem; align-items:center;">
      <div>
        <button class="action" @click="running ? looper.pause() : looper.play()">
          {{ running ? '⏸' : '▶' }}
        </button>
        <button class="action" @click="looper.restart()">
          [▶
        </button>
      </div>
      <label>
        <input v-model.number="bpm" type="number" min="10" style="width:4em">
        BPM
      </label>
      <label>
        ×
        <input
          v-model.number="beats" type="number"
          min="1" max="32"
          style="width:2.5em"
        >        
      </label>
      <label>
        Sound:
        <select v-model="soundType">
          <option value="click">Click (oscillator)</option>
          <option value="sample">Sample (audio)</option>
        </select>
      </label>
      <label v-if="soundType === 'sample'">
        Sample URL:
        <input v-model="sampleUrl" type="text" placeholder="https://example.com/click.mp3">
      </label>
      <label>
        <input
          v-model.number="volume" type="range"
          min="0" max="1"
          step="0.01"
          style="width: 5em"
        > {{ Math.round(volume*100) }}% 🕪
      </label>
    </div>
  </div>
</template>
