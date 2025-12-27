import gbv from "eslint-config-gbv"
import pluginVue from "eslint-plugin-vue"
import { includeIgnoreFile } from "@eslint/compat"
import { fileURLToPath } from "node:url"

export default [
  includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
  ...gbv,
  ...pluginVue.configs["flat/recommended"],
  { 
    rules: {
      "vue/require-default-prop": "off",
      "vue/max-attributes-per-line": ["error", {
        singleline: {
          max: 4,
        },      
        multiline: {
          max: 2,
        },
      }],
    }, 
  },
]
