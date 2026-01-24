<script setup>
import { computed } from "vue"
import Rhythm from "rhythmicon-rhythm"

const rhythm = defineModel({ validator: r => r instanceof Rhythm })

defineProps({ max: { type: Number, default: () => 128 } })

const divisor = computed(() => rhythm.value.divisor())
const empty = computed(() => rhythm.value.empty())
</script>

<template>
  <div class="rhythm-controls">
    <button
      title="rotate one pulse left"
      :disabled="empty" @click="rhythm.rotate(-1)"
    >
      &lt;
    </button>
    <button
      title="rotate one pulse right"
      :disabled="empty" @click="rhythm.rotate(1)"
    >
      &gt;
    </button>
    <button
      title="rotate one beat left"
      :disabled="empty" @click="rhythm.rotateBeats(rhythm[0] ? -1 : 0)"
    >
      ⋖
    </button>
    <button
      title="rotate one beat right"
      :disabled="empty" @click="rhythm.rotateBeats(1)"
    >
      ⋗
    </button>
    <button
      title="add one pulse"
      @click="rhythm.push(0)"
    >
      +
    </button>
    <button
      title="remove last pulse"
      :disabled="rhythm.length < 2" @click="rhythm.pop()"
    >
      -
    </button>
    <button
      title="switch beats and pauses"
      @click="rhythm.complement()"
    >
      ⇅
    </button>
    <button
      title="reverse rhythm"
      @click="rhythm.reverse()"
    >
      ⇆
    </button>
    <button
      title="repeat rhythm"
      @click="rhythm.repeat()"
    >
      𝄎
    </button>
    <button
      title="cut rhythm"
      :disabled="rhythm.repetitions() == 1" @click="rhythm.cut()"
    >
      𝄍
    </button>
    <button
      title="inflate rhythm (double)"
      :disabled="rhythm.length > max/2" @click="rhythm.inflate()"
    >
      ×2
    </button>
    <button
      title="inflate rhythm (triple)"
      :disabled="rhythm.length > max/3" @click="rhythm.inflate(3)"
    >
      ×3
    </button>
    <button
      title="deflate rhythm"
      :disabled="divisor === 1" @click="rhythm.deflate()"
    >
      ÷{{ divisor > 1 ? divisor : "n" }}
    </button>
    <button
      :disabled="empty || rhythm.length % 2 || rhythm.length > 2*max/3"
      title="shuffle rhythm" @click="rhythm.shuffle()"
    >
      ²=³
    </button>
    <button
      title="unshuffle rhythm"
      :disabled="!rhythm.shuffled()" @click="rhythm.unshuffle()"
    >
      ³=²
    </button>
  </div>
</template>

<style>
.rhythm-controls {
  display: flex;
  padding: 0.25em;
  gap: 0.25em;
}
.rhythm-controls button {
  font-weight: bold;
  padding: 2px;
  width: 2em;
  height: 2em;
}
.rhythm-controls button:disabled {
  font-weight: normal;
}
</style>
