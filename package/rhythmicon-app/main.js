import { createApp, shallowRef } from "vue"
import { createRouter, createWebHistory } from "vue-router"

import Rhythm from "rhythmicon-rhythm"
import App from "./App.vue"

const enrich = {
  rhythms([pattern, r]) {
    const rhythm = new Rhythm(pattern)
    if (!("first" in r)) {
      r.first = rhythm.first()
    }

    r.length = rhythm.length
    r.divisor = rhythm.divisor()
    r.beats = rhythm.beats()
    r.repetitions = rhythm.repetitions()
    r.condense = r.divisor === 1 && r.repetitions === 1

    r.category = new Set(r.category || [])
    r.core = rhythm.core()
    if (r.core) {
      r.category.add("core")
    }

    r.euclidean = Rhythm.euclidean(r.beats, r.length).equal(rhythm)
    if (r.euclidean) {
      r.category.add("euclidean")
    }

    r.durations = rhythm.durations()
  },
  categories() {

  },
}

const store = {
  index: document.querySelector("#app main").innerHTML,
  rhythms: shallowRef({}),
  categories: shallowRef({}),
}

for (let what of ["rhythms","categories"]) {
  fetch(`${what}.json`)
    .then(res => res.json())
    .then(res => {
      Object.entries(res).forEach(enrich[what])
      store[what].value = res
    })
}

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: App }],
})

createApp({ template: "<router-view></router-view>" })
  .provide("store", store)
  .use(router)
  .mount("#app")

