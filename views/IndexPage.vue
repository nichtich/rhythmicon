<script setup>
import rhythms from "../rhythms.json"
</script>

<template>
  <div>
    <p>
      This page allows to analyze and experiment with rhythmic patterns (aka rhythms).
      Here a rhythm is a repeated sequence of beats and rests.
    </p>
    <h2>Examples</h2>
    <table>
      <tr v-for="(rhythm, pattern) in rhythms" :key="pattern">
        <td style="text-align: right; font-size: 0.5em;color: #666;">
          {{ pattern.length }}
        </td>
        <td>
          <router-link :to="`/${pattern}`">
            <code>{{ pattern }}</code>
          </router-link>
        </td>
        <td>
          <span v-if="rhythm.name">{{ rhythm.name }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>
