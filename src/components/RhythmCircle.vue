<script setup>
import { computed } from "vue"

// TODO: make sure rhythm is not empty?
const props = defineProps({ modelValue: Array })

const dotRadius = 5 // TODO: if length > ... decrease radius

const radius = 50 - dotRadius
const dots = computed(() => props.modelValue.length)

const points = computed(() => props.modelValue.map(
  (beat, i) => {
    const angle = (2 * Math.PI * i) / dots.value + Math.PI / 2
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
      fill: beat ? "black" : "white",
      i,
    }
  },
))

function toggle(i) {
  props.modelValue[i] = props.modelValue[i] ? 0 : 1
}
</script>

<template>
  <svg preserveAspectRatio="none" viewBox="0 0 100 100" stroke="#000000">
    <circle cx="50" cy="50" :r="radius" fill="none" />
    <g v-for="(p, i) in points" :key="i">
      <circle
        class="beat-dot"
        :cx="p.x" :cy="p.y"
        :fill="p.fill"
        r="4"
        @click="toggle(p.i)"
      />
    </g> 
  </svg> 
</template>
 
<style>
.beat-dot:hover {
  stroke: red;
}
</style>
