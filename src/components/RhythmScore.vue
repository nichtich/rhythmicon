<script setup>
import { onMounted, watch, nextTick } from "vue"
import { renderScore } from "../vexflow.js"

const props = defineProps({ rhythm: Array })
const width = 800
const height = 210 // TODO: 110
const render = () => renderScore("score", props.rhythm, { width, height })

watch(props.rhythm, render)
onMounted(async () => nextTick().then(render))
</script>

<template>
  <div id="score" class="vex-score-container" :style="{ width: width + 'px', height: height + 'px' }" />
</template>

<style>
#score { border: 1px dotted #ddd; }
</style>
