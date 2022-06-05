<template>
<div
    class="expansable-input"
    ref="editable"
    contenteditable
    v-bind="$attrs"
    @input="e => $emit('update:modelValue', e.target.innerText)">
</div>
</template>

<script>
import { ref, onMounted, toRefs } from 'vue'

export default {
  name: 'ExpansableInput',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.$refs.editable.innerText = this.modelValue;
  }
}
</script>

<style>
.expansable-input {
  min-width: 20px;
  display: inline-block;
  padding: 2px 4px;
}
</style>