<script setup>
import { inject, computed } from "vue"
import { useRouter } from "vue-router"
import RhythmTable from "./RhythmTable.vue"
import MarkdownText from "./MarkdownText.vue"

const store = inject("store")
const router = useRouter()

const props = defineProps({ search: { type: Object } })

const categories = computed(() => 
  new Set(props.search.category.split(",").filter(c => c && c !== "all")))

const currentCategory = computed(() => {
  if (categories.value.size == 1) {
    const [cat] = categories.value.values()
    return store.categories.value[cat]
  }
  return null
})

const filteredRhythms = computed(() => {
  if (categories.value.size) {
    const filtered = {}
    for (const [pattern, rhythm] of Object.entries(store.rhythms.value)) {
      if (categories.value.isSubsetOf(rhythm.category)) {
        filtered[pattern] = rhythm
      }
    }
    return filtered
  }
  return store.rhythms.value
})

function removeCategory(name) {
  const remaining = [...categories.value].filter(c => c !== name)
  const category = remaining.length > 0 ? remaining.join(",") : "all"
  router.push({ query: { category } })
}

const ucfirst =  s => s[0].toUpperCase() + s.slice(1)

function selectCategory(category) {
  router.push({ query: { category: [...categories.value, category].join(",") } })
}
</script>

<template>
  <div>
    <h2>
      <span v-if="categories.size">
        <a
          v-for="category of categories"
          :key="category"
          :title="`Click to remove ${category} filter`"
          @click="removeCategory(category)"
          style="padding-right: 0.5em"
        >
          {{ store.categories[category] || ucfirst(category) }}
        </a>
      </span>
      Rhythms
    </h2>
    <MarkdownText v-if="currentCategory?.text" :markdown="currentCategory?.text" />
    <RhythmTable :rhythms="filteredRhythms" :categories="categories" @select-category="selectCategory" />
  </div>
</template>

<style>
h2 a:hover {
  color: #ccc;
}
</style>

