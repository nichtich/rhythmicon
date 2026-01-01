<script setup>
import { ref, computed, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import Rhythm from "../Rhythm.js"

import RhythmEditor from "./RhythmEditor.vue"
import RhythmCircle from "./RhythmCircle.vue"
import RhythmInfo from "./RhythmInfo.vue"
import RhythmTextInput from "./RhythmTextInput.vue"
import RhythmPlayer from "./RhythmPlayer.vue"

const props = defineProps({ pattern: String }) // from route
const rhythm = ref(new Rhythm(props.pattern))
const first = computed(() => rhythm.value.first()+1)
const step = ref(undefined)

// TODO: move router to App
const router = useRouter()
const route = useRoute()
watch(() => route.query.pattern, pattern => rhythm.value.replace(pattern))
watch(rhythm, value => {
  router.push({ query: { pattern: value.toString() }})
}, {deep: true})

const durations = computed(() => rhythm.value?.durations() || [])
const beats = computed(() => rhythm.value?.beats() || 0)

const toggle = i => rhythm.value[i] = rhythm.value[i] ? 0 : 1
</script>

<template>
  <div>
    <RhythmEditor v-model="rhythm" :step="step" />
    <RhythmTextInput v-model="rhythm" />
    ({{ durations.join("-") }})@{{ first }}
    has {{ beats }} beats in {{ rhythm.length }} steps
    <RhythmPlayer :rhythm="rhythm" @step="step = $event" />
    <div style="display: flex;">
      <RhythmCircle :rhythm="rhythm" :step="step" @toggle="toggle" />
      <RhythmInfo :rhythm="rhythm" />
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
