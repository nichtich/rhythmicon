import { createRouter, createWebHistory } from "vue-router"
import RhythmPage from "./components/RhythmPage.vue"
import IndexPage from "../views/IndexPage.vue"

export const router = createRouter({
  history: createWebHistory(),
  routes: [{
    name: "index",
    path: "/",
    component: IndexPage,
    props: true,
  },{
    name: "pattern",
    path: "/:pattern([x-][x-]+)",
    component: RhythmPage,
    props: true,

  }],
})
