

/** Calculates the greatest common divisor of two numbers */
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)

/**
 * A rhythm is a sequence of beats and rests, encoded as Array of ones and zeroes.
 */
class Rhythm extends Array {

  /**
   * Returns whether a variable is read as beat. This is true for every true
   * value except for the characters space, tab, underscore, dot and minus.
   */
  static isBeat(x) {
    return x && !(typeof x === "string" && x.match(/^[ \t_.-]/))
  }

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
   * Rhythm(n) 
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
   * Get greatest common divisor of all durations, if the first step is a beat.
   */
  divisor() {
    if (this[0] === 1) {
      const set = new Set(this.durations())
      if (set.size === 1) {
        return [...set][0]
      }
      const d = gcd(Math.min(...set), Math.max(...set))
      return d > 1 ? d : undefined
    }
  }

  condense(div=0) {
    const divisor = this.divisor()
    div = div || divisor
    if (divisor && divisor % div === 0) {
      const condensed = []
      for (let i=0; i<this.length; i+=div) {
        condensed.push(this[i])
      }
      this.replace(condensed)
    }
    return this
  }

  gaps() {
    const gaps = []
    const first = this.first()
    if (first == null) {
      return [this.length]
    } else if (first > 0) {
      gaps.push(first)
    }
    let prev = first
    for (let i=first+1; i<this.length; i++) {
      if (this[i] > 0) {
        gaps.push(i-prev)
        prev = i
      }
    }
    gaps.push(this.length-prev)
    return gaps
  }

  /**
   * Rotate the rhythm one step to the right.
   * @param {number} steps positive or negative number of steps
   * @example
   * (new Rhythm(1,0,0,1,0)).rotate(1) // => [0,1,0,0,1]
   */
  rotate(count=1) {
    const len = this.length
    this.push(...this.splice(0, (-count % len + len) % len))
    return this
  }

  /** Get the number of beats in this rhythm. */
  beats() {
    return this.filter(x => x > 0).length 
  }

  /** Get the position the the first beat or null if the rhythm contains none. */
  first() {
    const index = this.findIndex(x => x > 0) 
    return index >= 0 ? index : null
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
   * Generate an euclidean rhythm.
   * @param {number} steps length of the rhythm
   * @param {number} beats number of beats
   */
  static euclidean(steps, beats) {
    const pattern = []
    let d = -1
    for (let i = 0; i < steps; i++) {
      const v = Math.floor(i * (beats / steps))
      pattern[i] = v !== d ? 1 : 0
      d = v
    }
    return new Rhythm(pattern)
  }

  // TODO: stringify in drum talk (1e+a2e+e...)

  // Related app: <https://www.mikeslessons.com/groove/>
}

export default Rhythm
