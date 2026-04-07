import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { RhythmScore } from "../index.js"

describe("RhythmScore", () => {
  it("renders correctly with given rhythm", () => {
    const rhythm = [1, 0, 1, 0]
    const wrapper = mount(RhythmScore, {
      props: {
        rhythm,
        pulse: 0,
      },
    })

    expect(wrapper.find(".stave").exists()).toBe(true)

    const notes = wrapper.findAll(".note")
    const rests = wrapper.findAll(".rest")
    expect(notes.length + rests.length).toBeGreaterThan(1)
  })

  it("renders time signature", () => {
    const rhythm = [1, 0, 1, 0]
    const wrapper = mount(RhythmScore, { props: { rhythm } })

    const timeSigNum = wrapper.find(".time-sig-num")
    const timeSigDen = wrapper.find(".time-sig-den")
    expect(timeSigNum.exists()).toBe(true)
    expect(timeSigDen.exists()).toBe(true)
  })
})
