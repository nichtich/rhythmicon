import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { RhythmSequencer } from "../index.js"

const mountComponent = props => mount(RhythmSequencer, { props })

describe("RhythmSequencer", () => {
  const comp = mountComponent({ rhythm: [1, 0, 1, 0] })

  it("renders", () => {
    expect(comp.find("ul").exists()).toBe(true)
    expect(comp.findAll("li").length).toBe(4)
  })

  it("emits toggle", async () => {
    await comp.findAll("li button")[2].trigger("click")
    expect(comp.emitted()).toHaveProperty("toggle")
    expect(comp.emitted("toggle")[0]).toEqual([2])
  })
})
