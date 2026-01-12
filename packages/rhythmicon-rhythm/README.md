# rhythmicon-rhythm

> Analyze and compute rhythmic patterns

This Node package implements class [Rhythm] to store, analyze and manipulate rhythms. 

## Table of Contents

* [Background](#background)
* [Install](#install)
* [Usage](#usage)
* [Rhythm](#Rhythm)
    * [new Rhythm()](#new_Rhythm_new)
    * _instance_
        * [.replace(rhythm)](#Rhythm+replace)
        * [.beat(...durations)](#Rhythm+beat)
        * [.rest(duration)](#Rhythm+rest)
        * [.compare(rhythm)](#Rhythm+compare)
        * [.durations()](#Rhythm+durations)
        * [.divisor()](#Rhythm+divisor)
        * [.condense(divisor)](#Rhythm+condense)
        * [.expand(n)](#Rhythm+expand)
        * [.repetitions()](#Rhythm+repetitions) ⇒ <code>number</code>
        * [.cut()](#Rhythm+cut)
        * [.shuffle()](#Rhythm+shuffle)
        * [.unshuffle()](#Rhythm+unshuffle)
        * [.isShuffle()](#Rhythm+isShuffle)
        * [.rotate(pulses)](#Rhythm+rotate)
        * [.rotateBeat(pulses)](#Rhythm+rotateBeat)
        * [.beats()](#Rhythm+beats)
        * [.beatPositions()](#Rhythm+beatPositions)
        * [.first()](#Rhythm+first)
        * [.empty()](#Rhythm+empty)
        * [.toString()](#Rhythm+toString)
        * [.rotation(rhythm)](#Rhythm+rotation)
        * [.equivalent(rhythm)](#Rhythm+equivalent)
        * [.equal(rhythm)](#Rhythm+equal)
    * _static_
        * [.isBeat(x)](#Rhythm.isBeat)
        * [.parse()](#Rhythm.parse)
        * [.euclidean(beats, pulses)](#Rhythm.euclidean)
* [Maintainers](#maintainers)
* [Contributing](#contributing)
* [License](#license)

## Background

Class [Rhythm](#Rhythm) implements a simplified model of musical rhythms. Every rhythm is an array of pulses, each being either a beat (value `1`) or a rest (value `0`). For instance the tresillo rhythm is Array `[1,0,0,1,0,0,1,0]`.

See [@tonaljs/rhythm-pattern](https://www.npmjs.com/package/@tonaljs/rhythm-pattern) for a similar (more limited) library.

## Install

This packages comes as single file without dependencies.

...

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
<a name="Rhythm+replace"></a>

### rhythm.replace(rhythm)
Change the rhytm in-place. Takes same arguments as constructor but a single number is not
read as number of pules.


| Param |
| --- |
| rhythm | 

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
Always returns 1 if the the first pulse is not a beat.
Returns the length of the rhytm is empty.

<a name="Rhythm+condense"></a>

### rhythm.condense(divisor)
Get whether the rhythm is condense.


| Param | Type | Default |
| --- | --- | --- |
| divisor | <code>number</code> | <code>this.divisor</code> | 

<a name="Rhythm+expand"></a>

### rhythm.expand(n)
Expand the rhythm. Each pulse is replaced by n pulses.


| Param | Type | Default |
| --- | --- | --- |
| n | <code>number</code> | <code>2</code> | 

<a name="Rhythm+repetitions"></a>

### rhythm.repetitions() ⇒ <code>number</code>
Get number of repetitions.

<a name="Rhythm+cut"></a>

### rhythm.cut()
...

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
Rotate the rhythm one pulse to the right.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pulses | <code>number</code> | <code>1</code> | positive or negative number |

**Example**  
```js
(new Rhythm(1,0,0,1,0)).rotate(1) // => [0,1,0,0,1]
```
<a name="Rhythm+rotateBeat"></a>

### rhythm.rotateBeat(pulses)
...


| Param | Type | Default |
| --- | --- | --- |
| pulses | <code>number</code> | <code>1</code> | 

<a name="Rhythm+beats"></a>

### rhythm.beats()
Get the number of beats in this rhythm.

<a name="Rhythm+beatPositions"></a>

### rhythm.beatPositions()
Get index numbers of beats.

<a name="Rhythm+first"></a>

### rhythm.first()
Get the position the the first beat, or null if the rhythm is empty.

<a name="Rhythm+empty"></a>

### rhythm.empty()
Get whether the rhytm contains no beats.

<a name="Rhythm+toString"></a>

### rhythm.toString()
Stringify the rhythm with "x" for beat and "-" for rest.

<a name="Rhythm+rotation"></a>

### rhythm.rotation(rhythm)
Get rotation number to make this rhythm into another, or undefined.


| Param |
| --- |
| rhythm | 

<a name="Rhythm+equivalent"></a>

### rhythm.equivalent(rhythm)
Check whether this rhythm is equivalent to another, possibly under rotation.


| Param |
| --- |
| rhythm | 

<a name="Rhythm+equal"></a>

### rhythm.equal(rhythm)
Whether the rythm is equal to another rythm.


| Param |
| --- |
| rhythm | 

<a name="Rhythm.isBeat"></a>

### Rhythm.isBeat(x)
Return whether a variable is read as beat. This is true for every true
value except for the characters space, tab, underscore, dot and minus.


| Param | Type |
| --- | --- |
| x | <code>value</code> | 

<a name="Rhythm.parse"></a>

### Rhythm.parse()
Read a string, an array, or a list of values as rhythm.


| Param |
| --- |
| ...rhythm | 

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

Contributions are welcome! Best use [the issue tracker](https://github.com/nichtich/rhythmicon/issues) for questions, bug reports, and/or feature requests!

## License

MIT license
