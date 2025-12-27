import gbv from "eslint-config-gbv"
import pluginVue from "eslint-plugin-vue"
import { includeIgnoreFile } from "@eslint/compat"
import { fileURLToPath } from "node:url"

export default [
  includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
  ...gbv,
  ...pluginVue.configs["flat/recommended"],
  // TODO:  { "vue/require-default-prop": false }
]
