<script setup>
import { computed } from "vue"
import { routerQuery } from "../lib/utils.js"

import markdownit from "markdown-it"
import RhythmLink from "./RhythmLink.vue"

const props = defineProps({ markdown: String })

const RE = /^\|[x-][x-]*\|+$/i
const MD = markdownit({ typographer: true, html: true })

MD.use(md => {
  md.core.ruler.push("rhythmlinks", state => {
    state.tokens.forEach(({type,children}) => {
      if (type === "inline" && children) {
        let link
        for (let i = 0; i < children.length; i++) {
          const { type, content } = children[i]          
          if (type == "code_inline" && RE.test(content)) {
            const patternText = content.slice(1,content.length-1)
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

const template = computed(() => props.markdown
  ? `<div>${MD.render(props.markdown)}</div>` : "")

</script>
<template>
  <component :is="{ template, components: { RhythmLink } }" v-if="markdown" />
</template>
