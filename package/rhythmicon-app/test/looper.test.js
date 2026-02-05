import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import Looper from "../components/Looper.js"

class MockAudioContext {
  constructor() {
    this.currentTime = 0
    this.state = "running"
    this.destination = {}

    this._gainNode = {
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    }

    this._oscillator = {
      type: "sine",
      frequency: { value: 440 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }

    this._bufferSource = {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
    }
  }

  createGain() {
    return this._gainNode
  }

  createOscillator() {
    return this._oscillator
  }

  createBufferSource() {
    return this._bufferSource
  }

  decodeAudioData() {
    return Promise.resolve({})
  }

  resume() {
    this._resumeCalled = true
    return Promise.resolve()
  }
}

describe("Looper", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    global.AudioContext = MockAudioContext
    global.fetch = vi.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      }),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe("constructor", () => {
    it("default values", () => {
      const looper = new Looper()

      expect(looper.rhythm).toStrictEqual([])
      expect(looper.running).toBe(false)
      expect(looper.sample).toBe(null)
      expect(looper.frequency).toBe(880)
      expect(looper.audio).toBeInstanceOf(MockAudioContext)
    })

    it("initializes with custom values", () => {
      const rhythm = [1,0,0,1]
      const volume = 0.5
      const tempo = 500
      const frequency = 900
      const looper = new Looper({ rhythm, tempo, volume, frequency })

      expect(looper.rhythm).toStrictEqual(rhythm)
      expect(looper.volume).toBe(volume)
      expect(looper.tempo).toBe(tempo)
      expect(looper.frequency).toBe(frequency)
      expect(looper.running).toBe(false)
    })
  })

  it("tempo", () => {
    const looper = new Looper()
    expect(looper.tempo).toBe(250)

    looper.tempo = "?"
    expect(looper.tempo).toBe(250)

    looper.tempo = 1000
    expect(looper.tempo).toBe(1000)
  })

  it("volume", () => {
    const looper = new Looper()
    expect(looper.volume).toBe(1)

    looper.volume = 0.3
    expect(looper.volume).toBe(0.3)
  })
  /*
 describe("sample", () => {
const sample = new ArrayBuffer(8)
      expect(looper.sample).toEqual(sample)

    it("updates sample property", () => {
      const looper = new Looper({ sample: "initial.wav" })
      expect(global.fetch).toHaveBeenCalledWith("initial.wav")
      process.nextTick()
    
      //ew Promise((resolve) => setTimeout(resolve, ms));

      console.log("A")
      expect(looper.sample).toBe("initial.wav")

      looper.sample = "new-sample.wav"
      expect(global.fetch).toHaveBeenCalledWith("new-sample.wav")
      expect(looper.sample).toBe("new-sample.wav")
    })

    it("does not load sample when URL is empty", () => {
      const looper = new Looper()
      expect(looper.sample).toBe(null)

      looper.sample = ""
      expect(global.fetch).not.toHaveBeenCalled()
      expect(looper.sample).toBe(null)
    })
  })
  */

  it("rhythm", () => {
    const looper = new Looper()
    
    const rhythm = [1,0,0,1]
    looper.rhythm = rhythm
    expect(looper.rhythm).toStrictEqual(rhythm)

    rhythm.push(42)
    expect(looper.rhythm).toStrictEqual([1,0,0,1])

    looper.rhythm = null
    expect(looper.rhythm).toStrictEqual([])
  })

  describe("play", () => {
    it("starts the looper", () => {
      const looper = new Looper({ rhythm: [0,1] })
      looper.play()
      expect(looper.running).toBe(true)
    })

    it("resumes suspended AudioContext", () => {
      const looper = new Looper({ rhythm: [1,0] })
      looper.audio.state = "suspended"
      looper._running = false // reset so play() can run
      looper.play()
      expect(looper.audio._resumeCalled).toBe(true)
    })

    it("clamps current index within rhythm length", () => {
      const looper = new Looper({ rhythm: [1,0,1] })
      looper._currentIndex = 10 // TODO: set via method

      looper.play()

      // After play(), index is clamped 10 % 3 = 1, then scheduler may advance it
      expect(looper._currentIndex).toBeLessThan(looper.rhythm.length)
    })
  })

  it("restart", () => {
    const looper = new Looper({ rhythm: [true, false, true] })
    expect(looper.running).toBe(false)

    looper._currentIndex = 2
    looper.restart()

    // Index is reset to 0, then scheduler may advance it
    expect(looper._currentIndex).toBeLessThan(looper.rhythm.length)
    expect(looper.running).toBe(true)
  })
})
