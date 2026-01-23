<script setup>
import { ref, watch, onUnmounted, onMounted, computed } from "vue"
import Rhythm from "rhythmicon-rhythm"
import Looper from "./Looper.js"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const emit = defineEmits(["pulse"])

const isOpen = ref(false)
const running = ref(false)
const startAtZero = ref(false)
const pulse = ref(undefined)
watch(pulse, value => emit("pulse", value))

const bpm = ref(90)
const beats = ref(rhythm.value ? Math.round(rhythm.value.length / 2) : 1)

const tempoType = ref("ppm")
const ppm = ref(0)
const cpm = ref(0)

function pulseDuration() {
  return 60000 / (bpm.value * beats.value)
}

const sound = ref("click") // 'click' | 'sample'
const url = ref("")
const volume = ref(0.8)
const muted = ref(false)

const samples = ref([])
const sample = ref(null)

onMounted(async () => fetch("./samples.json").then(res => res.json()).then(res => {
  samples.value = res || []
  sample.value = res[0]
}))

watch(sample, s => {
  if (s && sound.value === "sample") {
    sampleUrl.value = s.url
  }
})

const sampleUrl = computed(() => {
  const urlValue = url.value
  const sampleValue = sample.value
  switch (sound.value) {
    case "url": return urlValue
    case "sample": return sampleValue?.url
  }
  return null
})

const looper = new Looper({
  rhythmRef: rhythm,
  volume: volume.value,
  pulseMs: pulseDuration(),
  sound: sound.value,
  sampleUrl: sampleUrl.value,
  running,
  muted,
  pulse,
})

function startStop() {
  if (running.value) {
    looper.pause()
  } else if (startAtZero.value) {
    looper.restart()
  } else {
    looper.play()
  }
}

watch(bpm, () => looper.setTempo(pulseDuration()))
watch(beats, () => looper.setTempo(pulseDuration()))
watch(sampleUrl, url => looper.setSampleUrl(url))
watch(volume, v => looper.setVolume(v))

onUnmounted(() => looper.pause())

const muteIcon = computed(() => `./img/audio-volume-${muted.value ? "muted" : "high"}-panel.svg`)

</script>

<template>
  <div class="rhythm-player">
    <div style="display:grid; grid-auto-flow:column; gap:0.5em; place-items:center; height:100%;">
      <button class="action" :disabled="!rhythm.length" @click="startStop">
        {{ running ? '⏸' : '▶' }}
      </button>
      <button class="action" style="margin-right:0.5em" @click="isOpen = true">
        <img :src="muteIcon" class="player-icon">
      </button>
    </div>
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
      <div class="modal">
        <h1>
          <span>Play current rhythm</span>
          <button class="action" :disabled="!rhythm.length" @click="startStop">
            {{ running ? '⏸' : '▶' }}
          </button>
          <button class="action close-btn" @click="isOpen = false">
            ×
          </button>
        </h1>
        <div style="margin: 0 0.5rem">
          <input id="startAtZero" v-model="startAtZero" type="checkbox">
          <label for="startAtZero">&nbsp;restart on first pulse</label>
          <h2>Tempo</h2>
          <div class="selection">
            <input id="tempo-ppm" v-model="tempoType" type="radio" value="ppm">
            <div>
              <label for="tempo-ppm">
                <input v-model.number="cpm" type="number" min="1" style="width:4em">
                pulses per minute
              </label>
              <br>
              <label>
                <input v-model.number="bpm" type="number" min="10" style="width:4em">
                meter BPM
              </label>
              <br>
              <label>
                <input
                  v-model.number="beats" type="number"
                  min="1" max="32"
                  style="width:2.5em"
                > meter beats per cycle        
              </label>
            </div>
            <input id="tempo-cpm" v-model="tempoType" type="radio" value="cpm">
            <div>
              <label for="tempo-cpm">
                <input v-model.number="ppm" type="number" min="1" style="width:4em">
                cycles per minute
              </label><br>
              cycle duration (ss.ms): 
              <input style="width:4em">
            </div>
          </div>
          <div><small>current rhythm has {{ rhythm.length }} pulses</small></div>
          <h2>Volume</h2>
          <div>
            <button class="action" :title="muted ? 'unmute' : 'mute'" @click="muted = !muted">
              <img :src="muteIcon">
            </button>
            <input
              v-model.number="volume" type="range"
              min="0" max="1"
              step="0.01"
              :disabled="muted"
            >
          </div>
          <h2>Sound</h2>
          <div class="selection">
            <input id="sound-click" v-model="sound" type="radio" value="click">
            <label for="sound-click">click</label>
            <input id="sound-sample" v-model="sound" type="radio" value="sample">
            <label for="sound-sample" style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
              <select v-model="sample" style="flex: 1">
                <option v-for="s in samples" :key="s.name" :value="s">
                  {{ s.name }}
                </option>
              </select>
              <a v-if="sample?.source" :href="sample?.source"><small>source</small></a>
            </label>
            <input id="sound-url" v-model="sound" type="radio" value="url">
            <label for="sound-url" style="width: 100%">
              <input v-model="url" type="text" placeholder="URL of a sample" style="width: 100%">
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.rhythm-player > button {
  margin: 0 0.25em;
  vertical-align: center;
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
.rhythm-player .modal a {
  color: #a00;
}
.rhythm-player .modal {
  background: white;
  color: black;
  padding: 0 0 0.25rem;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.rhythm-player .modal h1 {
  margin: 0;
  font-size: 1.2rem;
}
.rhythm-player .modal h1 span {
  margin: 0 1rem 0 0.5rem;
}
.close-btn {
  margin: 0 0.5rem;
  background: none;
  border: none;
 }
.rhythm-player .modal h2 {
  font-size: 1rem;
}
</style>

<style scoped>
.selection {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(1, auto);
  gap: 0.5rem 0.25rem;
  align-items: center;
  padding: 0em 1em 0.5em 0;
}
</style>
