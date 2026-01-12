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
        * [.replace()](#Rhythm+replace)
        * [.beat([...durations])](#Rhythm+beat)
        * [.rest([duration])](#Rhythm+rest)
        * [.compare()](#Rhythm+compare)
        * [.durations()](#Rhythm+durations)
        * [.divisor()](#Rhythm+divisor)
        * [.rotate(pulses)](#Rhythm+rotate)
        * [.beats()](#Rhythm+beats)
        * [.beatPositions()](#Rhythm+beatPositions)
        * [.first()](#Rhythm+first)
        * [.empty()](#Rhythm+empty)
        * [.toString()](#Rhythm+toString)
        * [.rotation()](#Rhythm+rotation)
        * [.equivalent()](#Rhythm+equivalent)
        * [.equal()](#Rhythm+equal)
    * _static_
        * [.isBeat()](#Rhythm.isBeat)
        * [.parse()](#Rhythm.parse)
        * [.euclidean(beats, pulses)](#Rhythm.euclidean)
* [Maintainers](#maintainers)
* [Contributing](#contributing)
* [License](#license)

## Background

Class [Rhythm] implements a simplified model of musical rhythms. Every rhythm is an array of pulses, each being either a beat (value `1`) or a rest (value `0`).

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
This is a subclass of Array.

<a name="new_Rhythm_new"></a>

### new Rhythm()
Create a new Rhythm.

**Example**  
```js
Rhyth("x--x--x-")
Rhythm("|RL-RRL--|")
Rhyth([1,0,0,1,0,0,1,0])
Rhyth("1","_","_","+","_","_","4","_")

Rhythm(n) // empty rhythm of length n
```
<a name="Rhythm+replace"></a>

### rhythm.replace()
Change the rhytm in-place. Takes same arguments as constructor but a single number is not
read as number of pules.

<a name="Rhythm+beat"></a>

### rhythm.beat([...durations])
Add one or more beats with given durations.


| Param | Type | Default |
| --- | --- | --- |
| [...durations] | <code>number</code> | <code>1</code> | 

<a name="Rhythm+rest"></a>

### rhythm.rest([duration])
Add a rest with given duration.


| Param | Type | Default |
| --- | --- | --- |
| [duration] | <code>number</code> | <code>1</code> | 

<a name="Rhythm+compare"></a>

### rhythm.compare()
Compare two rhythms, first by length, then lexicographically.

<a name="Rhythm+durations"></a>

### rhythm.durations()
Return an array of durations between beats, starting with the first beat.

<a name="Rhythm+divisor"></a>

### rhythm.divisor()
Get greatest common divisor of all durations.
Always returns 1 if the the first pulse is not a beat.
Returns the length of the rhytm is empty.

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

### rhythm.rotation()
Get rotation number to make this rhythm into another, or undefined.

<a name="Rhythm+equivalent"></a>

### rhythm.equivalent()
Check whether this rhythm is equivalent to another, possibly under rotation.

<a name="Rhythm+equal"></a>

### rhythm.equal()
Whether the rythm is equal to another rythm.

<a name="Rhythm.isBeat"></a>

### Rhythm.isBeat()
Return whether a variable is read as beat. This is true for every true
value except for the characters space, tab, underscore, dot and minus.

<a name="Rhythm.parse"></a>

### Rhythm.parse()
Read a string, an array, or a list of values as rhythm.

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
