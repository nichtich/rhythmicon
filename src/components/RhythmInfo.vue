<script setup>
import { computed } from "vue"
import Rhythm from "../Rhythm.js"
import rhythms from "../../rhythms.json"

const props = defineProps({ rhythm: { validator: r => r instanceof Rhythm } })

const beats = computed(() => props.rhythm.beats())
const length = computed(() => props.rhythm.length)
const euclidean = computed(() => Rhythm.euclidean(length.value, beats.value).toString())
const pattern = computed(() => props.rhythm.toString())
const even = computed(() => length.value % 2 === 0)
const redundant = computed(() => {
  // TODO: it could be 2,3,5,7... of the same. Get primes of length instead!
  if (!even.value) {
    return false
  }
  return pattern.value.slice(0, length.value / 2) === pattern.value.slice(length.value / 2)
})

const info = computed(() => rhythms[pattern.value])
</script>

<template>
  <div class="rhythm-info">
    <div v-if="info">
      <h2 v-if="info.name">
        {{ info.name }}
        <span v-if="info.alias?.length">(<span v-for="(alias, i) in info.alias" :key="i">
          <span>{{ alias }}</span>
          <span v-if="i+1 < info.alias.length"> / </span>
        </span>)</span>
        <span v-if="info.wikidata">
          : <a :href="`https://www.wikidata.org/wiki/${info.wikidata}`">{{ info.wikidata }}</a>
        </span>
      </h2>
      <p v-if="info.text">
        {{ info.text }}
      </p>
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
      this would be <router-link :to="'/'+euclidean">
        {{ euclidean }}
      </router-link>.
    </p>
    <p v-if="redundant">
      The rhythm is redundant because the same pattern is repeated.
    </p>
    <!--p v-else>
      The rhythm is not redundant.  
    </p-->
    <!-- TODO: equivalent rhythms (when shifted) -->
  </div>
</template>
