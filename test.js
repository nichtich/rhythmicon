import assert from "assert"
import { Rhythm } from "./index.js"


it("empty rythm", () => {
  let r = new Rhythm()
  assert.equal(`${r}`, "")
  assert.deepEqual(new Rhythm(""), r)
  assert.deepEqual(new Rhythm(r), r)
  assert.deepEqual(new Rhythm([]), r)

  assert.deepEqual(r.durations(), [])
})

it("sample rythm", () => {
  let r = new Rhythm()
  r.beat(3).beat(3,2)
  assert.equal(`${r}`, "x--x--x-")
  assert.deepEqual(new Rhythm("x--x--x-"), r)
  assert.deepEqual(new Rhythm("|+__R  L.|\t"), r)
  assert.deepEqual(new Rhythm(r), r)
  assert.deepEqual(new Rhythm([1,0,0,1,0,0,1,0]), r)
  assert.deepEqual(new Rhythm("1","_","_","+","_","_","4","_"), r)

  assert.deepEqual(r.durations(), [3,3,2])
  r.rotate(-1)
  assert.equal(`${r}`, "--x--x-x")
  assert.deepEqual(r.durations(), [3,2,3])
})

it("rotate, rotation, equivalent", () => {
  let a = new Rhythm(1,0,0,1,0)
  let b = new Rhythm(0,0,1,0,1)
  let c = new Rhythm("x--xxx")

  assert.deepEqual(a.rotation(b),-1)
  assert.ok(a.equivalent(b))

  a.rotate(1)
  assert.deepEqual(a, [0,1,0,0,1])
  a.rotate(-2)
  assert.deepEqual(a.rotation(b),0)

  assert.deepEqual(a.rotation(c),undefined)
  assert.ok(!a.equivalent(c))
})

it("normalize, durations, gaps", () => {
  let r = new Rhythm("-x--x-----x-")
  assert.deepEqual(r.durations(),[3,6,3])
  assert.deepEqual(r.gaps(),[1,3,6,2])
  r.normalize()
  assert.equal(`${r}`, "xx-x")
  assert.deepEqual(r.durations(),[1,2,1])
  assert.deepEqual(r.gaps(),[1,2,1])
  assert.deepEqual((new Rhythm("x--")).gaps(),[3])
  assert.deepEqual((new Rhythm("--x")).gaps(),[2,1])
})

it("euclidean", () => {
  assert.equal(Rhythm.euclidean(4,3).toString(), "x-xx")
  assert.equal(Rhythm.euclidean(8,3).toString(), "x--x--x-")
})
