<script setup>
import { computed } from "vue"
import RhythmLink from "./RhythmLink.vue"
import Rhythm from "../Rhythm.js"
import rhythms from "../../rhythms.json"
import InfoText from "./InfoText.vue"
const props = defineProps({ rhythm: { validator: r => r instanceof Rhythm } })

const beats = computed(() => props.rhythm.beats())
const length = computed(() => props.rhythm.length)
const euclidean = computed(() => beats.value ? Rhythm.euclidean(length.value, beats.value).toString() : undefined)
const pattern = computed(() => props.rhythm.toString())

const divisor = computed(() => props.rhythm.divisor())


// TODO: reduced

const rotated = computed(() => {
  const pp = pattern.value + pattern.value
  const len = pattern.value.length
  const rot = new Set()
  for (let i=1; i<len; i++) {
    const p = pp.substring(i, i+len)
    if (p !== pp) {
      //  console.log(p)
      rot.add(p)
    }
  }
  return rot
})

const knownRotated = computed(() => 
  new Set([...rotated.value].filter(p => rhythms[p])))

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
      <InfoText :markdown="info.text" />
    </div>
    <div v-if="euclidean">
      <p v-if="pattern == euclidean">
        The rhythm is <a href="https://en.wikipedia.org/wiki/Euclidean_rhythm">euclidean</a>.
      </p>
      <p v-else>
        The rhythm is not <a href="https://en.wikipedia.org/wiki/Euclidean_rhythm">euclidean</a>,
        this would be 
        <span v-if="rotated.has(euclidean)">rotated variant </span>
        <RhythmLink :pattern="euclidean" />.
      </p>
    </div>
    <div v-if="divisor > 1">
      The rhythm can be condensed to 
      <RhythmLink :pattern="(new Rhythm(pattern)).condense(divisor).toString()" />
      )
    </div>
    <div v-else>
      The rhythm is condense.
    </div>
    <div v-if="knownRotated.size">
      <h3>Rotated variants</h3>
      <ul>
        <li v-for="(rot,i) in knownRotated" :key="i">
          <RhythmLink :pattern="rot" />
          {{ rhythms[rot]?.name }}
        </li>
      </ul>
    </div>
    <div v-if="info?.works">
      <h3>Notable works</h3>
      <ul>
        <li v-for="(work,i) in info.works" :key="i">
          <InfoText :markdown="work" />
        </li>
      </ul>
    </div>
  </div>
</template>
