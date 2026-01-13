<script setup>
import { ref, computed, watch } from "vue"
import Rhythm from "../Rhythm.js"

import RhythmEditor from "./RhythmEditor.vue"
import RhythmCircle from "../../packages/rhythmicon-vue/components/RhythmCircle.vue"
import RhythmInfo from "./RhythmInfo.vue"
import RhythmPlayer from "./RhythmPlayer.vue"
import RhythmScore from "./RhythmScore.vue"


const rhythm = defineModel({ validator: r => r instanceof Rhythm })
//const props = defineProps({ rhythm: Object })
//const { rhythm } = props

const first = computed(() => rhythm.value.first()+1)
const pulse = ref(undefined)

const durations = computed(() => rhythm.value?.durations() || [])
const beats = computed(() => rhythm.value?.beats() || 0)

const toggle = i => rhythm.value[i] = rhythm.value[i] ? 0 : 1

const cssSheet = new CSSStyleSheet()
document.adoptedStyleSheets = [cssSheet]
watch(pulse, async i => cssSheet.replace(`.pulse-${i} { fill: red; stroke: red; }`))
</script>

<template>
  <div>
    <RhythmEditor v-model="rhythm" :pulse="pulse" />
    ({{ durations.join("-") }})@{{ first }}
    has {{ beats }} beats in {{ rhythm.length }} pulses
    <RhythmPlayer :rhythm="rhythm" @pulse="pulse = $event" />
    <RhythmScore :rhythm="rhythm" :pulse="pulse" />
    <div style="display: flex;">
      <RhythmInfo :rhythm="rhythm" />
      <RhythmCircle :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
    </div>
  </div>
</template>

<style module="styles">

</style>

<style>
.rhythm-player {
  margin: 0.5em 0;
}
.rhythm-circle {
  flex: 0 30%;
  margin-right: 1em;
}
.rhythm-info {
  flex-grow: 1;
  flex-shrink: 1;
}
button.action {
  padding: 2px;
}
</style>
