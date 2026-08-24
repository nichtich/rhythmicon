# A theory of Rhythms

> A rhythm is a repeated pulsation, a string of evenly spaced pulses, some of which are sounded (beats) while other are silent (rests)\
--- [@toussaint2013, page 5]

There are 2<sup><i>n</i></sup> possible rhythms in a sequence of _n_ pulses. For instace two pulses can be played in four ways: `--`, `x-`, `-x`, `xx`. When played repeatedly, these rhythms can be reduced to `-` and `x` unless *additional* information is provided to indicate length of a pulse and start of pulsation. Rhythmic patterns can be reduced in three ways:

1. the same pattern repeated multiple times can be *cut*: for instance `x-xx-x` can be cut to `x-x`
2. if all durations share a common divisor, the rhythm can be *deflated*: for instance `x---x-x-` (4+2+2) can be deflated to `x-xx` (2+1+1)
3. a pattern with more than one pulse can be *rotated* to start on a different pulse: for instance `-x` is rotated variant of `x-`.

## Number of core rhythms

A non-reducible rhythmic pattern with at least one pulse is called a [*core rhythm*](?category=core). In mathematical terms, the total number of **core rythms** in *n* pulses is the "number of relatively prime aperiodic necklaces of positive integers with sum n" ([A318731](https://oeis.org/A318731)).

pulses | core rhythms | examples
------:|--------------:|------
 1 | 1 | `x` only
 2 | 0 | all reduced to `-` or `x`
 3 | 1 | `x-x`
 4 | 2 | `x--x` and `x-xx`
 5 | 5 | `x---x`, `x--x-`, `x--xx`, `x-x-x`, `x-xxx`
 6 | 7 | `x--x-x`
 7 | 17 | `x-x-x-x` 
 8 | 27 | `x--x--x-`
 9 | 54 | `x--x-xxxx`
10 | 93 | `x--x--x-x-`
11 | 185 | `x---x--xx-x`
12 | 324 | `x--x--x-x-x-`

The number of practical core rhythms is much smaller for various reasons how rhythm is perceived. Possible limit to consider include the ratio of number of beats and number of pulses and the maxium duration. One can argue that two durations larger than 3 are uncommon, except for powers of 2 or 3 (Mike Keith):

> One facet of meter which is important, both perceptually and mathematically, is that meters with n>4 tend to be interpreted by a listener as combinations of 2's and 3's

