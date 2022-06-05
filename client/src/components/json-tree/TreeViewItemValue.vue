<template>
	<div class="tree-item-block">
		<span 
      class="tree-view-item-key">
      <span>{{keyString}}</span>
    </span>
		<expansable-input
			v-if="modifiable"
			v-model="valueString"
			:class="setClassType(data)"
			@keyup.enter="onUpdateData"
			@blur="onUpdateData"
		/>
		<span 
      v-else class="tree-view-item-value"
      :class="setClassType(data)">
			{{valueFormed}}
		</span>
		<span class="tree-view-item-type">{{ getValueType(data) }}</span>
		<span v-show="error">
      {{ error }}
    </span>
	</div>
</template>


<script>
import ExpansableInput from './ExpansableInput.vue'

const isNull = el => el === null
const isString = el => typeof el === 'string'
const isNumber = el => typeof el === 'number'
const isFunction = el => typeof el === 'function'
const isBoolean = el => typeof el == 'boolean'
const toNumber = el => Number(el)

export default {
	name: 'tree-view-item',
	components: {
		ExpansableInput
	},
	props: ['data', 'modifiable', 'key-string', 'link'],
	data() {
		return {
			valueString: this.data && this.data.toString(),
			error: false
		};
	},
	computed: {
    valueFormed() {
      return this.getValue(this.data)
    }
  },
  watch: {
    valueFormed(val) {
			this.valueString = isString(val) ? val.replace(/^["]+|["]+$/g, '') : val
    }
  },
  methods: {
    onUpdateData() {
      try {
        const v = this.typedValue(this.valueString)
        this.error = false
        this.$emit('change-data', [], v)
      } catch (err) {
        this.error = err
      }
    },
    typedValue(v) {
      if (v === '') throw new Error('empty')
      
      const dataType = this.getValueType(this.data, '')
      switch (dataType) {
        case 'number':
          if (isNaN(Number(v))) throw new Error('only number')
          return toNumber(v)
        case 'boolean':
          if(!['true','false'].includes(String(v))) throw new Error('true or false')
          return (v.toLowerCase && v.toLowerCase() === 'true') ? true : false
        case 'string':
        default:
          return v;
      }
    },
    getValue(value) {
      if (isNumber(value)) return value
      if (isNull(value)) return 'null'
      if (isString(value) && this.link && !this.modifiable) return `"${this.linkify(value)}"`
      if (isString(value)) return `"${value}"`
      return value
    },
    linkify(inputText) {
      // URLs starting with http://, https://, or ftp://
      const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim
      let replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')

      // URLs starting with www. (without // before it, or it'd re-link the ones done above)
      const replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>')

      // Change email addresses to mailto:: links
      const replacePattern3 = /([\w.]+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>')

      return replacedText
    },
    getValueType(value, prefix = 'tree-view-item-value-') {
      if (isNumber(value)) return 'number'
      if (isFunction(value)) return 'function'
      if (isBoolean(value)) return 'boolean'
      if (isNull(value)) return 'null'
      if (isString(value)) return 'string'
      return 'unknown'
    },
		setClassType(value, prefix = 'tree-view-item-value-') {
			return `${prefix}${this.getValueType(value)}`
		}
  }
}
</script>

<style>
.tree-view-item-type {
	background: #ddd;
	padding: 2px 4px;
	border-radius: 4px;
	font-size: 11px;
	margin-inline: 4px;
}
</style>