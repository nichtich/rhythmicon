<script setup>
import { computed } from "vue"

const emit = defineEmits(["toggle"])
const props = defineProps({ rhythm: Array, pulse: Number })
const length = computed(() => props.rhythm.length)

const size = computed(() => {
  if (props.rhythm.length > 32) {
    return 2
  }
  if (props.rhythm.length > 24) {
    return 3
  }
  return 4
})

const radius = computed(() => 50 - size.value - 1)

const points = computed(() => props.rhythm.map(
  (beat, i) => {
    const angle = (2 * Math.PI * i) / length.value - Math.PI / 2
    return {
      x: 50 + radius.value * Math.cos(angle),
      y: 50 + radius.value * Math.sin(angle),
      fill: beat ? "black" : "white",
      i,
    }
  },
))

const polygon = computed(() => Object.values(points.value || {})
  .filter(p => p.fill === "black").map(({x,y}) => `${x},${y}`).join(","))
</script>

<template>
  <div class="rhythm-circle">
    <svg viewBox="0 0 100 100" stroke="#000000">
      <circle cx="50" cy="50" :r="radius" fill="none" />
      <polygon :points="polygon" class="polygon" />
      <g v-for="(p, i) in points" :key="i">
        <circle
          :class="{ 'beat-dot': true, 'active': pulse === i }"
          :cx="p.x" :cy="p.y"
          :fill="p.fill"
          :r="size"
          @click="emit('toggle', p.i)"
        />
      </g> 
    </svg> 
  </div>
</template>
 
<style>
.polygon {
  fill: #ccc;
  stroke: #ccc;
}
.beat-dot:hover,
.beat-dot.active {
  stroke: red;
}
</style>
