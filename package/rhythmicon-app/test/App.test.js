import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { createRouter, createMemoryHistory } from "vue-router"
import App from "../App.vue"

import samples from "../public/samples.json"

global.fetch = vi.fn((url) => {
  if (url === "./samples.json") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(samples),
    })
  }
  return Promise.reject(new Error(`Unmocked fetch: ${url}`))
})

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: App }],
  })
}

const mountApp = async (query = {}) => {
  const router = createTestRouter()
  await router.push({ path: "/", query })

  const store = {
    index: "<h1>Welcome to Rhythmicon</h1><p>Index content</p>",
    rhythms: {
      value: {
        "x-xx": {
          name: "Cumbia",
          pattern: "x-xx",
          text: "Prominent in Latin American music",
          beats: 3,
          length: 4,
          divisor: 4,
          repetitions: 1,
          euclidean: false,
          first: 0,
        },
      },
    },
  }

  const wrapper = mount(App, {
    global: {
      plugins: [router],
      provide: { store },
      stubs: {
        RhythmInput: true,
        RhythmPage: true,
        IndexPage: true,
        MarkdownPage: true,
      },
    },
  })

  await flushPromises()
  return wrapper
}

describe("App.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("displays index page when no query parameters", async () => {
    const wrapper = await mountApp()

    expect(wrapper.html()).toContain("Welcome to Rhythmicon")
  })

  it("displays MarkdownPage when page query parameter is present", async () => {
    const wrapper = await mountApp({ page: "related-works" })

    const markdownPage = wrapper.findComponent({ name: "MarkdownPage" })
    expect(markdownPage.exists()).toBe(true)
    expect(markdownPage.props("page")).toBe("related-works")
  })

  it("displays RhythmPage for valid pattern query parameter", async () => {
    const wrapper = await mountApp({ pattern: "x-xx" })

    const rhythmPage = wrapper.findComponent({ name: "RhythmPage" })
    expect(rhythmPage.exists()).toBe(true)
  })

  it("displays IndexPage for category=all query parameter", async () => {
    const wrapper = await mountApp({ category: "all" })
    const indexPage = wrapper.findComponent({ name: "IndexPage" })
    expect(indexPage.exists()).toBe(true)
    expect(indexPage.props("search")).toEqual({ category: "all" })
  })

  it("renders header with title and rhythm input", async () => {
    const wrapper = await mountApp()
    expect(wrapper.findComponent({ name: "RhythmInput" }).exists()).toBe(true)
  })

  it("ignores invalid pattern query parameter", async () => {
    const wrapper = await mountApp({ pattern: "invalid123" })
    expect(wrapper.html()).toContain("Welcome to Rhythmicon")
  })

  it("normalizes query parameters correctly", async () => {
    const wrapper = await mountApp({ pattern: "x-xx", category: "all", page: "test" })

    const markdownPage = wrapper.findComponent({ name: "MarkdownPage" })
    expect(markdownPage.exists()).toBe(true)
  })
})
