<script setup>
import { computed, ref } from "vue"
import { routerQuery } from "../lib/utils.js"

import markdownit from "markdown-it"
import citations from "markdown-it-citations"
import * as CSL from "citeproc"

import RhythmLink from "./RhythmLink.vue"

const props = defineProps({ markdown: String })

const citationPlugin = {
  citeproc() {
    const citeproc = new CSL.Engine(...citeprocConfig.value)
    citeproc.setOutputFormat("html")
    const citationClusters = []

    return {
      appendCluster(cluster) {
        citationClusters.push(cluster.map(item => {
          const { citationId, citationMode, citationPrefix, citationSuffix } = item
          return {
            id: citationId,
            prefix: citationPrefix.map(s => s.content).join(""),
            suffix: citationSuffix.map(s => s.content).join(""),
            ["suppress-author"]: citationMode === "SuppressAuthor",
          }
        }))
      },
      renderCluster() {
        const citationItems = citationClusters.shift()
        const res = citeproc.processCitationCluster({ citationItems }, "", "")[1]
        return res.map(b => b[1]).join("\n")
      },
      renderBibliography() {
        const [{bibstart, bibend}, items] = citeproc.makeBibliography()
        return items.length ? `<h2>References</h2>\n${bibstart}${items.join("")}${bibend}` : ""
      },
    }
  },
}

const RE = /^\|?[x-][x-]*\|?$/i
const MD = markdownit({ typographer: true, html: true })

MD.use(md => {
  md.core.ruler.push("rhythmlinks", state => {
    state.tokens.forEach(({type,children}) => {
      if (type === "inline" && children) {
        let link
        for (let i = 0; i < children.length; i++) {
          const { type, content } = children[i]          
          if (type == "code_inline" && RE.test(content)) {
            const patternText = content.replaceAll("|","")
            const pattern = patternText.replaceAll(/[^-]/gi,"x")
            const linkOpen = new state.Token("link_open", "RhythmLink", 1)
            linkOpen.attrs = [ [":pattern", `"${pattern}"`] ]
            const text = new state.Token("text", "", 0)
            text.content = patternText
            const linkClose = new state.Token("link_close", "RhythmLink", -1)
            children.splice(i++,1,linkOpen,text,linkClose)
          } else if (type ==="link_open") { // inject RouterLink for internal links
            const [href] = children[i].attrs.map(([k,v]) => k === "href" ? v : null).filter(v=>v)
            const query = routerQuery(href || "")
            if (query) {
              link = new state.Token("link_open", "RouterLink", 1)
              link.attrs = [ [":to", `{ query: ${JSON.stringify(query)} }`] ]
              children[i] = link
            }
          } else if (type === "link_close" && link) {
            children[i] = new state.Token("link_close", "RouterLink", -1)
            link = null
          }
        }
      }
    })
  })
})

const citeprocConfig = ref()

Promise.all([
  fetch("./chicago.csl").then(res => res.text()),
  fetch("./locales-en-GB.xml").then(res => res.text()),
  fetch("./references.json").then(res => res.json()),
]).then(([style, locale, references]) => {
  references = Object.fromEntries(references.map(r => [r.id,r]))
  citeprocConfig.value = [
    {
      retrieveLocale: () => locale,
      retrieveItem: id => references[id] || null },
    style,
  ]
  MD.use(citations, citationPlugin)
})


const template = computed(() => {
  if (props.markdown) {
    if (citeprocConfig.value) {
      // with citations
      return MD.render(props.markdown)
    } else { 
      // preview without citations
      return MD.render(props.markdown)
    }
  } 
  return ""
})

</script>
<template>
  <component :is="{ template, components: { RhythmLink } }" v-if="markdown" />
</template>
