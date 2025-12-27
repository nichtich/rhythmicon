<script setup>
import { ref, watch, computed } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { Rhythm } from '../../index.js'
import RhythmButtons from './RhythmButtons.vue'

const props = defineProps({ pattern: String }) // from route
const rhythm = ref(new Rhythm(props.pattern))
const beats = computed(() => rhythm.value.beats())
const length = computed(() => rhythm.value.length)
const euclidean = computed(() => Rhythm.euclidean(length.value, beats.value).toString())
const pattern = computed(() => rhythm.value.toString())
const even = computed(() => length.value % 2 === 0)
const redundant = computed(() => {
    if (!even.value) return false
    // TODO: it could be 2,3,5,7... of the same
    return pattern.value.slice(0, length.value / 2) === pattern.value.slice(length.value / 2)
})

const router = useRouter()
const route = useRoute()

watch(
  () => route.params.pattern,
  pattern => { rhythm.value.replace(pattern) }
)

watch(rhythm, value => {
  router.push({name: "pattern", params: { pattern: value.toString() }})
}, {deep: true})

function duplicate() {
  rhythm.value.push(...rhythm.value)
}
function halve() {
  rhythm.value.splice(rhythm.value.length / 2, rhythm.value.length / 2)
}
function rotateLeft() { rhythm.value.rotate(-1) }
function rotateRight() { rhythm.value.rotate(1) }
function inverse() { rhythm.value.replace(...rhythm.value.map(x => x ? 0 : 1)) }

function append() { rhythm.value.push(0) }
function pop() { rhythm.value.pop() }
</script>

<template>
  <div>
    <div>
      <button class="action" @click="rotateLeft">&lt;</button>
      <RhythmButtons v-model="rhythm"/>
      <button class="action" @click="append">+</button>
      <button class="action" @click="pop">-</button>
      <button class="action" @click="rotateRight">&gt;</button>
      <button class="action" @click="duplicate">×2</button>
      <button class="action" @click="halve" v-if="rhythm && even">÷2</button>
      <button class="action" @click="inverse">⇅</button>
    </div>
    <p>
      <code>{{ pattern }}</code> is a rhythm with 
      {{ beats }} beats in {{ rhythm.length }} steps.
    </p>
    <p v-if="pattern == euclidean">
      The rhythm is <a href="https://en.wikipedia.org/wiki/Euclidean_rhythm">euclidean</a>.
    </p>
    <p v-else>
      The rhythm is not <a href="https://en.wikipedia.org/wiki/Euclidean_rhythm">euclidean</a>,
      this would be <router-link :to="'/'+euclidean">{{ euclidean }}</router-link>.
    </p>
    <p v-if="redundant">
       The rhythm is redundant, it can be cut into halves: <button @click="halve">÷2</button>
    </p>
    <p v-else>
      The rhythm is not redundant.  
    </p>

    <p>{{ rhythm }}</p>
    <!-- TODO: equivalent rhythms (when shifted) -->
  </div>
</template>

<style>
button.action {
  padding: 2px;
}
</style>
