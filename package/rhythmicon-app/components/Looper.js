export default class Looper {
  lookahead = 25 // ms
  scheduleAhead = 0.1 // s

  constructor({ rhythm, tempo, volume, frequency, each } = {}) {
    // internal states
    this._running = false
    this._sample = null
    this._schedulerTimer = null
    this._gain = null
    this._nextNoteTime = 0 // audio time for next note
    this._currentIndex = 0 // index to schedule next
    this._pendingPlayingTimeouts = [] // timeouts used to set pulse at the correct moment
    this._frequency = 880

    // default values
    this._volume = 1.0
    this._secondsPerStep = 0.25
    this._rhythm = []
    this._pulse = 0

    // passed values (ignored if not set)
    this.rhythm = rhythm
    this.tempo = tempo
    this.volume = volume
    this.frequency = frequency
    this.each = each
  }

  get volume() {
    return this._volume
  }

  set volume(v) {
    if (v >= 0 && v <= 1) {
      this._volume = v
      if (this._gain) {
        this._gain.gain.value = v
      }
    }
  }

  get tempo() {
    return this._secondsPerStep * 1000
  }

  set tempo(ms) {
    if (ms > 0) {
      this._secondsPerStep = ms / 1000
    }
  }

  get frequency() {
    return this._frequency
  }

  set frequency(hz) {
    if (hz >= 20 && hz <= 20000) {
      this._frequency = hz
    }
  }

  get running() {
    return this._running
  }

  get audio() {
    if (!this._audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this._audio = new AudioContext()
        this._gain = this._audio.createGain()
        this._gain.gain.value = this._volume
        this._gain.connect(this._audio.destination)
      }
    }
    return this._audio
  }

  get pulse() {
    return this._pulse
  }

  _setPulse(p) {
    this._pulse = p // TODO: required?
    if (this.each) {
      this.each(p, this._rhythm[p])
    }
  }

  _scheduleNote(idx, time) {
    if (!this._rhythm.length === 0) {
      return
    }

    const delayMs = Math.max(0, (time - (this._audio ? this._audio.currentTime : Date.now() / 1000)) * 1000)
    const t = setTimeout(() => {
      this._setPulse(idx) 
    }, delayMs)
    this._pendingPlayingTimeouts.push(t)

    if (this._rhythm[idx] && this.audio) { // beat
      if (this._sample) {
        const src = this._audio.createBufferSource()
        src.buffer = this._sample
        src.connect(this._gain)
        src.start(time)
      } else {
        const osc = this._audio.createOscillator()
        const g = this._audio.createGain()
        osc.type = "triangle" // "sine", "square", "sawtooth", "triangle", "custom"
        osc.frequency.value = this.frequency
        g.gain.setValueAtTime(this._volume, time)
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.03)
        osc.connect(g)
        g.connect(this._gain)
        osc.start(time)
        osc.stop(time + 0.04)
      }
    }
  }

  // main scheduler invoked periodically (lookahead)
  _scheduler() {
    if (!this._audio) {
      return
    }
    // schedule notes while nextNoteTime is within scheduleAhead
    while (this._nextNoteTime < this._audio.currentTime + this.scheduleAhead) {
      const length = this._rhythm.length
      if (length === 0) {
        // nothing to schedule; advance time and index conservatively
        this._nextNoteTime += this._secondsPerStep
        this._currentIndex = 0
        this._setPulse(0)
        continue
      }

      const idx = this._currentIndex % length
      this._scheduleNote(idx, this._nextNoteTime)

      this._nextNoteTime += this._secondsPerStep
      this._currentIndex = (this._currentIndex + 1) % length
    }
  }

  get sample() {
    return this._sample
  }

  async setSample(buffer) {
    if (buffer) {
      buffer = await this.audio?.decodeAudioData(buffer)
    }
    this._sample = buffer
  }

  async loadSample(url) {
    return url
      ? fetch(url).then(res => res.arrayBuffer()).then(buffer => this.setSample(buffer))
      : this.setSample()
  }

  get rhythm() {
    return this._rhythm.map(p => p ? 1 : 0)
  }

  set rhythm(rhythm) {
    this._rhythm = rhythm?.map(p => p ? 1 : 0) || []
    if (this._pulse >= this._rhythm.length) {
      // TODO: test this
      this._setPulse(this._pulse % this._rhythm.length)
    }
  }

  play() {
    if (!this.audio || this._running) {
      return
    }
    this._running = true
    if (this.audio.state === "suspended") {
      this.audio.resume().catch(() => {})
    }
    this._nextNoteTime = this.audio.currentTime + 0.05 // TODO: why 0.05?
    // keep current index (do not reset) so pause/resume continues where left off
    if (this._rhythm.length === 0) {
      this._currentIndex = 0
    } else {
      this._currentIndex = this._currentIndex % Math.max(1, this._rhythm.length)
    }

    // start lookahead scheduler
    this._scheduler()
    this._schedulerTimer = setInterval(() => this._scheduler(), Looper.lookahead)
  }

  pause() {
    if (this._running) {
      this._running = false
      if (this._schedulerTimer) {
        clearInterval(this._schedulerTimer)
        this._schedulerTimer = null
      }
      this._pendingPlayingTimeouts.forEach(t => clearTimeout(t))
      this._pendingPlayingTimeouts = []
    }
  }

  restart() {
    if (this._running) {
      this.pause()  
    }
    this._currentIndex = 0
    this.play()
  }
}
