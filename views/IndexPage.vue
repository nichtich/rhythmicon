<script setup>
import { ref } from "vue"
import rhythms from "../rhythms.json"
import Rhythm from "../src/Rhythm.js"
import RhythmLink from "../src/components/RhythmLink.vue"

const initialized = ref(false)
const euclideans = []

Object.entries(rhythms).forEach(([pattern,r]) =>{
  const rhythm = new Rhythm(pattern) 
  r.first = rhythm.first()

  // TODO: shift back
  r.divisor = rhythm.divisor()
  r.beats = rhythm.beats()
  r.repetitions = rhythm.repetitions()

  // TODO: euclidean?
})
initialized.value = true

</script>

<template>
  <div>
    <p>
      This page allows to analyze and experiment with rhythmic patterns (aka rhythms).
      Here a rhythm is a repeated sequence of beats and rests.
    </p>
    <h2>Examples</h2>
    <table>
      <thead>
        <tr>
          <th />
          <th>pattern</th>
          <th>name</th>
          <th>properties</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rhythm, pattern) in rhythms" :key="pattern">
          <td style="text-align:right; padding-right: 1em;">
            <small>{{ rhythm.beats }}/{{ pattern.length }}</small>
          </td>
          <td>
            <rhythm-link :pattern="pattern" />
          </td>
          <td>
            <span v-if="rhythm.name">{{ rhythm.name }}</span>
          </td>
          <td v-if="initialized">
            <ul class="inline">
              <li v-if="rhythm.divisor > 1">
                expanded ÷{{ rhythm.divisor }} 
              </li>
              <li v-if="rhythm.repetitions > 1">
                repeated ×{{ rhythm.repetitions }}
              </li>
              <li v-if="rhythm.first">
                shifted
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
th { text-align: left; }
ul.inline {
  display: inline;
  list-style: none;
  padding-left: 0;
}
ul.inline li {
  display: inline;
  font-size: 80%;
}
ul.inline li + li:before {
  content: ", ";
}
</style>
