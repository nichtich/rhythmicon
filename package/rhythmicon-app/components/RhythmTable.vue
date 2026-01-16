<script setup>
import RhythmLink from "./RhythmLink.vue"

const props = defineProps({
  rhythms: {
    type: Object,
    required: true,
  },
  categories: {
    type: Set,
    default: () => new Set(),
  },
})

const emit = defineEmits(["selectCategory"])

function handleCategoryClick(category) {
  if (!props.categories.has(category)) {
    emit("selectCategory", category)
  }
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th />
        <th>name</th>        
        <th>pattern</th>
        <th>durations</th>
        <th>categories</th>        
        <th>properties</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(rhythm, pattern) in rhythms" :key="pattern">
        <td style="text-align:right; padding-right: 1em;">
          <small>{{ rhythm.beats }}/{{ pattern.length }}</small>
        </td>
        <td>
          <span v-if="rhythm.name">{{ rhythm.name }}</span>
        </td>
        <td>
          <rhythm-link :pattern="pattern" />
        </td>
        <td>
          {{ rhythm.durations.join("+") }}
        </td>                
        <td>
          <ul v-if="rhythm.category.size" class="inline">
            <li
              v-for="c of rhythm.category" :key="c"
              :class="{ 'category': true, 'active': categories.has(c), 'clickable': !categories.has(c) }"
              :title="categories.has(c) ? '' : `Click to filter by ${c}`"
              @click="handleCategoryClick(c)"
            >
              {{ c }}
            </li>
          </ul>
        </td>
        <td>
          <ul class="inline">
            <li v-if="rhythm.euclidean">
              E({{ rhythm.beats }},{{ rhythm.length }})
            </li>
            <li v-if="rhythm.divisor > 1">
              expanded ÷{{ rhythm.divisor }} 
            </li>
            <li v-if="rhythm.repetitions > 1">
              repeated ×{{ rhythm.repetitions }}
            </li>
            <li v-if="rhythm.first">
              shifted
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.category.active {
  font-weight: bold;
}
.category:hover {
  cursor: pointer;
  text-decoration: underline;  
}
th { text-align: left; }
ul.inline {
  display: inline;
  list-style: none;
  padding-left: 0;
}
ul.inline li {
  display: inline;
  font-size: 80%;
}
ul.inline li + li:before {
  content: ", ";
}
</style>
