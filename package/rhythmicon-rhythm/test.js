import assert from "assert"
import Rhythm from "./index.js"

it("empty rythm", () => {
  let r = new Rhythm()
  assert.equal(`${r}`, "")
  assert.deepEqual(new Rhythm(""), r)
  assert.deepEqual(new Rhythm(r), r)
  assert.deepEqual(new Rhythm([]), r)
  assert.deepEqual(r.durations(), [])
})

it("sample rythm", () => {
  assert.deepEqual(new Rhythm(""),[])
  assert.deepEqual(new Rhythm("-"),[0])
  assert.deepEqual(new Rhythm("x"),[1])

  let r = new Rhythm()
  r.beat(3).beat(3,1).rest()
  assert.equal(`${r}`, "x--x--x-")
  assert.deepEqual(new Rhythm("x--x--x-"), r)
  assert.deepEqual(new Rhythm("+__R 0L."), r)
  assert.deepEqual(new Rhythm(r), r)
  assert.deepEqual(new Rhythm([1,0,0,1,0,0,1,0]), r)
  assert.deepEqual(new Rhythm("1","_","_","+","_","_","4","_"), r)

  assert.deepEqual(r.durations(), [3,3,2])
  r.rotate(-1)
  assert.equal(`${r}`, "--x--x-x")
  assert.deepEqual(r.durations(), [3,2,3])

  assert.deepEqual(r, r.clone())
})

it("rotate, rotation, equivalent, equal", () => {
  let a = new Rhythm(1,0,0,1,0)
  let b = new Rhythm(0,0,1,0,1)
  let c = new Rhythm("x--xxx")

  assert.deepEqual(a.rotated(b),-1)
  assert.ok(a.equivalent(b))
  assert.ok(!a.equals(b))

  a.rotate(1)
  assert.deepEqual(a, [0,1,0,0,1])
  a.rotate(-2)
  assert.deepEqual(a.rotated(b),0)

  assert.deepEqual(a.rotated(c),undefined)
  assert.ok(!a.equivalent(c))
})

it("includes", () => {
  const cinquillo = new Rhythm("x-xx-xx-")
  assert.ok( cinquillo.includes("x--x--x-"))
  assert.ok(!cinquillo.includes("xx-x--x-"))
})

it("rotateBeat", () => {
  assert.deepEqual(Rhythm.fromPattern("--xx-").rotateBeats(0), [1,1,0,0,0])
  assert.deepEqual(Rhythm.fromPattern("--xx-").rotateBeats(1), [1,0,0,0,1])
  assert.deepEqual(Rhythm.fromPattern("xx---").rotateBeats(1), [1,0,0,0,1])
})

it("normalize", () => {
  let r = new Rhythm("-x--x-----x-")
  assert.deepEqual(r.durations(),[3,6,3])
  r.normalize()
  assert.equal(`${r}`, "x-xx")
})

const properties = {
  "": {
    empty: true,
    beats: 0,
    beatPulses: [],
    durations: [],
    odd: true,
  },
  x: {
    beatPulses: [0],
    durations: [1],
    divisor: 1,
    core: true,
    beats: 1,
    odd: true,
  },
  xx: {
    beatPulses: [0,1],
    durations: [1,1],
    divisor: 1,
    repetitions: 2,
    core: false,
    beats: 2,
    odd: false,
  },
  "x-x-x--x--": {    
    odd: false,
    // TODO: Lyndon: true (2+2+3+3)
  },
  "x-x": {
    beatPulses: [0,2],
    divisor: 1,
    core: true,
    beats: 2,
    odd: true,
  },
  "x--": {
    durations: [3],
    core: false,
    beats: 1,
    odd: true,
  },
  "xx-x": {
    durations: [1,2,1],
    beats: 3,
    odd: false,
  },
  "x-x-x-": {
    beatPulses: [0,2,4],
    divisor: 2,
    beats: 3,
    deflated: "xxx",
    odd: true,
  },
  "x--x-----": {
    durations: [3,6],
    divisor: 3,
    deflated: "xx-",
    odd: true,
  },
  "x-----": {
    divisor: 6,
    deflated: "x",
    odd: true,
  },
  "--x---": {
    divisor: 1, 
    odd: true,
  },
}

describe("properties", () =>
  Object.entries(properties).forEach(([pattern, r]) => describe(pattern, () => {
    const rhythm = new Rhythm(pattern)
    Object.entries(r).filter(e => e[0] !== "deflated").forEach(([key, value]) =>
      it(key, () => assert.deepEqual(rhythm[key](), value)))
    if (r.durations) {
      it("fromDurations(array)", () => assert.deepEqual(Rhythm.fromDurations(r.durations), rhythm))
    }
    if (r.deflated) {
      it(`deflate/inflate <=> ${r.deflated}`, () => {
        const deflated = Rhythm.fromPattern(r.deflated)
        assert.deepEqual(rhythm.deflate(r.divisor), deflated)
        assert.deepEqual(rhythm.inflate(r.divisor).toString(), pattern)
      })
    }
  })))

describe("fromDurations", () => {
  const tests = {
    1: "x",
    "1+2": "xx-",
    "++1+3": "--xx",
    "3+": null,
    "1+0": null,
    "++5": "--x--",
  }
  Object.entries(tests).forEach(([str, pat]) => it(str, () => {
    if (pat) {
      const rhythm = Rhythm.fromDurations(str)    
      assert.deepEqual(rhythm, new Rhythm(pat))
      assert.equal(rhythm.toDurationString(), str)
    } else {
      assert.throws(() => Rhythm.fromDurations(str))
    }      
  }))
})
 
describe("repeat", () => {
  it("-xx- ×2", () => assert.equal(Rhythm.fromPattern("-xx-").repeat().toString(), "-xx--xx-"))
  it("x- ×3", () => assert.equal(Rhythm.fromPattern("x-").repeat(3).toString(), "x-x-x-"))
})

describe("compare", () => {
  const compare = (a,b) => (new Rhythm(a)).compare(new Rhythm(b))
  it("length", () => assert.equal(compare("x-","x--"), -1))
  it("equal", () => assert.equal(compare("x--","x--"), 0))
  it("pulses", () => assert.equal(compare("x--","x-x"), -1))
})

const generate = {
  fromEuclidean: [
    [[3,4], "x-xx"],
    [[3,8], "x--x--x-"],
  ],
  fromTracy: [
    [[5325], "x-x-xx-x-x-x"],
  ],
  fromHex: [
    [["z"]],
    [["8f"], "x---xxxx"],
  ],
}

Object.entries(generate).forEach(([fn, tests]) => describe(fn, () => {
  tests.forEach(([args, pattern]) => it(args.join(",")+" = "+pattern, () => {
    const rhythm = Rhythm[fn](...args)
    assert.equal(rhythm?.toString(), pattern)
  }))
}))


