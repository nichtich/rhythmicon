<script setup>
import { ref, watch, onUnmounted } from "vue"
import Looper from "../Looper.js"

const props = defineProps({ rhythm: Array })

const emit = defineEmits(["step"])

const running = ref(false)
const step = ref(undefined)
watch(step, value => emit("step", value))

const stepMs = ref(250)
const soundType = ref("click") // 'click' | 'sample'
const sampleUrl = ref("")
const volume = ref(0.2)

// create Looper instance
const looper = new Looper({
  rhythmRef: props.rhythm,
  volume: volume.value,
  stepMs: stepMs.value,
  soundType: soundType.value,
  sampleUrl: sampleUrl.value,
  running,
  step,
})

watch(stepMs, ms => looper.setStepMs(ms))
watch(soundType, t => looper.setSoundType(t))
watch(sampleUrl, url => looper.setSampleUrl(url))
watch(volume, v => looper.setVolume(v))

onUnmounted(() => looper.pause())
</script>

<template>
  <div>
    <div style="display:flex; gap:1rem; align-items:center;">
      <button class="action" @click="running ? looper.pause() : looper.play()">
        {{ running ? '⏸' : '▶' }}
      </button>
      <label>
        Step (ms):
        <input v-model.number="stepMs" type="number" min="20">
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
        Volume:
        <input
          v-model.number="volume" type="range"
          min="0" max="1"
          step="0.01"
        > {{ Math.round(volume*100) }}%
      </label>
    </div>
  </div>
</template>
