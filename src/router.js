import { createRouter, createWebHistory } from "vue-router"
import RhythmPage from "./components/RhythmPage.vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [{
    name: "pattern",
    path: "/:pattern([x-]+)",
    component: RhythmPage,
    props: true,
  }],
})
