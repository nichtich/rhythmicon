<script setup>
import { computed } from "vue"

import Rhythm from "rhythmicon-rhythm"

const MAX = 128

const rhythm = defineModel({ validator: r => r instanceof Rhythm })
defineProps({ pulse: Number })

const divisor = computed(() => rhythm.value.divisor())
</script>

<template>
  <div class="rhythm-editor">
    <button
      class="action" :disabled="rhythm.empty()" 
      title="rotate one pulse left" @click="rhythm.rotate(-1)"
    >
      &lt;
    </button>
    <button
      class="action" :disabled="rhythm.empty()" 
      title="rotate one beat left" @click="rhythm.rotateBeats(rhythm[0] ? -1 : 0)"
    >
      ⋖
    </button>
    <button
      class="action" :disabled="rhythm.empty()"
      title="rotate one beat right" @click="rhythm.rotateBeats(1)"
    >
      ⋗
    </button>
    <button
      class="action" :disabled="rhythm.empty()"
      title="rotate one pulse right" @click="rhythm.rotate(1)"
    >
      &gt;
    </button>
    <button
      class="action" title="add one pulse" 
      @click="rhythm.push(0)"
    >
      +
    </button>
    <button
      class="action" :disabled="rhythm.length < 2"
      title="remove last pulse" @click="rhythm.pop()"
    >
      -
    </button>
    <button
      class="action" title="switch beats and pauses"
      @click="rhythm.complement()"
    >
      ⇅
    </button>
    <button
      class="action" title="reverse rhythm"
      @click="rhythm.reverse()"
    >
      ⇆
    </button>
    <button
      class="action" title="repeat rhythm"
      @click="rhythm.repeat()"
    >
      𝄎
    </button>
    <button
      class="action" title="cut rhythm"
      :disabled="rhythm.repetitions() == 1"
      @click="rhythm.cut()"
    >
      𝄍
    </button>    
    <button
      class="action" :disabled="divisor === 1"
      title="deflate rhythm"
      @click="rhythm.deflate()"
    >
      ÷{{ divisor > 1 ? divisor : "n" }}
    </button>
    <button
      class="action" :disabled="rhythm.length > MAX/2"
      title="inflate rhythm (double)" @click="rhythm.inflate()"
    >
      ×2
    </button>
    <button
      class="action" :disabled="rhythm.length > MAX/3"
      title="inflate rhythm (triple)" @click="rhythm.inflate(3)"
    >
      ×3
    </button>
    <button
      class="action" :disabled="rhythm.length % 2 || rhythm.empty() || rhythm.length > 2*MAX/3"
      title="shuffle rhythm" @click="rhythm.shuffle()"
    >
      ²=³
    </button>
    <button
      class="action" :disabled="!rhythm.isShuffle()"
      title="unshuffle rhythm" @click="rhythm.unshuffle()"
    >
      ³=²
    </button>
  </div>
</template>

<style>
.rhythm-editor {
  position: fixed;
  right: 0.2em;
  top: 2.2em;
  display: flex;
  flex-direction: column;
  border-right: none;
  border-radius: 4px 0 0 4px;
  padding: 0.25em;
  gap: 0.25em;
  z-index: 1000;
}
.rhythm-editor button {
  font-weight: bold;
}
.rhythm-editor button:disabled {
  font-weight: normal;
}
</style>

