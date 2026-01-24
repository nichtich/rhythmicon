# rhythmicon-vue

[![NPM Version](https://img.shields.io/npm/v/rhythmicon-vue)](https://www.npmjs.com/package/rhythmicon-vue)

> Vue components to display and interact with rhythmic patterns

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Components](#components)
  - [RhythmSequencer](#rhythmsequencer)
  - [RhythmInput](#rhythminput)
  - [RhythmControls](#rhythmcontrols)
  - [RhythmCircle](#rhythmcircle)
  - [RhythmScore](#rhythmscore)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```bash
npm install rhythmicon-vue
```

## Usage

~~~js 
import { RhythmSequencer, RhythmInput, RhythmControls,
         RhythmCircle, RhythmScore } from "rhythmicon-vue"
~~~

## Components

Rhythms must be provided as array of pulses, each being either a beat (value `1`) or a rest (value `0`), for instance `[1,0,0,1,0,0,1,0]` for the tresillo rhythm. See package `rhythmicon-rhythm` for an extension of this data structure as class.

### RhythmSequencer

A row of buttons representing the pulses of a Rhythm. Pulses can be toggled to represent a beat or a rest.

~~~html
<RhythmSequencer :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
~~~

![](img/rhythm-sequencer.png)

**Properties:**

- `rhythm`: the rhythm to display (Array or instance of Rhythm)
- `pulse`: index of the currently active pulse (optional)
- `@toggle`: event emitted when a pulse is toggled


### RhythmInput

A text input field to show and edit a rhythm pattern. Editing is submitted on *Enter* or aborted on *Esc*. Rhythm can be entered in form of beats and rests (e.g. `x--x--x-`) or in form of durations (e.g. `3+3+2` or `++3+2+3` for rotated variant `--x--x-x`). The input is normalized to characters `x` for beat (from any letter) and `-` for rest (from characters `.`, `_`, `-`). Whitespace is ignored. Display mode can be switched between beats/rests and durations with arrow up/down on valid input.

~~~html
<RhythmInput v-model="rhythm" />
~~~

The layout can be configured with the following **CSS classes**:

- `rhythm-input` for the input element

### RhythmControls

A row of buttons to modify a rhythm.

~~~html
<RhythmControls v-model="rhythm" max="64" />
~~~

![](img/rhythm-controls.png)

- `<` and `>` to rotate the rhythm one pulse left or right
- `⋖` and `⋗` to rotate the rhythm one beat left or right
- `+` and `-` to add or remove a pulse at the end
- `⇅` to complement the rythm
- `⇆` to reverse the rhythm
- `𝄎` and `𝄍` to repeat or cut the rhythm
- `×2` and `×3` to inflate the rhythm
- `÷n` to deflate the rhythm
- `²=³` and `³=²` to shuffle or unshuffle the rhythm

**Properties:**

- `max`: maximum number of pulses the rhythm is allowed to get. Set to 128 by default.

The layout can be configured with the **CSS classe**:

- `rhythm-controls` for the wrapper element, containing a list of `button` elements


### RhythmCircle

A circular visualization of a rhythm as SVG image. Pulses are spread evenly around the circle as dots. A pulse can be toggled to represent a beat or a rest by clicking on the dot.

~~~html
<RhythmCircle :rhythm="rhythm" :pulse="pulse" @toggle="toggle" />
~~~

![](img/rhythm-circle.png)

**Properties:**

- `rhythm`: the rhythm to display (Array or instance of Rhythm)
- `pulse`: index of the currently active pulse (optional)
- `@toggle`: event emitted when a pulse is toggled

The layout can be configured with the following **CSS classes**:

- `rhythm-circle` for the SVG root element
- `beat-dot` for a dot representing a beat
- `rest-dot` for a dot representing a rest
- `active` for the active dot when property `pulse` is set
- `polygon` for the inner polygon connecting beat dots

## RhythmScore

A staff with notes and rests to show a rhythm.

*Details depend on time signature, this is still being worked on!*

Requires the [Bravura font](https://www.smufl.org/fonts/) to be loaded.

~~~html
<RhythmScore :rhythm="rhythm" />
~~~

![](img/rhythm-score.png)

**Properties:**

- `rhythm`: the rhythm to display (Array or instance of Rhythm)
- `pulse`: index of the currently active pulse (optional)
- `@toggle`: event emitted when a note or rest is clicked on

*Implementation is based on an [idea by Stephen Band](https://cruncher.ch/blog/printing-music-with-css-grid/). See his library [Scribe](https://github.com/stephband/scribe/) for a more sophisticated music rendering!*

## Maintainers

- [@nichtich](https://github.com/nichtich) (Jakob Voß)

## Contributing

Contributions are welcome! Best use [the rhythmicon issue tracker](https://github.com/nichtich/rhythmicon/issues) for questions, bug reports, and/or feature requests!

## License

MIT license
