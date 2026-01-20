<script setup>
import { ref, watch, inject, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"

import Rhythm from "rhythmicon-rhythm"
import { RhythmInput } from "rhythmicon-vue"
import RhythmPage from "./components/RhythmPage.vue"
import IndexPage from "./components/IndexPage.vue"
import MarkdownPage from "./components/MarkdownPage.vue"

const route = useRoute()
const router = useRouter()
const store = inject("store")

const validPattern = p => /^[x-]+$/.test(p)

const pattern = route.query?.pattern
const rhythm = ref( new Rhythm(validPattern(pattern) ? pattern : []) )
const page = ref("")
const search = ref(null)

// rhythm changed via app
watch(() => rhythm.value ? rhythm.value.toString() : "", p => {
  router.push({ query: validPattern(p) ? { pattern: p } : normalizeQuery(route.query) })
})

function normalizeQuery (query) {
  let { pattern, page, category } = {...query}
  if (!validPattern(pattern)) {
    pattern = ""
  }
  if (page) {
    return { page }
  } else if (category) {
    return { category }
  } else if (pattern) {
    return { pattern }    
  } else  {
    return { }
  }
}

function routing (route) {
  const query = normalizeQuery(route.query)  
  page.value = query.page ?? ""
  rhythm.value.replace(query.pattern ?? []) 
  search.value = query.category ? { category: query.category } : null
}

watch(route, routing)
onBeforeMount(() => routing(route))
</script>

<template>
  <div>
    <header>
      <h1>
        <router-link id="title" to="./">
          rhythmicon
        </router-link> 𝄇
      </h1>        
      <router-link id="title" to="?category=all">
        rhythms
      </router-link>
      <RhythmInput v-model="rhythm" />
    </header>
    <main>
      <MarkdownPage v-if="page" :page="page" />
      <RhythmPage v-else-if="rhythm.length" v-model="rhythm" />
      <IndexPage v-else-if="search" :search="search" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-else v-html="store.index" />
    </main>
  </div>
</template>
