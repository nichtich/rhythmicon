

/** Calculate the greatest common divisor of two numbers */
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)

/**
 * A rhythm is a sequence of beats and rests, encoded as Array of ones and zeroes.
 * This is a subclass of Array.
 */
class Rhythm extends Array {

  /**
   * Return whether a variable is read as beat. This is true for every true
   * value except for the characters space, tab, underscore, dot and minus.
   */
  static isBeat(x) {
    return x && !(typeof x === "string" && x.match(/^[ \t_.-]/))
  }

  /**
   * Read a string, an array, or a list of values as rhythm.
   */
  static parse(...beats) {
    if (beats.length === 1) {
      if (Array.isArray(beats[0])) {
        beats = beats[0]
      } else if (typeof beats[0] === "string") {
        beats = beats[0].replace(/^\s*\||\|\s*$/g,"").split("")
      }
    }
    return beats.map(x => Rhythm.isBeat(x) ? 1 : 0)
  }

  /**
   * Create a new Rhythm.
   * @example
   * Rhyth("x--x--x-")
   * Rhythm("|RL-RRL--|")
   * Rhyth([1,0,0,1,0,0,1,0])
   * Rhyth("1","_","_","+","_","_","4","_")
   *
   * Rhythm(n) // empty rhythm of length n
   */
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
   * Change the rhytm in-place. Takes same arguments as constructor but a single number is not
   * read as number of pules.
   */
  replace(...beats) {
    if (!(beats.length === 1 && beats[0] instanceof Rhythm)) {
      beats = Rhythm.parse(...beats)
    }
    this.splice(0, this.length, ...beats)
  }

  /**
   * Add one or more beats with given durations.
   * @param {...number} [durations=1]
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
   * @param {number} [duration=1]
   */
  rest(duration=1) {
    for (let i=1; i<duration; i++) {
      this.push(0)
    }
    return this
  }

  /**
   * Compare two rhythms, first by length, then lexicographically.
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
   * Always returns 1 if the the first pulse is not a beat.
   * Returns the length of the rhytm is empty.
   */
  divisor() {
    return this[0] === 1 ? this.durations().reduce(gcd) : 1
  }

  condense(div=0) {
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

  expand(n=2) {
    this.splice(0, this.length, ...this.map(x => [x,...Array(n-1).fill(0)]).flat())
  }

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

  cut() {
    const r = this.repetitions()
    if (r > 1) {
      this.splice(0, this.length / r)
    }
    return this
  }

  // TODO
  isCore() {
    if (this.first()) {
      return false
    } // shifted
    if (this.divisor() > 1) {
      return false
    }
    if (this.repetitions() > 1) {
      return false
    }

    // TODO: is this lexicographically smaller than all its rotations
    // check durations to do so is more performant?
  }

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

  unshuffle() {
    if (this.isShuffle()) {
      const r = []
      for (let i=0; i<this.length; i+=3) {
        r.push(this[i],this[i+2])
      }
      this.replace(r)
    }
    return this
  }

  isShuffle() {
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
   * Rotate the rhythm one pulse to the right.
   * @param {number} pulses positive or negative number
   * @example
   * (new Rhythm(1,0,0,1,0)).rotate(1) // => [0,1,0,0,1]
   */
  rotate(pulses=1) {
    const len = this.length
    this.push(...this.splice(0, (-pulses % len + len) % len))
    return this
  }

  rotateBeat(pulses=1) {
    if (Math.abs(pulses) > 0 && !this.empty()) {
      const pos = this.beatPositions()
      let shift = 0
      if (this[0]) {
        shift = pos[(-pulses % pos.length + pos.length) % pos.length]
      } else {
        shift = pos[0]
      }
      this.rotate(-shift)
    }
    return this
  }

  /** Get the number of beats in this rhythm. */
  beats() {
    return this.filter(x => x > 0).length
  }

  /** Get index numbers of beats. **/
  beatPositions() {
    return this.map((x,i) => x > 0 ? i : null).filter(i => i !== null)
  }

  /** Get the position the the first beat, or null if the rhythm is empty. */
  first() {
    const index = this.findIndex(x => x > 0)
    return index >= 0 ? index : null
  }

  /** Get whether the rhytm contains no beats. **/
  empty() {
    return this.first() === null
  }

  /** Stringify the rhythm with "x" for beat and "-" for rest. */
  toString() {
    return this.map(x => x > 0 ? "x" : "-").join("")
  }

  // TODO: document
  normalize() {
    const first = this.first()
    if (first === null) {
      this.splice(this.length)
    } else {
      this.rotate(-first)
    }
    const durations = this.durations()
    if (durations.length > 1) {
      const d = gcd(Math.min(...durations), Math.max(...durations))
      if (d > 1) {
        for (let i=0; i<this.length/d; i++) {
          this[i] = this[i*d]
        }
        this.splice(this.length/d, Infinity)
      }
    }
    return this
  }

  /** Get rotation number to make this rhythm into another, or undefined. */
  rotation(rhythm) {
    if (this.length === rhythm.length) {
      const rot = (this + this).indexOf(rhythm.toString())
      return rot === -1 ? undefined : -rot
    }
    return undefined
  }

  /** Check whether this rhythm is equivalent to another, possibly under rotation. */
  equivalent(rhythm) {
    return this.rotation(rhythm) !== undefined
  }

  /**
   * Whether the rythm is equal to another rythm.
   */
  equal(rhythm) {
    return this.toString() === rhythm.toString()
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

  // TODO: stringify in drum talk (1e+a2e+e...)

  // Related app: <https://www.mikeslessons.com/groove/>
}

export default Rhythm
