class Rhythm extends Array {

  constructor(...beats) {
    if (beats.length === 1 && typeof beats[0] === "number") {
      super(beats[0])
      this.fill(0)
    } else {
      super()
      this.push(...Rhythm.parse(...beats))
    }
  }

  static isBeat(x) {
    return x && !(typeof x === "string" && x.match(/^[ _.0-]/))
  }

  static isDurationsString(s) {
    return s.match(/^([+-]*)([1-9][0-9]*([+-][1-9][0-9]*)*)$/)
  }

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

  rest(duration=1) {
    for (let i=0; i<duration; i++) {
      this.push(0)
    }
    return this
  }

  replace(...rhythm) {
    if (!(rhythm.length === 1 && rhythm[0] instanceof Rhythm)) {
      rhythm = Rhythm.parse(...rhythm)
    }
    this.splice(0, this.length, ...rhythm)
  }

  compare(rhythm) {
    rhythm = rhythm instanceof Rhythm ? rhythm : Rhythm.parse(...rhythm)
    if (this.length === rhythm.length) {
      // TODO: compare durations instead!
      for (let i=0; i<rhythm.length; i++) {
        if (rhythm[i] != this[i]) {
          return this[i] - rhythm[i]
        }
      }
      return 0
    } else {
      return this.length - rhythm.length
    }
  }

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

  divisor() {
    return this[0] === 1 ? this.durations().reduce(gcd) : 1
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

  inflate(n=2) {
    this.splice(0, this.length, ...this.map(x => [x,...Array(n-1).fill(0)]).flat())
    return this
  }

  repeat(n=2) {
    this.replace(...Array(n).fill(this).flat())
    return this
  }

  cut(n) {
    let r = this.repetitions()
    if (r > 1) {
      if (n > 0) {
        if (r % n === 0) {
          r = n
        } else {
          return this // TODO: throw error instead?
        }
      }
      this.splice(0, this.length - this.length / r)
    }
    return this
  }

  clone() {
    return new Rhythm(this)
  }

  complement() {
    this.replace(...this.map(x => x ? 0 : 1))
    return this
  }

  rotations() {
    const pattern = this.toString()
    const pp = `${pattern}${pattern}`
    const set = new Set()
    for (let i=1; i<this.length; i++) {
      const p = pp.substring(i, i+this.length)
      if (p !== pattern) {
        set.add(p)
      }
    }
    return set
  }

  beatRotations() {
    // TODO: there sure is a better algorithm
    return new Set([...this.rotations()].filter(r => r[0] === "x"))
  }

  core() {
    return this.equals(this.clone().normalize())
  }
    
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
    if (this.shuffled()) {
      const r = []
      for (let i=0; i<this.length; i+=3) {
        r.push(this[i],this[i+2])
      }
      this.replace(r)
    }
    return this
  }

  shuffled() {
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

  rotate(pulses=1) {
    if (pulses) {
      const len = this.length
      this.push(...this.splice(0, (-pulses % len + len) % len))
    }
    return this
  }

  rotateBeats(beats=1) {
    const pos = this.beatPulses()
    if (pos.length) {
      const shift = (-beats % pos.length + pos.length) % pos.length
      this.rotate(-pos[shift])
    }
    return this
  }

  beats() {
    return this.filter(x => x > 0).length
  }

  beatPulses() {
    return this.map((x,i) => x > 0 ? i : null).filter(i => i !== null)
  }

  first() {
    const index = this.findIndex(x => x > 0)
    return index >= 0 ? index : undefined
  }

  empty() {
    return this.first() === undefined
  }

  toString() {
    // TODO: stringify in drum talk (1e+a2e+e...)
    return this.map(x => x > 0 ? "x" : "-").join("")
  }

  toDurationString(sep="+") {
    const durations = this.durations()
    return durations ? sep.repeat(this.first()) + durations.join(sep) : ""
  }

  normalize() {
    this.rotateBeats(0)
    this.deflate()
    this.cut()
    const rot = [this.toString(), ...this.beatRotations()].sort()
    this.replace(rot[0])
    return this
  }

  rotated(rhythm) {
    if (this.length === rhythm.length) {
      const rot = (this + this).indexOf(rhythm.toString())
      return rot === -1 ? undefined : -rot
    }
    return undefined
  }

  equivalent(rhythm) {
    rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(...rhythm)
    return this.rotated(rhythm) !== undefined
  }

  equals(rhythm) {
    rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(...rhythm)
    return this.toString() === rhythm.toString()
  }

  includes(rhythm) {
    rhythm = rhythm instanceof Rhythm ? rhythm : new Rhythm(...rhythm)
    const beats = new Set(rhythm.beatPulses())
    return beats.isSubsetOf(new Set(this.beatPulses()))
  }

  static fromPattern(pattern) {
    return new Rhythm(pattern.split("").map(x => Rhythm.isBeat(x) ? 1 : 0)) 
  }

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

  static fromEuclidean(beats, pulses) {
    const pattern = []
    let d = -1
    for (let i = 0; i < pulses; i++) {
      const v = Math.floor(i * (beats / pulses))
      pattern[i] = v !== d ? 1 : 0
      d = v
    }
    return new Rhythm(pattern)
  }

  static fromTracy(number) {
    number = `${number}`
    if (number.match(/^[0-7]+$/)) {
      return new Rhythm(number.split("").map(d => Number(d).toString(2).padStart(3,"0")).join(""))
    }
  }

  static fromHex(number) {
    if (number.match(/^[0-9A-F]+$/i)) {
      return new Rhythm(number.split("").map(d => parseInt(d,16).toString(2).padStart(4,"0")).join(""))
    }
  }
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b) 
}

export default Rhythm
