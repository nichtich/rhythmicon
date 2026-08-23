import * as yaml from "js-yaml"

export function yamlHeaderMarkdown(markdown) {
  let data = {}
  let match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (match) {
    data = yaml.load(match[1])
  } else {
    match = markdown.match(/^#(.*)\r?\n/)
    if (match) {
      data = { name: match[1].trim() }
    }
  }
  if (match) {
    markdown = markdown.slice(match[0].length).trim()
  }
  return { ...data, markdown }
}

export function routerQuery(url) {
  if (url[0] === "?") {
    url = URL.parse(url,"http://example.org/")
    if (url) {
      return Object.fromEntries(url.searchParams.entries())
    }
  }
}
