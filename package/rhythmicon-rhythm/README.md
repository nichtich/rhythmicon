# rhythmicon-rhythm

[![NPM Version](https://img.shields.io/npm/v/rhythmicon-rhythm)](https://www.npmjs.com/package/rhythmicon-rhythm)

> Analyze and compute rhythmic patterns

This Node package implements class [Rhythm](#rhythm) to store, analyze and manipulate rhythms. 

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Rhythm](#rhythm)
  - [Constructors](#constructors)
    - [new](#new)
    - [clone()](#clone)
  - [Factory methods](#factory-methods)
    - [fromPattern(pattern)](#frompatternpattern)
    - [fromDurations(durations)](#fromdurationsdurations)
    - [fromEuclidean(beats, pulses)](#fromeuclideanbeats-pulses)
    - [fromTracy(number)](#fromtracynumber)
    - [fromHex(number)](#fromhexnumber)
  - [Accessor methods](#accessor-methods)
    - [beats()](#beats)
    - [beatPulses()](#beatPulses)
    - [first()](#first)
    - [empty()](#empty)
    - [durations()](#durations)
    - [divisor()](#divisor)
    - [repetitions()](#repetitions)
    - [shuffled()](#shuffled)
    - [odd()](#odd)
    - [core()](#core)
    - [rotations()](#rotations)
    - [beatRotations()](#beatrotations)
    - [toString()](#tostring)
    - [toDurationString()](#todurationstring)
  - [Comparator methods](#comparator-methods)
    - [compare(rhythm)](#comparerhythm)
    - [equivalent(rhythm)](#equivalentrhythm)
    - [equals(rhythm)](#equalsrhythm)
    - [rotated(rhythm)](#rotatedrhythm)
    - [includes(rhythm)](#includesrhythm)
  - [Modifying methods](#modifying-methods)
    - [beat(...durations)](#beatdurations)
    - [rest(duration)](#restduration)
    - [replace(...rhythm)](#replacerhythm)
    - [deflate(divisor)](#deflatedivisor)
    - [inflate(n)](#inflaten)
    - [repeat(n)](#repeatn)
    - [cut(n)](#cutn)
    - [complement()](#complement)
    - [shuffle()](#shuffle)
    - [unshuffle()](#unshuffle)
    - [rotate(pulses)](#rotatepulses)
    - [rotateBeats(beats)](#rotatebeatsbeats)
    - [normalize()](#normalize)
  - [Static methods](#static-methods)
    - [isBeat(value)](#isbeatvalue)
    - [isDurationsString(str)](#isdurationsstringstr)
    - [parse(rhythm)](#parserhythm)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

Class [Rhythm](#Rhythm) implements a simplified model of musical rhythms. Every rhythm is an array of pulses, each being either a beat (value `1`) or a rest (value `0`). For instance the tresillo rhythm is array `[1,0,0,1,0,0,1,0]`. A rhythm can also be encoded as pattern string (`x--x--x-`) and as durations (array `[3,3,2]` or string `3+3+2`). Rhythms can further be:

- [repeated](#repeatn) and [cut](#cutn) (e.g. `x-x-x-` can be cut to `x-`)
- [inflated](#inflaten) and [deflated](#deflatedivisor) by a [divisor](#divisor) (e.g. `x-x` and `x---x-` with divisor 2).
- [rotated](#rotate) (e.g. `xx-` is rotated `-xx` and `x-x`)
- [shuffled](#shuffle) and [unshuffled](#unshuffle) (e.g `x-xx--` is shuffle of `xxx-`)
- [normalized](#normalize) to a core rhythm

### Related works

- [rhythmicon-vue](package/rhythmicon-vue#readme) is a JavaScript library of Vue components to display and interact with rhythmic patterns
- rhythmicon further contains [a collection of rhythms](https://github.com/nichtich/rhythmicon/tree/dev/rhythms#readme) and a web application to analyze and modify rhythmic patterns
- [tonal](https://www.npmjs.com/package/tonal) is a JavaScript library for tonal elements of music (note, intervals, chords, scales, modes, keys). The library also contains the limited class [@tonaljs/rhythm-pattern](https://www.npmjs.com/package/@tonaljs/rhythm-pattern) for rhythmic patterns.

## Install

This package comes as single file without dependencies.

```bash
npm install rhythmicon-rhythm
```

## Usage

~~~js
import Rhythm from "rhythmicon-rhythm"

const r = new Rhytm("x--x--x-")

console.log(`Rhythm has ${r.beats()} in ${r.length} pulses) 
~~~

## Rhythm

This is a subclass of [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) so all of its properties and methods can be used. Please make sure the Array will contain only `0` and `1` elements when using low-level Array methods.

### Constructors

#### new

The constructor creates a new Rhythm object like `new Array`. If passed a single string or Array argument, this argument is used to build the rhythm from.

```js
new Rhyth("x--x--x-")
new Rhythm("|RL-RRL--|")
new Rhyth([1,0,0,1,0,0,1,0])
new Rhyth("A","_","_","+","_","_","B","_")

Rhythm(n) // empty rhythm of length n
```

#### clone

This instance method returns a copy of the Rhythm instance.

### Factory methods

#### fromPattern(pattern)

Create a Rhythm from a pattern `string`.

#### fromDurations(durations)

Create a rhythm from an `Array` or `string` of durations.

### fromEuclidean(beats, pulses)

Create an euclidean rhythm with `beats` number of beats in `pulses` number of pulses.

### fromTracy(number)

Create a rhythm from its [Tracy Number], being an octal number (sequence of
digits `0` to `7`). Each digit represents three pulses (`0=---` to `7=xxx`). 

[Tracy Number]: https://www.tbray.org/ongoing/When/202x/2025/12/02/Bell-Combinatorics

### fromHex(number)

Create a rhythm from its hexadecimal representation. Each character (digit or
letter A to F) represents four pulses (`0=----` to `F=xxxx`). 

### Accessor methods

The following ("member const") methods don't modify instances.

#### beats()

Get the number of beats in this rhythm.

#### beatPulses()

Get an array of index numbers of beats in this rhythm.

#### first()

Get the position the the first beat, or `undefined` if the rhythm is empty.

~~~js
rhythm.first() === rhythm.beatPulses()[0]
~~~

#### empty()

Get whether the rhytm contains no beats.

#### durations()

Return an array of durations between beats, starting with the first beat.

#### divisor()

Get greatest common divisor of all durations. Returns 1 if the rhythm cannot be
deflated or if the first pulse is not a beat. Returns the length of the rhytm
for an empty rhythm.

#### repetitions()

Get number of repetitions.

#### shuffled()

Check whether the rhythm is shuffled. That is the pulses can be organized in groups of three pulses where the second pulse of each group is a rest.

~~~js
Rhythm.fromPattern("x--x-x").shuffled() // true
Rhythm.fromPattern("xx-x-x").shuffled() // false
~~~

#### odd()

Check whether the rhythm is odd (cannot be split at beats into two parts of equal length).

#### core()

Check whether the rhythm is normalized to its core rhythm.

#### rotations()

Calculate all rotations by pulse. Returns a Set of pattern strings.

#### beatRotations()

Calculate all rotations by beat. Returns a Set of pattern strings.

#### toString()

Stringify the rhythm with "x" for beat and "-" for rest.

#### toDurationString(sep)

Stringify the durations of the beat, separated by `sep` (`+` by default) and
preceded by more of this character if the first pulse is not a beat.

## Comparator methods

#### compare(rhythm)

Compare two rhythms, first by length, then lexicographically by its durations.
The argument is parsed if it is no Rhythm object.

#### equivalent(rhythm)

Check whether this rhythm is equivalent to another, possibly under rotation.
The argument is parsed if it is no Rhythm object.

#### equals(rhythm)

Whether the rythm is equal to another rythm (same length, same pulses). The
argument is parsed if it is no Rhythm object.

#### rotated(rhythm)

Get the rotation number if this rhythm is equivalent to another, or undefined otherwise.

#### includes(rhythm)

Whether a rhythm has same length and same beats (plus maybe more) than another rhythm.

### Modifying methods

#### beat(...durations)

Add one or more beats with given duration(s) or one pulse if no parameter is given. 

#### rest(duration)

Add a rest with given `duration` in pulses.

#### replace(...rhythm)

Change the rhytm in-place. Takes same arguments as [the constructor](#new), except a single number is read is one pulse instead of a number of pulses.

#### deflate(divisor)

Deflate the rhythm if it has a [divisor](#divisor) > 1. The optional parameter must be a prime of the divisor.

#### inflate(n)

Inflate the rhythm. Each pulse is replaced by `n` pulses with default `n=2`.

#### repeat(n)

Repeat the rhythm `n` times (default 2 to duplicate it).

#### cut(n)

Reduce the rhythm by removal of all repetitions or to a smaller number `n` of repetitions. Does nothing if `n` is larger than [repetitions()](#repetitions). 

`cut(n)` results in the same as `cut().repeat(n)` 

~~~js
Rhythm.fromPattern("x-x-x-x-").cut()  // => Rhythm[1,0]
Rhythm.fromPattern("x-x-x-x-").cut(1) // => Rhythm[1,0,1,0]
Rhythm.fromPattern("x-x-x-x-").cut(2) // => Rhythm[1,0,1,0]
Rhythm.fromPattern("x-x-x-x-").cut(3) // => Rhythm[1,0,1,0,1,0]
~~~

#### complement()

Convert rhythm into its complement by swapping beats and rests.

#### shuffle()

If the rhythm can be grouped into groups of two pulses, each of these groups is replaced by three pulses, the second one being a rest.

~~~js
Rhythm.fromPattern("x-xx").shuffle() // => "x--x-x"
~~~

#### unshuffle()

Remove the middle rest of each triple group if the rhythm is [shuffled](#shuffled). Does nothing otherwise.

#### rotate(pulses)

Rotate the rhythm `pulses` number of pulses to the right (1 by default), or to the left if `pulses` is negative.

```js
Rhythm.fromPattern("x--x-").rotate(1) // => Rhythm[0,1,0,0,1]
```

#### rotateBeats(beats)

Rotate the rhythm one or more beats to the right.

If the first pulse is not a beat, the rhythm is first rotated to do so, so rotation by zero
beats will rotate the first beat to the first pulse.

#### normalize()

Normalize to a core rhythm by rotating, deflation, and cutting repetitions.


### Static methods

### isBeat(value)

Return whether a variable is read as beat. This is true for every true
value except for the characters space, underscore, dot, zero, and minus.

### isDurationsString(str)

Return whether a `string` specifies a rhythm in form of durations with optional rotation.

~~~js
if (Rhythm.isDurationString(s)) {
  rhythm = Rhythm.fromDurations(s)
}
~~~

### parse(...rhythm)

Read a `string`, an `Array`, or a list of values as rhythm and returns an Array of pulses.

## Maintainers

- [@nichtich](https://github.com/nichtich) (Jakob Voß)

## Contributing

Contributions are welcome! Best use [the rhythmicon issue tracker](https://github.com/nichtich/rhythmicon/issues) for questions, bug reports, and/or feature requests!

## License

MIT license
