<script setup>
import { ref, watch, onUnmounted, onMounted, computed } from "vue"
import Rhythm from "rhythmicon-rhythm"
import Looper from "./Looper.js"
import TempoSelector from "./TempoSelector.vue"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const length = computed(() => rhythm.value.length)

const emit = defineEmits(["pulse"])
const pulse = ref(undefined)
watch(pulse, value => emit("pulse", value))

const isOpen = ref(false)
const running = ref(false)
const restart = ref(false)

// TODO: more sensible default value
const tempo = ref(250)
const fixedCycle = ref(false)

const volume = ref(0.8)
const muted = ref(false)

const sound = ref("click") // 'click' | 'sample'
const url = ref("")

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
  volume: muted.value ? 0 : volume.value,
  pulseMs: tempo.value,
  sound: sound.value,
  sampleUrl: sampleUrl.value,
  running,
  pulse,
})

function startStop() {
  if (running.value) {
    looper.pause()
  } else if (restart.value) {
    looper.restart()
  } else {
    looper.play()
  }
}

watch(length, (a,b) => {
  if (fixedCycle.value) {
    tempo.value = tempo.value * b / a
  }
})

watch(tempo, ms => looper.setTempo(ms))

watch(sampleUrl, url => looper.setSampleUrl(url))

watch(volume, v => looper.setVolume(muted.value ? 0 : v))
watch(muted, m => looper.setVolume(m ? 0 : volume.value))

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

    <div v-show="isOpen" class="modal-overlay" @click.self="isOpen = false">
      <div class="modal">
        <div class="head">
          <span>
            <input id="restart" v-model="restart" type="checkbox">
            <label for="restart">&nbsp;start on first pulse</label>
          </span>
          <span style="text-align: right">
            <button class="action" :disabled="!rhythm.length" @click="startStop">
              {{ running ? '⏸' : '▶' }}
            </button>
            <button class="action close-btn" @click="isOpen = false">
              ×
            </button>
          </span>
        </div>

        <div style="margin: 0 0.5rem">
          <div> 
            <button class="action" :title="muted ? 'unmute' : 'mute'" @click="muted = !muted">
              <img :src="muteIcon">
            </button>
            <input
              v-model.number="volume"
              style="margin-left: 0.5em" type="range"
              min="0" max="1"
              step="0.01"
              :disabled="muted"
            >
          </div>

          <h2>
            Tempo
            <label style="font-weight: normal">
              <input v-model="fixedCycle" type="checkbox">
              fixed cycle length
            </label>
          </h2>
          <TempoSelector v-model="tempo" :length="length" />

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
.rhythm-player .modal .head {
  display: flex;
  justify-content: space-between; 
  margin: 0;
  padding: 0.25rem 0 0.25rem 0.25em;
}
.close-btn {
  margin: 0 0.5rem;
  background: none;
  border: none;
 }
.rhythm-player .modal h2 {
  border-top: 1px solid #333;
  font-size: 1rem;
  padding: 0.5rem 0;
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
