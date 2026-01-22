<script setup>
import { ref, watch, onUnmounted, computed } from "vue"
import Rhythm from "rhythmicon-rhythm"
import Looper from "./Looper.js"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const emit = defineEmits(["pulse"])

const isOpen = ref(false)
const running = ref(false)
const pulse = ref(undefined)
watch(pulse, value => emit("pulse", value))

const bpm = ref(90)
const beats = ref(rhythm.value ? Math.round(rhythm.value.length / 2) : 0)

function pulseDuration() {
  return 60000 / (bpm.value * beats.value)
}

const soundType = ref("click") // 'click' | 'sample'
const sampleUrl = ref("")
const volume = ref(0.2)

const looper = new Looper({
  rhythmRef: rhythm,
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

// TODO: play/pause
const img = computed(() => `./img/audio-volume-${running.value ? "high" : "muted"}-panel.svg`)

</script>

<template>
  <div class="rhythm-player">
    <img 
      :src="img"
      class="player-icon" 
      role="button"
      alt="Open Rhythm Player"
      @click="isOpen = true"
    >
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
      <div class="modal">
        <h1>
          <span>Play current rhythm</span>
          <button class="action" @click="running ? looper.pause() : looper.play()">
            {{ running ? '⏸' : '▶' }}
          </button>
          <button class="close-btn" @click="isOpen = false">
            ×
          </button>        
        </h1>
        <div class="player-controls">
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap: wrap;">
            <div>
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
          </div>
          <div>
            <label>
              Sound:
              <select v-model="soundType">
                <option value="click">Click (oscillator)</option>
                <option value="sample">Sample (audio)</option>
              </select>
            </label>
          </div>
          <div>
            <label v-if="soundType === 'sample'">
              Sample URL:
              <input v-model="sampleUrl" type="text" placeholder="https://example.com/click.mp3">
            </label>
          </div>
          <div>
            <label>
              Volume:
              <input
                v-model.number="volume" type="range"
                min="0" max="1"
                step="0.01"
                style="width: 5em"
              > {{ Math.round(volume*100) }}%
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.player-icon {
  filter:invert(100%);
  cursor: pointer;
  height: 1.5em;
  vertical-align: baseline;
  margin-right: 0.5em;
}
.rhythm-player .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: start;
  justify-content: right;
  z-index: 200;
}
.rhythm-player .modal {
  background: var(--bg-color, white);
  color: var(--text-color, black);
  padding: 0.25rem;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.rhythm-player .modal h1 {
  margin: 0;
  font-size: 1.5rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  float: right;
}
</style>
