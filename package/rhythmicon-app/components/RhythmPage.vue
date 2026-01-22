<script setup>
import { ref, inject, computed } from "vue"
import Rhythm from "rhythmicon-rhythm"

import { RhythmSequencer, RhythmCircle, RhythmScore } from "rhythmicon-vue"
import RhythmEditor from "./RhythmEditor.vue"
import RhythmInfo from "./RhythmInfo.vue"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
const pulse = ref(undefined)
const toggle = i => rhythm.value[i] = rhythm.value[i] ? 0 : 1

const store = inject("store")
const info = computed(() => store.rhythms.value[rhythm.value.toString()])
</script>

<template>
  <div>
    <h2 v-if="info?.name">
      {{ info.name }}
      <span v-if="info.alias?.length">(<span v-for="(alias, i) in info.alias" :key="i">
        {{ alias }}
        <span v-if="i+1 < info.alias.length"> / </span>
      </span>)</span>
      <span v-if="info.wikidata">
        : <a :href="`https://www.wikidata.org/wiki/${info.wikidata}`">{{ info.wikidata }}</a>
      </span>
    </h2>
    <h2 v-else>
      A rhythm
    </h2>
    <div class="subtitle">
      <span v-if="rhythm.beats() == 1">
        one beat
      </span>
      <span v-else-if="rhythm.beats() > 1">
        {{ rhythm.beats() }} beats ({{ rhythm.toDurationString() }}) 
      </span>
      in {{ rhythm.length }} pulses
    </div>    
    <RhythmSequencer :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
    <RhythmEditor v-model="rhythm" :pulse="pulse" />
    <div style="display: flex; flex-wrap: wrap;">
      <div style="flex-grow:1; flex-shrink:1;">
        <RhythmScore :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
        <RhythmInfo :rhythm="rhythm" :info="info" />
      </div>
      <div style="flex:0 30%">
        <RhythmCircle :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
      </div>
    </div>
  </div>
</template>

<style>
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

