<script setup>
import { computed } from "vue"

const emit = defineEmits(["toggle"])
const props = defineProps({ modelValue: Array, step: Number })
const length = computed(() => props.modelValue.length)

const size = computed(() => {
  if (props.modelValue.length > 32) {
    return 2
  }
  if (props.modelValue.length > 24) {
    return 3
  }
  return 4
})

const radius = computed(() => 50 - size.value - 1)

const points = computed(() => props.modelValue.map(
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
</script>

<template>
  <svg viewBox="0 0 100 100" stroke="#000000">
    <circle cx="50" cy="50" :r="radius" fill="none" />
    <g v-for="(p, i) in points" :key="i">
      <circle
        :class="{ 'beat-dot': true, 'active': step === i }"
        :cx="p.x" :cy="p.y"
        :fill="p.fill"
        :r="size"
        @click="emit('toggle', p.i)"
      />
    </g> 
  </svg> 
</template>
 
<style>
.beat-dot:hover,
.beat-dot.active {
  stroke: red;
}
</style>
