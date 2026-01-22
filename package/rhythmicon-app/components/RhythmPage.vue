<script setup>
import { ref } from "vue"
import Rhythm from "rhythmicon-rhythm"

import { RhythmSequencer, RhythmCircle, RhythmScore } from "rhythmicon-vue"
import RhythmEditor from "./RhythmEditor.vue"
import RhythmInfo from "./RhythmInfo.vue"
import RhythmPlayer from "./RhythmPlayer.vue"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const pulse = ref(undefined)
const toggle = i => rhythm.value[i] = rhythm.value[i] ? 0 : 1
</script>

<template>
  <div>
    <RhythmSequencer :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
    <RhythmEditor v-model="rhythm" :pulse="pulse" />
    <RhythmPlayer :rhythm="rhythm" @pulse="pulse = $event" />
    <div style="display: flex; flex-wrap: wrap;">
      <div style="flex-grow:1; flex-shrink:1;">
        <RhythmScore :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
        <RhythmInfo :rhythm="rhythm" />
      </div>
      <div style="flex:0 30%">
        <RhythmCircle :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
      </div>
    </div>
  </div>
</template>

<style>
.rhythm-player {
  margin: 0.5em 0;
}
.rhythm-sequencer {
  margin-bottom: 0.5em;
}
.rhythm-circle {
 /* flex: 0 30%;*/
  margin-right: 1em;
}
.source-link {
  font-size: small;
}
</style>

