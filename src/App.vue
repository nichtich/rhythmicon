<script setup>
import { ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"

import Rhythm from "../src/Rhythm.js"
import RhythmTextInput from "../packages/rhythmicon-vue/components/RhythmTextInput.vue"
import RhythmPage from "./components/RhythmPage.vue"
import IndexPage from "../views/IndexPage.vue"
      
const route = useRoute()
const router = useRouter()

const pattern = route.query?.pattern
const hasPattern = () => /^[x-]+$/.test(pattern)
const rhythm = ref( new Rhythm(hasPattern() ? pattern : []) )

watch(() => rhythm.value ? rhythm.value.toString() : "", pattern => {
  router.push({ query: { pattern }})
})

watch(() => route.query?.pattern, pattern => {
  if (!/^[x-]+$/.test(pattern)) {
    pattern = ""
  }
  if (rhythm.value) {
    rhythm.value.replace(pattern)
  } else {
    rhythm.value = new Rhythm(pattern)
  }
})
</script>

<template>
  <div>
    <header>
      <h1>
        <router-link id="title" to="/">
          𝄥 <span>rhythmicon</span> 𝄇
        </router-link>
        <RhythmTextInput v-model="rhythm" />
      </h1>
    </header>
    <main>
      <RhythmPage v-if="rhythm?.length" v-model="rhythm" />
      <IndexPage v-else />
    </main>
  </div>
</template>

<style>
h1 {
  display: flex; 
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
