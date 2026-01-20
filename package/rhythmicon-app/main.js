import { createApp, ref, shallowRef } from "vue"
import { createRouter, createWebHistory } from "vue-router"

import Rhythm from "rhythmicon-rhythm"
import { yamlHeaderMarkdown } from "./lib/utils.js"
import App from "./App.vue"

function enrichRhythm([pattern, r]) {
  const rhythm = new Rhythm(pattern)
  if (!("first" in r)) {
    r.first = rhythm.first()
  }

  r.length = rhythm.length
  r.beats = rhythm.beats()
  r.durations = rhythm.durations()
  r.divisor = rhythm.divisor()
  r.repetitions = rhythm.repetitions()

  r.condense = r.divisor === 1 && r.repetitions === 1
  r.category = new Set(r.category || [])

  r.core = rhythm.normalize()
  if (pattern == r.core.toString() ) {
    r.category.add("core")
  }

  r.euclidean = Rhythm.euclidean(r.beats, r.length).equals(rhythm)
  if (r.euclidean) {
    r.category.add("euclidean")
  }
}

const ucfirst =  s => s[0].toUpperCase() + s.slice(1)

const categories = ref({})

const store = {
  index: document.querySelector("#app main").innerHTML, // TODO: replace <a href="?...">...</a> with <RouterLink>
  rhythms: shallowRef({}),
  categories,
  getCategory(id) {
    if (!categories[id]) {
      const name = ucfirst(id)
      categories[id] = ref({ name })
      fetch(`./${id}.md`)
        .then(res => res.ok ? res.text() : "")
        .then(text => Object.assign(categories[id].value, yamlHeaderMarkdown(text)))
    }
    return categories[id]
  },
}

fetch("rhythms.json")
  .then(res => res.json())
  .then(res => {
    Object.entries(res).forEach(enrichRhythm)
    store.rhythms.value = res
  })

const path = window.location.pathname
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path, component: App }],
})

createApp({ template: "<router-view></router-view>" })
  .provide("store", store)
  .use(router)
  .mount("#app")
