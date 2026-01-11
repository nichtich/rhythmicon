import { h, ref, watch } from "vue"
import { createRouter, useRoute, createWebHistory } from "vue-router"
import Rhythm from "./Rhythm.js"

import RhythmPage from "./components/RhythmPage.vue"
import IndexPage from "../views/IndexPage.vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: "/",
    component: {
      setup() {
        const route = useRoute()

        const pattern = route.query?.pattern
        const hasPattern = () => /^[x-]+$/.test(pattern)
        const rhythm = ref( hasPattern() ? new Rhythm(pattern) : null )

        watch(() => rhythm.value ? rhythm.value.toString() : "", pattern => {
          router.push({ query: { pattern }})
        })

        watch(() => route.query?.pattern, pattern => {
          if (/^[x-]+$/.test(pattern)) {
            if (rhythm.value) {
              rhythm.value.replace(pattern)
            } else {
              rhythm.value = new Rhythm(pattern)
            }
          } else {
            rhythm.value = null
          }
        })

        return () => rhythm.value ? h(RhythmPage, { rhythm }) : h(IndexPage)
      },
    },
  }],
})
