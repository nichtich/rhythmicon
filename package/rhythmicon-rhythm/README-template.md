# rhythmicon-rhythm

[![NPM package name](https://img.shields.io/badge/npm-rhythmicon--rhythm-blue.svg)](https://www.npmjs.com/package/rhythmicon-rhythm)

> Analyze and compute rhythmic patterns

This Node package implements class [Rhythm](#Rhythm) to store, analyze and manipulate rhythms. 

## Table of Contents

* [Background](#background)
* [Install](#install)
* [Usage](#usage)
{{#class name="Rhythm"}}
{{>member-index-grouped~}}
{{/class}}
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


{{#class name="Rhythm"}}
{{>header~}}
{{>body}}
{{>separator~}}
{{>members}}
{{/class}}

## Maintainers

- [@nichtich](https://github.com/nichtich) (Jakob Voß)

## Contributing

Contributions are welcome! Best use [the rhythmicon issue tracker](https://github.com/nichtich/rhythmicon/issues) for questions, bug reports, and/or feature requests!

## License

MIT license
