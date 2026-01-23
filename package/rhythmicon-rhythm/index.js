class Rhythm extends Array {

  /**
   * Return whether a variable is read as beat. This is true for every true
   * value except for the characters space, underscore, dot and minus.
   * @param {any} value
   */
  static isBeat(x) {
    return x && !(typeof x === "string" && x.match(/^[ _.-]/))
  }

  /**
   * Return whether a string specifies durations with optional rotation.
   * @param {string} str
   */
  static isDurationsString(s) {
    return s.match(/^([+-]*)([1-9][0-9]*([+-][1-9][0-9]*)*)$/)
  }

  /**
   * Read a string, an array, or a list of values as rhythm.
   * @param {...string|array} rhythm
   * @returns {array}
   */
  static parse(...beats) {
    if (beats.length === 1) {
      if (Array.isArray(beats[0])) {
        return beats[0]
      } else if (typeof beats[0] === "string") {
        return Rhythm.fromPattern(beats[0])
      }
    }
    return beats.map(x => Rhythm.isBeat(x) ? 1 : 0)
  }

  constructor(...beats) {
    if (beats.length === 1 && typeof beats[0] === "number") {
      super(beats[0])
      this.fill(0)
    } else {
      super()
      this.push(...Rhythm.parse(...beats))
    }
  }

  /**
   * Add one or more beats with given durations.
   * @param {...number} durations=1
   */
  beat(...durations) {
    for (let duration of durations.length ? durations : [1]) {
      duration = parseInt(duration) > 0 ? parseInt(duration) : 1
      this.push(1)
      for (let i=1; i<duration; i++) {
        this.push(0)
      }
    }
    return this
  }

  /**
   * Add a rest with given duration.
   * @param {number} duration=1
   */
  rest(duration=1) {
    for (let i=0; i<duration; i++) {
      this.push(0)
    }
    return this
  }

  /**
   * Change the rhytm in-place. Takes same arguments as constructor except a single number is not
   * read as number of pules.
   * @param {...string|array}
   */
  replace(...rhythm) {
    if (!(rhythm.length === 1 && rhythm[0] instanceof Rhythm)) {
      rhythm = Rhythm.parse(...rhythm)
    }
    this.splice(0, this.length, ...rhythm)
  }


  /**
   * Compare two rhythms, first by length, then lexicographically.
   * @param rhythm
   */
  compare(r) {
    if (this.length === r.length) {
      for (let i=0; i<r.length; i++) {
        if (r[i] != this[i]) {
          return this[i] - r[i]
        }
      }
      return 0
    } else {
      return this.length - r.length
    }
  }

  /**
   * Return an array of durations between beats, starting with the first beat.
   */
  durations() {
    const len = this.length
    const first = this.first()
    if (first == null) {
      return []
    }
    const durations = []
    let cur = 1
    for (let i = 1; i<=len; i++) {
      if (this[ (first + i) % len ] > 0) {
        durations.push(cur)
        cur = 1
      } else {
        cur++
      }
    }
    return durations
  }

  /**
   * Get greatest common divisor of all durations.
   *
   * Returns 1 if the rhythm cannot be deflated or if the first pulse is not a beat.
   * Returns the length of the rhytm for an empty rhythm.
   */
  divisor() {
    return this[0] === 1 ? this.durations().reduce(gcd) : 1
  }

  /**
   * Get number of repetitions.
   * @return {number}
   */
  repetitions() {
    const s = this.join(",")
    for (let n=this.length; n>1; n--) {
      if (this.length % n === 0) {
        const rep = Array(n).fill(this.slice(0, this.length / n)).flat()
        if (rep.join(",") === s) {
          return n
        }
      }
    }
    return 1
  }

  /**
   * Deflate the rhythm if it has a divisor > 1.
   * @param {number} divisor=this.divisor
   */
  deflate(div=0) {
    const divisor = this.divisor()
    div = div || divisor
    if (divisor > 1 && divisor % div === 0) {
      const condensed = []
      for (let i=0; i<this.length; i+=div) {
        condensed.push(this[i])
      }
      this.replace(condensed)
    }
    return this
  }

  /**
   * Inflate the rhythm. Each pulse is replaced by n pulses.
   * @param {number} n
   */
  inflate(n=2) {
    this.splice(0, this.length, ...this.map(x => [x,...Array(n-1).fill(0)]).flat())
    return this
  }

  /**
   * Repeat rhythm.
   * @params {number} n times
   */
  repeat(n=2) {
    this.replace(...Array(n).fill(this).flat())
    return this
  }

  /**
   * Remove all repetitions.
   */
  cut() {
    const r = this.repetitions()
    if (r > 1) {
      this.splice(0, this.length - this.length / r)
    }
    return this
  }

  /**
   * Return a copy of this rhythm object.
   */
  copy() {
    return new Rhythm(this)
  }

  /**
   * Convert rhythm into its complement by swapping beats and rests.
   */
  complement() {
    this.replace(...this.map(x => x ? 0 : 1))
    return this
  }

  /**
   * Calculate all rotations.
   * @param {boolean} beat only consider beat rotations
   * @returns {array} of patterns
   */
  rotations(beat=false) {
    const pattern = this.toString()
    const pp = `${pattern}${pattern}`
    const set = new Set()
    for (let i=1; i<this.length; i++) {
      const p = pp.substring(i, i+this.length)
      if ((!beat || p[0]=="x") && p !== pattern) {
        set.add(p)
      }
    }
    return set
  }

  /**
   * Check whether the rhythm is normalized to its core rhythm.
   */
  core() {
    return this.equals(this.copy().normalize())
  }
    
  /**
   * Check whether the rhythm is odd (cannot be split at beats into two parts of equal length).
   */
  odd() {
    const durations = this.durations()
    if (durations.length && this.length % 2 === 0) {
      const half = this.length / 2
      for (let i=0; i<durations.length-1; i++) {
        let d=durations[i]
        if (d === half) {
          return false
        }
        for (let j=i+1; j<durations.length && d<half; j++) {
          d+=durations[j]
          if (d === half) {
            return false
          }
        }
      }
    }
    return true
  }

  /**
   * ...
   */
  shuffle() {
    if (this.length % 2 === 0) {
      const r = []
      for (let i=0; i<this.length; i+=2) {
        r.push(this[i],0,this[i+1])
      }
      this.replace(r)
    }
    return this
  }

  /**
   * ...
   */
  unshuffle() {
    // TODO: test coverage
    if (this.isShuffle()) {
      const r = []
      for (let i=0; i<this.length; i+=3) {
        r.push(this[i],this[i+2])
      }
      this.replace(r)
    }
    return this
  }

  /**
   * ...
   */
  isShuffle() {
    // TODO: test coverage
    if (this.length % 3 === 0) {
      for (let i=1; i<this.length; i++) {
        if (this[i]) {
          return false
        }
        return true
      }
    }
    return false
  }

  /**
   * Rotate the rhythm one or more pulses to the right.
   * @param {number} pulses positive or negative number
   * @example
   * Rhythm.fromPattern("x--x-").rotate(1) // => [0,1,0,0,1]
   */
  rotate(pulses=1) {
    if (pulses) {
      const len = this.length
      this.push(...this.splice(0, (-pulses % len + len) % len))
    }
    return this
  }

  /**
   * Rotate the rhythm one or more beats to the right.
   *
   * If the first pulse is not a beat, the rhythm is first rotated to do so, so rotation by zero
   * beats will shift the first beat to the first pulse.
   *
   * @param {number} beats
   */
  rotateBeats(beats=1) {
    const pos = this.beatPulses()
    if (pos.length) {
      const shift = (-beats % pos.length + pos.length) % pos.length
      this.rotate(-pos[shift])
    }
    return this
  }

  /** 
   * Get the number of beats in this rhythm.
   **/
  beats() {
    return this.filter(x => x > 0).length
  }

  /** 
  * Get index numbers of beats in this rhythm.
  **/
  beatPulses() {
    return this.map((x,i) => x > 0 ? i : null).filter(i => i !== null)
  }

  /** 
   * Get the position the the first beat, or null if the rhythm is empty.
   **/
  first() {
    const index = this.findIndex(x => x > 0)
    return index >= 0 ? index : null
  }

  /**
   * Get whether the rhytm contains no beats. 
   */
  empty() {
    return this.first() === null
  }

  /**
   * Stringify the rhythm with "x" for beat and "-" for rest.
   */
  toString() {
    // TODO: stringify in drum talk (1e+a2e+e...)
    return this.map(x => x > 0 ? "x" : "-").join("")
  }

  /**
   * Stringify the durations of the beat, separated by `+` and 
   * preceded by more `+` if the first pulse is not a beat.
   */
  toDurationString() {
    const durations = this.durations()
    return durations ? "+".repeat(this.first()) + durations.join("+") : ""
  }

  /**
   * Normalize to a core rhythm by rotating, deflation, and cutting repetitions.
   */
  normalize() {
    this.rotateBeats(0)
    this.deflate()
    this.cut()
    const rot = [this.toString(), ...this.rotations(true)].sort()
    this.replace(rot[0])
    return this
  }

  /**
   * Get rotation number to make this rhythm into another (or undefined if not possible).
   * @param {Rhythm} rhythm
   */
  rotation(rhythm) {
    if (this.length === rhythm.length) {
      const rot = (this + this).indexOf(rhythm.toString())
      return rot === -1 ? undefined : -rot
    }
    return undefined
  }

  /**
   * Check whether this rhythm is equivalent to another, possibly under rotation. 
   * @param {Rhythm} rhythm
   */
  equivalent(rhythm) {
    return this.rotation(rhythm) !== undefined
  }

  /**
   * Whether the rythm is equal to another rythm.
   * @param {Rhythm} rhythm
   */
  equals(rhythm) {
    return this.toString() === rhythm.toString()
  }

  /**
   * Generate a Rhythm from pattern string.
   * @param {string} pattern
   */
  static fromPattern(pattern) {
    return new Rhythm(pattern.split("").map(x => Rhythm.isBeat(x) ? 1 : 0)) 
  }

  /**
   * Generate a rhythm from an array or string of durations.
   * @param {Array|string} durations
   */
  static fromDurations(durations) {
    if (Array.isArray(durations)) {
      return new Rhythm(durations.map(n => "x"+"-".repeat(n-1)).join(""))
    } else if (typeof durations === "string") {
      const match = Rhythm.isDurationsString(durations)
      if (match) {
        durations = match[2].split("+")
        const rot = match[1].length 
        return Rhythm.fromDurations(durations).rotate(rot)
      }
    }
    throw TypeError("Malformed durations")  
  }

  /**
   * Generate an euclidean rhythm.
   * @param {number} beats number of beats
   * @param {number} pulses length of the rhythm
   */
  static euclidean(beats, pulses) {
    const pattern = []
    let d = -1
    for (let i = 0; i < pulses; i++) {
      const v = Math.floor(i * (beats / pulses))
      pattern[i] = v !== d ? 1 : 0
      d = v
    }
    return new Rhythm(pattern)
  }
}

/**
 * Calculate the greatest common divisor of two numbers.
 **/
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b) 
}

export default Rhythm
