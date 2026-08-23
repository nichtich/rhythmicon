# Collection of Rhythms

Each file is named by the pattern of the rhythm and file extension `.md`, for instance [`x--x--x-.md`](x--x--x-.md) for tresillo rhythm. The file can contain arbitrary text in Markdown syntax, optionally preceeded by a YAML header demarcated by three dashes (`---`) on either end.

The text may reference other rhythms with this syntax: `` `x-xx` `` (pattern enclosed in `` ` ``).

## Example

~~~yaml
---
name: tresillo
wikidata: Q65089548
---

Propably the most common, non-trivial rhythm.
~~~

## Metadata fields

Each rhythms can be described with the following YAML fields:

- a `name`
- multiple `alias` names
- a corresponding `wikidata` Q-identifier
- a list of notable `works` (in Markdown syntax)
- a list of `category`
- a list of `source`

## Contributing

Contributions to the directory of rhythms are welcome at <https://github.com/nichtich/rhythmicon/tree/main/rhythms> (best requires at GitHub account)!

## Maintainer

Jakob Voß <https://github.com/nichtich/>

## License

CC0 (but proper referencing would be nice)
