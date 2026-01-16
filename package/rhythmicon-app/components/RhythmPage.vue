<script setup>
import { ref } from "vue"
import Rhythm from "rhythmicon-rhythm"

import { RhythmCircle, RhythmScore } from "rhythmicon-vue"
import RhythmEditor from "./RhythmEditor.vue"
import RhythmInfo from "./RhythmInfo.vue"
import RhythmPlayer from "./RhythmPlayer.vue"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const pulse = ref(undefined)
const toggle = i => rhythm.value[i] = rhythm.value[i] ? 0 : 1
</script>

<template>
  <div>
    <RhythmEditor v-model="rhythm" :pulse="pulse" />
    <RhythmPlayer :rhythm="rhythm" @pulse="pulse = $event" />
    <RhythmScore :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
    <div style="display: flex;">
      <RhythmInfo :rhythm="rhythm" />
      <RhythmCircle :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
    </div>
  </div>
</template>

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
