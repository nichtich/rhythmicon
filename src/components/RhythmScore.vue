<script setup>
import { computed } from 'vue'

const props = defineProps({
  rhythm: { type: [Array, Object], required: true },
  pulse: { type: Number, default: undefined }
})

const meter = computed(() => {
  const l = props.rhythm.length
  if (l <= 4) {
    return [l,4]
  } else {
    return [l,8]
  }
})

const length = computed(() => props.rhythm.length || 0)

const signatureDigits = (num) => `${num}`.split('').map(d => String.fromCharCode(0xE080 + parseInt(d))).join('')
const timeSignature = computed(() => meter.value.map(n => signatureDigits(parseInt(n))))

const renderedElements = computed(() => {
  const els = []
  const len = length.value
  const useEighths = meter.value[1] >= 8
  
  for (let i = 0; i < len; i++) {
    const isBeat = props.rhythm[i]
    if (isBeat) {
      els.push({
        type: 'note',
        index: i,
        glyph: useEighths ? '\uE1D7' : '\uE1D5',
        span: 1
      })
    } else {
      // Rests
      // Combine two eighth rests into a quarter rest if starting on even pulse
      if (useEighths && i % 2 === 0 && i + 1 < len && !props.rhythm[i+1]) {
        els.push({
          type: 'rest',
          index: i,
          glyph: '\uE4E5', // Quarter rest
          span: 2
        })
        i++ // Skip next pulse
      } else {
        els.push({
          type: 'rest',
          index: i,
          glyph: useEighths ? '\uE4E6' : '\uE4E5',
          span: 1
        })
      }
    }
  }
  return els
})
</script>

<template>
  <div class="score-renderer bravura">
    <div class="stave">
      <div class="stave-line"></div>      
      <div class="spacer" style="grid-column: 1"></div>
      <span class="clef" style="grid-column: 2">&#xe069;</span>
      <div class="time-sig" style="grid-column: 3">
        <span class="time-sig-num">{{ timeSignature[0] }}</span>
        <span class="time-sig-den">{{ timeSignature[1] }}</span>
      </div>
      
      <span 
        v-for="(el, k) in renderedElements" 
        :key="k"
        :class="[el.type, { active: pulse >= el.index && pulse < el.index + el.span }]"
        :style="{ 
          gridColumnStart: el.index + 4,
          gridColumnEnd: `span ${el.span}`
        }"
      >
        {{ el.glyph }}
      </span>

      <span class="repeat-sign" :style="{ gridColumnStart: length + 4 }">&#x1d107;</span>
    </div>
  </div>
</template>

<style scoped>
.score-renderer {
  font-family: Bravura;
  font-size: 2.5rem;
  padding: 0 1rem;
  line-height: 7rem;
}

.stave {
  display: inline-grid;
  /* Col 1: Spacer (0.25em), Col 2: Clef, Col 3: TimeSig, Col 4+: Rhythm pulses (1em), End: Repeat */
  grid-template-columns: 0.25em max-content max-content repeat(v-bind(length), 1em) max-content;
  align-items: center;
  position: relative;
  height: 1em; 
  align-items: center; 
}

.stave-line {
  grid-column: 1 / -1;
  grid-row: 1;
  height: 2px;
  background: currentColor;
  width: 100%;
  z-index: 0;
  align-self: center;
  margin-top: -1px; 
}

.spacer {
  height: 100%;
}

.clef, .note, .rest, .time-sig, .repeat-sign {
  grid-row: 1;
  z-index: 1;
  line-height: 0; 
  display: flex;
  align-items: center; 
  justify-content: center;
  height: 0; 
  align-self: center;
  transform: none; 
}

.clef {
  margin-right: 0.25em;
}

.time-sig {
  display: flex;
  flex-direction: column;
  line-height: 1; /* Reset line height for digits */
  height: auto; /* Allow auto height for stacking */
  margin-right: 0.5em;
}

.repeat-sign {
  transform: translateY(0.5em);
}

/* Adjust line height for Bravura digits to stack tightly */
.time-sig span {
  display: block;
  line-height: 0.75em;
  text-align: center;
}

.note.active {
  color: red;
}
</style>
