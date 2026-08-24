import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { TempoSelect } from "../index.js"

const mountComponent = props => mount(TempoSelect, { props })
const inputs = wrapper => ({
  bpm: wrapper.findAll(".tempo-select-bpm")[0],
  pulse: wrapper.findAll(".tempo-select-pulse")[0],
  total: wrapper.findAll(".tempo-select-total")[0],
  buttons: wrapper.findAll("button"),
  emittedTempo: () => wrapper.emitted("update:tempo")?.slice(-1)?.[0][0],
})

describe("TempoSelect", () => {

  it("tempo", async () => {
    const wrapper = mountComponent({ tempo: 200 })
    const { bpm, pulse, total, buttons } = inputs(wrapper)
    expect(bpm).toBe(undefined)
    expect(total).toBe(undefined)
    expect(buttons).eql([])
    expect(pulse.element.value).toBe("200")
  })
 
  it("tempo: constraints", async () => {
    const wrapper = mountComponent({ tempo: 500, min: 100, max: 1000 })
    const { pulse, emittedTempo } = inputs(wrapper)

    await pulse.setValue("50")
    expect(emittedTempo()).toBeUndefined()

    await pulse.setValue("2000")
    expect(emittedTempo()).toBeUndefined()

    await pulse.setValue("  100\t")
    expect(emittedTempo()).toBe(100)

    // TODO: min/max changed from outside
  })


  it("tempo & division", async () => {
    const wrapper = mountComponent({ tempo: 500, division: 1 })
    const { bpm, pulse, total, buttons, emittedTempo } = inputs(wrapper)

    expect(bpm.element.value).toBe("120")
    expect(total).toBeUndefined()
    expect(buttons.length).toBe(0)

    await pulse.setValue("100")
    expect(emittedTempo()).toEqual(100)
    expect(bpm.element.value).toBe("600")

    await bpm.setValue("61")
    expect(emittedTempo()).toEqual(984)

    await wrapper.setProps({ tempo: 200 })
    expect(bpm.element.value).toBe("300")
    expect(pulse.element.value).toBe("200")
  })
  
  it("tempo & division & length", async () => {
    const wrapper = mountComponent({ tempo: 500, division: 1, length: 4 })
    const { pulse, total, buttons, emittedTempo } = inputs(wrapper)

    expect(pulse.element.value).toBe("500")
    expect(total.element.value).toBe("2.000")
    // TOOD: check beat
    //
    expect(buttons.length).toBe(2)

    await pulse.setValue("600")
    expect(emittedTempo()).toEqual(600)
    expect(total.element.value).toBe("2.400")

    await total.setValue("1.000")
    expect(emittedTempo()).toEqual(250)
  })

  it("toggles stable state when buttons clicked", async () => {
    const wrapper = mountComponent({ tempo: 250, length: 4 })
    const { buttons } = inputs(wrapper)

    // Initially rythm length is not stable
    expect(buttons[0].attributes("aria-pressed")).toBe("true")
    expect(buttons[1].attributes("aria-pressed")).toBe("false")
    // Click rhythm button
    await buttons[1].trigger("click")
    expect(buttons[0].attributes("aria-pressed")).toBe("false")
    expect(buttons[1].attributes("aria-pressed")).toBe("true")

    expect(wrapper.emitted("update:stable")[0]).toEqual([true])
  })
})
