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
  r.beat(3).beat(3,1).rest().beat().beat(0).beat("?")
  assert.equal(`${r}`, "x--x--x-x")
  assert.deepEqual(new Rhythm("x--x--x-x"), r)
  assert.deepEqual(new Rhythm("+__R 0L.Z"), r)
  assert.deepEqual(new Rhythm(r), r)
  assert.deepEqual(new Rhythm([1,0,0,1,0,0,1,0,1]), r)
  assert.deepEqual(new Rhythm("1","_","_","+","_","_","4","_",true), r)

  assert.deepEqual(r.durations(), [3,3,2,1])
  r.rotate(-1)
  assert.equal(`${r}`, "--x--x-xx")
  assert.deepEqual(r.durations(), [3,2,1,3])

  assert.deepEqual(r, r.clone())
})

it("rotate, rotation, equivalent, equal", () => {
  let a = new Rhythm(1,0,0,1,0)
  let b = new Rhythm(0,0,1,0,1)
  let c = new Rhythm("x--xxx")

  assert.equal(a.rotated(b),-1)
  assert.equal(a.rotated("xxx--"),undefined)
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
    beatPulses: [],
    beats: 0,
    //condense: true,
    durations: [],
    toDurations: "",
    empty: true,
    odd: true,
  },
  x: {
    beatPulses: [0],
    beats: 1,
    condense: true,
    core: true,
    divisor: 1,
    durations: [1],
    toDurations: "1",
    odd: true,
    repetitions: 1,
    shuffled: false,
    toTracy: undefined,
  },
  xx: {
    beatPulses: [0,1],
    durations: [1,1],
    toDurations: "1+1",
    divisor: 1,
    repetitions: 2,
    core: false,
    beats: 2,
    odd: false,
    toTracy: undefined,
    shuffled: false,
    condense: false,
  },
  "x-x-x--x--": {    
    odd: false,
    condense: true,
    // TODO: Lyndon: true (2+2+3+3)
  },
  "x-x": {
    beatPulses: [0,2],
    divisor: 1,
    condense: true,
    core: true,
    beats: 2,
    odd: true,
    toTracy: "5",
    shuffled: true,
  },
  "x--": {
    durations: [3],
    core: false,
    beats: 1,
    odd: true,
    toTracy: "4",
    shuffled: true,
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
    toTracy: "440",
    shuffled: true,
  },
  "xx-": {
    toTracy: "6",
    shuffled: false,
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

describe("shuffle/unshuffle", () => {
  const shuffled = "---x----xx-x"
  it(shuffled, () => {
    const rhythm = new Rhythm(shuffled)
    assert.equal(rhythm.shuffled(), true)
    assert.deepEqual(rhythm.unshuffle(), [0,0,1,0,0,1,1,1])
    assert.equal(rhythm.shuffled(), false)
    assert.equal(rhythm.shuffle().toString(), shuffled)
  })
})

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
      assert.equal(rhythm.toDurations(), str)
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

it("toString", () => {
  const chars = [String.fromCodePoint(0x1D15F), String.fromCodePoint(0x1D13D)]
  assert.equal(Rhythm.fromPattern("x-xx").toString(...chars), "𝅘𝅥𝄽𝅘𝅥𝅘𝅥")
})

it("complement", () => {
  const r = new Rhythm("x-x")
  assert.equal(r.complement(), r) 
  assert.deepEqual(r, new Rhythm("-x-")) 
})
 
it("cut", () => {
  const r = new Rhythm("x-xx-xx-xx-xx-xx-x")
  assert.equal(r.repetitions(), 6)
  assert.equal(r.cut(2).toString(), "x-xx-xx-x")
  assert.equal(r.cut(7).toString(), "x-xx-xx-x")
  assert.equal(r.cut().toString(), "x-x")
})

const generate = {
  fromEuclidean: [
    [[3,4], "x-xx"],
    [[3,8], "x--x--x-"],
  ],
  fromTracy: [
    [[5325], "x-x-xx-x-x-x"],
    [[140], "--xx-----"],
  ],
}

Object.entries(generate).forEach(([fn, tests]) => describe(fn, () => {
  tests.forEach(([args, pattern]) => it(args.join(",")+" = "+pattern, () => {
    const rhythm = Rhythm[fn](...args)
    assert.equal(rhythm?.toString(), pattern)
  }))
}))
