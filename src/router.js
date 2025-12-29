import { createRouter, createWebHistory } from "vue-router"
import RhythmPage from "./components/RhythmPage.vue"
import IndexPage from "../views/IndexPage.vue"

import { h } from "vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: "/",
    component: {
      render() {
        const pattern = this.$route?.query?.pattern
        if (/^[x-][x-]+$/.test(pattern)) {
          return h(RhythmPage, { pattern })
        }
        return h(IndexPage)
      },
    },
  }],
})
