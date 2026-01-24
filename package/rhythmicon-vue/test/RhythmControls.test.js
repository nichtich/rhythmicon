import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { RhythmControls } from "../index.js"
import Rhythm from "rhythmicon-rhythm"

const mountComponent = rhythm => mount(RhythmControls, {
  props: { modelValue: rhythm },
})

describe("RhythmControls", () => {

  it("renders", () => {
    const comp = mountComponent(new Rhythm("x-x-"))
    expect(comp.find(".rhythm-editor").exists()).toBe(true)
    expect(comp.findAll("button").length).toBe(15)
  })

  const tests = [
    { rhythm: "x-xx", click: "rotate one pulse right", expected: "xx-x" },
    { rhythm: "--x-", click: "rotate one beat left", expected: "x---" },
    { rhythm: "xx--", click: "rotate one beat right", expected: "x--x" },
  ]

  tests.forEach(test => {
    it(test.click, async () => {
      const rhythm = new Rhythm(test.rhythm)
      const comp = mountComponent(rhythm)
      await comp.find(`button[title='${test.click}']`).trigger("click")
      expect(rhythm.toString()).toBe(test.expected)
    })
  })

})