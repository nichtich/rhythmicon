export default class Looper {
  constructor({
    rhythmRef,
    pulse,
    pulseMs = 250,
    sampleUrl = "",
    volume = 0.8,
    running,
  } = {}) {
    this.rhythmRef = rhythmRef
    this.running = running // ref
    this.pulse = pulse || { value: null } // ref

    this.setTempo(pulseMs)
    this.sampleUrl = sampleUrl
    this.volume = volume

    // TODO: which values make sense?
    this.lookahead = 25
    this.scheduleAheadTime = 0.1

    this.audio = null
    this.gain = null
    this.sample = null

    this._schedulerTimer = null
    this._nextNoteTime = 0 // audio time for next note
    this._currentIndex = 0 // index to schedule next
    this._pendingPlayingTimeouts = [] // timeouts used to set pulse at the correct moment

    if (this.running.value) {
      this.play(true)
    }
  }

  // helper to read current pattern array (supports ref or plain array)
  _getPattern() {
    const r = this.rhythmRef
    if (!r) {
      return []
    }
    // Vue ref has .value and array inside
    if (typeof r === "object" && "value" in r) {
      return Array.isArray(r.value) ? r.value : []
    }
    // plain array/reactive
    return Array.isArray(r) ? r : []
  }

  ensureAudio() {
    if (!this.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.audio = new AudioContext()
        this.gain = this.audio.createGain()
        this.gain.gain.value = this.volume
        this.gain.connect(this.audio.destination)
        if (this.sampleUrl) {
          this.loadSample(this.sampleUrl).catch(() => {})
        }
      }
    }
    return this.audio
  }

  async loadSample(url) {
    this.ensureAudio()
    const resp = await fetch(url)
    this.sample = await this.audio.decodeAudioData(await resp.arrayBuffer())
  }

  // schedule one note (idx) at audio time 'time'
  _scheduleNote(idx, time) {
    const pattern = this._getPattern()
    if (!pattern || pattern.length === 0) {
      return
    }

    const delayMs = Math.max(0, (time - (this.audio ? this.audio.currentTime : Date.now() / 1000)) * 1000)
    const t = setTimeout(() => {
      this.pulse.value = idx
    }, delayMs)
    this._pendingPlayingTimeouts.push(t)

    if (pattern[idx] && this.ensureAudio()) { // beat
      if (this.sample) {
        const src = this.audio.createBufferSource()
        src.buffer = this.sample
        src.connect(this.gain)
        src.start(time)
      } else {
        const osc = this.audio.createOscillator()
        const g = this.audio.createGain()
        osc.type = "square"
        osc.frequency.value = 1000
        // per-note gain envelope
        g.gain.setValueAtTime(this.volume, time)
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.03)
        osc.connect(g)
        g.connect(this.gain)
        osc.start(time)
        osc.stop(time + 0.04)
      }
    }
  }

  // main scheduler invoked periodically (lookahead)
  _scheduler() {
    if (!this.audio) {
      return
    }
    // schedule notes while nextNoteTime is within scheduleAheadTime
    while (this._nextNoteTime < this.audio.currentTime + this.scheduleAheadTime) {
      const pattern = this._getPattern()
      const length = (pattern && pattern.length) || 0
      if (length === 0) {
        // nothing to schedule; advance time and index conservatively
        this._nextNoteTime += this.secondsPerStep
        this._currentIndex = 0
        this.pulse.value = undefined
        continue
      }

      const idx = this._currentIndex % length
      this._scheduleNote(idx, this._nextNoteTime)

      this._nextNoteTime += this.secondsPerStep
      this._currentIndex = (this._currentIndex + 1) % length
    }
  }

  restart() {
    if (this.running.value) {
      this.pause()  
    }
    this._currentIndex = 0
    this.play()
  }

  play(force=false) {
    // TODO: play without audio?
    if (!this.ensureAudio() || this.running.value && !force) {
      return
    }
    this.running.value = true
    if (this.audio.state === "suspended") {
      this.audio.resume().catch(() => {})
    }
    this._nextNoteTime = this.audio.currentTime + 0.05
    // keep current index (do not reset) so pause/resume continues where left off
    // but ensure index is inside pattern range
    const pattern = this._getPattern()
    if (pattern.length === 0) {
      this._currentIndex = 0
    } else {
      this._currentIndex = this._currentIndex % Math.max(1, pattern.length)
    }

    // start lookahead scheduler
    this._scheduler()
    this._schedulerTimer = setInterval(() => this._scheduler(), this.lookahead)
  }

  pause() {
    if (this.running.value) {
      this.running.value = false
      if (this._schedulerTimer) {
        clearInterval(this._schedulerTimer)
        this._schedulerTimer = null
      }
      // clear pending timeouts that set pulse
      this._pendingPlayingTimeouts.forEach(t => clearTimeout(t))
      this._pendingPlayingTimeouts = []
      this.pulse.value = undefined
    }
  }

  setTempo(ms) {
    this.secondsPerStep = ms / 1000
  }

  setVolume(v) {
    this.volume = v
    if (this.gain) {
      this.gain.gain.value = v
    }
  }

  setSampleUrl(url) {
    this.sampleUrl = url
    if (url) {
      this.loadSample(url).catch(() => {})
    }
  }
}
