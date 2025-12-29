<script setup>
import { ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import Rhythm from "../Rhythm.js"

import RhythmEditor from "./RhythmEditor.vue"
import RhythmCircle from "./RhythmCircle.vue"
import RhythmInfo from "./RhythmInfo.vue"
import RhythmPlayer from "./RhythmPlayer.vue"

const props = defineProps({ pattern: String }) // from route
const rhythm = ref(new Rhythm(props.pattern))
const step = ref(undefined)

const router = useRouter()
const route = useRoute()

watch(() => route.query.pattern, pattern => rhythm.value.replace(pattern))
watch(rhythm, value => {
  router.push({ query: { pattern: value.toString() }})
}, {deep: true})

const toggle = i => rhythm.value[i] = rhythm.value[i] ? 0 : 1
</script>

<template>
  <div>
    <RhythmEditor v-model="rhythm" :step="step" />
    <RhythmPlayer :rhythm="rhythm" @step="step = $event" />
    <RhythmCircle :rhythm="rhythm" :step="step" @toggle="toggle" />
    <RhythmInfo :rhythm="rhythm" />
  </div>
</template>

<style>
.rhythm-player {
  margin: 0.5em 0;
}
.rhythm-circle {
  float:left;
  width:30%;
  margin-right: 1em;
}
.rhythm-info {
}
button.action {
  padding: 2px;
}
</style>
