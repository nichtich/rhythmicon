# rhythmicon-rhythm

[![NPM package name](https://img.shields.io/badge/npm-rhythmicon--rhythm-blue.svg)](https://www.npmjs.com/package/rhythmicon-rhythm)

> Analyze and compute rhythmic patterns

This Node package implements class [Rhythm](#Rhythm) to store, analyze and manipulate rhythms. 

## Table of Contents

* [Background](#background)
* [Install](#install)
* [Usage](#usage)
* [Rhythm](#Rhythm)
    * [new Rhythm()](#new_Rhythm_new)
    * _instance_
        * [.beat(...durations)](#Rhythm+beat)
        * [.rest(duration)](#Rhythm+rest)
        * [.replace(...rhythm)](#Rhythm+replace)
        * [.compare(rhythm)](#Rhythm+compare)
        * [.durations()](#Rhythm+durations)
        * [.divisor()](#Rhythm+divisor)
        * [.repetitions()](#Rhythm+repetitions) ⇒ <code>number</code>
        * [.deflate(divisor)](#Rhythm+deflate)
        * [.inflate(n)](#Rhythm+inflate)
        * [.repeat()](#Rhythm+repeat)
        * [.cut()](#Rhythm+cut)
        * [.copy()](#Rhythm+copy)
        * [.rotations(beat)](#Rhythm+rotations) ⇒ <code>array</code>
        * [.core()](#Rhythm+core)
        * [.shuffle()](#Rhythm+shuffle)
        * [.unshuffle()](#Rhythm+unshuffle)
        * [.isShuffle()](#Rhythm+isShuffle)
        * [.rotate(pulses)](#Rhythm+rotate)
        * [.rotateBeats(beats)](#Rhythm+rotateBeats)
        * [.beats()](#Rhythm+beats)
        * [.beatPulses()](#Rhythm+beatPulses)
        * [.first()](#Rhythm+first)
        * [.empty()](#Rhythm+empty)
        * [.toString()](#Rhythm+toString)
        * [.toDurationString()](#Rhythm+toDurationString)
        * [.normalize()](#Rhythm+normalize)
        * [.rotation(rhythm)](#Rhythm+rotation)
        * [.equivalent(rhythm)](#Rhythm+equivalent)
        * [.equals(rhythm)](#Rhythm+equals)
    * _static_
        * [.isBeat(value)](#Rhythm.isBeat)
        * [.isDurationsString(str)](#Rhythm.isDurationsString)
        * [.parse(rhythm)](#Rhythm.parse) ⇒ <code>array</code>
        * [.fromPattern(pattern)](#Rhythm.fromPattern)
        * [.fromDurations(durations)](#Rhythm.fromDurations)
        * [.euclidean(beats, pulses)](#Rhythm.euclidean)
* [Maintainers](#maintainers)
* [Contributing](#contributing)
* [License](#license)

## Background

Class [Rhythm](#Rhythm) implements a simplified model of musical rhythms. Every rhythm is an array of pulses, each being either a beat (value `1`) or a rest (value `0`). For instance the tresillo rhythm is array `[1,0,0,1,0,0,1,0]`. A rhythm can also be encoded as pattern string (`x--x--x-`) and as durations (array `[3,3,2]` or string `3+3+2`). Rhythms can further be:

- *repeated* and *cut* (e.g. `x-x-x-` can be cut to `x-`)
- *inflated* and *deflated* by a *divisor* (e.g. `x-x` and `x---x-` with divisor 2).
- *rotated* (e.g. `xx-` is rotated `-xx` and `x-x`)
- *shuffled* and *unshuffled* (e.g `x-xx--` is shuffle of `xxx-`)
- *normalized* to a core rhythm

### Related works

- [rhythmicon-vue](package/rhythmicon-vue#readme) is a JavaScript library of Vue components to display and interact with rhythmic patterns
- rhythmicon further contains a collection of rhythms and a web application to analyze and modify rhythmic patterns
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


<a name="Rhythm"></a>

## Rhythm
A rhythm is a sequence of beats and rests, encoded as Array of ones and zeroes.
This is a subclass of [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

<a name="new_Rhythm_new"></a>

### new Rhythm()
Create a new Rhythm.


| Param |
| --- |
| ...rhythm | 

**Example**  
```js
Rhyth("x--x--x-")
Rhythm("|RL-RRL--|")
Rhyth([1,0,0,1,0,0,1,0])
Rhyth("1","_","_","+","_","_","4","_")

Rhythm(n) // empty rhythm of length n
```
<a name="Rhythm+beat"></a>

### rhythm.beat(...durations)
Add one or more beats with given durations.


| Param | Type | Default |
| --- | --- | --- |
| ...durations | <code>number</code> | <code>1</code> | 

<a name="Rhythm+rest"></a>

### rhythm.rest(duration)
Add a rest with given duration.


| Param | Type | Default |
| --- | --- | --- |
| duration | <code>number</code> | <code>1</code> | 

<a name="Rhythm+replace"></a>

### rhythm.replace(...rhythm)
Change the rhytm in-place. Takes same arguments as constructor except a single number is not
read as number of pules.


| Param | Type |
| --- | --- |
| ...rhythm | <code>string</code> \| <code>array</code> | 

<a name="Rhythm+compare"></a>

### rhythm.compare(rhythm)
Compare two rhythms, first by length, then lexicographically.


| Param |
| --- |
| rhythm | 

<a name="Rhythm+durations"></a>

### rhythm.durations()
Return an array of durations between beats, starting with the first beat.

<a name="Rhythm+divisor"></a>

### rhythm.divisor()
Get greatest common divisor of all durations.

Returns 1 if the rhythm cannot be deflated or if the first pulse is not a beat.
Returns the length of the rhytm for an empty rhythm.

<a name="Rhythm+repetitions"></a>

### rhythm.repetitions() ⇒ <code>number</code>
Get number of repetitions.

<a name="Rhythm+deflate"></a>

### rhythm.deflate(divisor)
Deflate the rhythm if it has a divisor > 1.


| Param | Type | Default |
| --- | --- | --- |
| divisor | <code>number</code> | <code>this.divisor</code> | 

<a name="Rhythm+inflate"></a>

### rhythm.inflate(n)
Inflate the rhythm. Each pulse is replaced by n pulses.


| Param | Type | Default |
| --- | --- | --- |
| n | <code>number</code> | <code>2</code> | 

<a name="Rhythm+repeat"></a>

### rhythm.repeat()
Repeat rhythm.

**Params**: <code>number</code> n times  
<a name="Rhythm+cut"></a>

### rhythm.cut()
Remove all repetitions.

<a name="Rhythm+copy"></a>

### rhythm.copy()
Return a copy of this rhythm object.

<a name="Rhythm+rotations"></a>

### rhythm.rotations(beat) ⇒ <code>array</code>
Calculate all rotations.

**Returns**: <code>array</code> - of patterns  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| beat | <code>boolean</code> | <code>false</code> | only consider beat rotations |

<a name="Rhythm+core"></a>

### rhythm.core()
Check if the rhythm is normalized to its core rhythm.

<a name="Rhythm+shuffle"></a>

### rhythm.shuffle()
...

<a name="Rhythm+unshuffle"></a>

### rhythm.unshuffle()
...

<a name="Rhythm+isShuffle"></a>

### rhythm.isShuffle()
...

<a name="Rhythm+rotate"></a>

### rhythm.rotate(pulses)
Rotate the rhythm one or more pulses to the right.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pulses | <code>number</code> | <code>1</code> | positive or negative number |

**Example**  
```js
Rhythm.fromPattern("x--x-").rotate(1) // => [0,1,0,0,1]
```
<a name="Rhythm+rotateBeats"></a>

### rhythm.rotateBeats(beats)
Rotate the rhythm one or more beats to the right.

If the first pulse is not a beat, the rhythm is first rotated to do so, so rotation by zero
beats will shift the first beat to the first pulse.


| Param | Type | Default |
| --- | --- | --- |
| beats | <code>number</code> | <code>1</code> | 

<a name="Rhythm+beats"></a>

### rhythm.beats()
Get the number of beats in this rhythm.

<a name="Rhythm+beatPulses"></a>

### rhythm.beatPulses()
Get index numbers of beats in this rhythm.

<a name="Rhythm+first"></a>

### rhythm.first()
Get the position the the first beat, or null if the rhythm is empty.

<a name="Rhythm+empty"></a>

### rhythm.empty()
Get whether the rhytm contains no beats.

<a name="Rhythm+toString"></a>

### rhythm.toString()
Stringify the rhythm with "x" for beat and "-" for rest.

<a name="Rhythm+toDurationString"></a>

### rhythm.toDurationString()
Stringify the durations of the beat, separated by `+` and 
preceded by more `+` if the first pulse is not a beat.

<a name="Rhythm+normalize"></a>

### rhythm.normalize()
Normalize to a core rhythm by rotating, deflation, and cutting repetitions.

<a name="Rhythm+rotation"></a>

### rhythm.rotation(rhythm)
Get rotation number to make this rhythm into another (or undefined if not possible).


| Param | Type |
| --- | --- |
| rhythm | [<code>Rhythm</code>](#Rhythm) | 

<a name="Rhythm+equivalent"></a>

### rhythm.equivalent(rhythm)
Check whether this rhythm is equivalent to another, possibly under rotation.


| Param | Type |
| --- | --- |
| rhythm | [<code>Rhythm</code>](#Rhythm) | 

<a name="Rhythm+equals"></a>

### rhythm.equals(rhythm)
Whether the rythm is equal to another rythm.


| Param | Type |
| --- | --- |
| rhythm | [<code>Rhythm</code>](#Rhythm) | 

<a name="Rhythm.isBeat"></a>

### Rhythm.isBeat(value)
Return whether a variable is read as beat. This is true for every true
value except for the characters space, tab, underscore, dot and minus.


| Param | Type |
| --- | --- |
| value | <code>any</code> | 

<a name="Rhythm.isDurationsString"></a>

### Rhythm.isDurationsString(str)
Return whether a string specifies durations with optional rotation.


| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="Rhythm.parse"></a>

### Rhythm.parse(rhythm) ⇒ <code>array</code>
Read a string, an array, or a list of values as rhythm.


| Param | Type |
| --- | --- |
| rhythm | <code>string</code> \| <code>array</code> | 

<a name="Rhythm.fromPattern"></a>

### Rhythm.fromPattern(pattern)
Generate a Rhythm from pattern string.


| Param | Type |
| --- | --- |
| pattern | <code>string</code> | 

<a name="Rhythm.fromDurations"></a>

### Rhythm.fromDurations(durations)
Generate a rhythm from an array or string of durations.


| Param | Type |
| --- | --- |
| durations | <code>Array</code> \| <code>string</code> | 

<a name="Rhythm.euclidean"></a>

### Rhythm.euclidean(beats, pulses)
Generate an euclidean rhythm.


| Param | Type | Description |
| --- | --- | --- |
| beats | <code>number</code> | number of beats |
| pulses | <code>number</code> | length of the rhythm |


## Maintainers

- [@nichtich](https://github.com/nichtich) (Jakob Voß)

## Contributing

Contributions are welcome! Best use [the rhythmicon issue tracker](https://github.com/nichtich/rhythmicon/issues) for questions, bug reports, and/or feature requests!

## License

MIT license
