import fs from "fs"
import yaml from "js-yaml"

function parse(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (match) {
    const data = yaml.load(match[1])
    return { ...data, text: text.slice(match[0].length).trim() }
  } else {
    return { text }
  }
}

const kind = process.argv[2]

const data = {}
fs.readdirSync(kind)
  .filter(f => f.match(/\.md$/) && f !== "README.md")
  .sort((x,y) => x.length == y.length ? x.localeCompare(y) : x.length - y.length)
  .forEach(file =>  {
    const [pattern] = file.split(".")
    const text = fs.readFileSync(`${kind}/${file}`, { encoding: "utf8" })
    // TODO: fetch data from Wikidata
    // TODO: precompute properties?
    data[pattern] = { ...parse(text), pattern }
  })

fs.writeFileSync(`${kind}.json`, JSON.stringify(data,0,2))
