<template>
  <!-- Select 类型：支持单选和多选 -->
  <el-select v-if="type === 'select' && isMultiple" v-bind="$attrs" v-model="selectedCheckboxValue" :multiple="isMultiple" :placeholder="placeholder">
    <el-option v-for="item in dicData" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <el-select v-else-if="type === 'select'" v-bind="$attrs" v-model="selectedValue" :placeholder="placeholder">
    <el-option v-for="item in dicData" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <!-- Radio 类型：单选 -->
  <el-radio-group v-else-if="type === 'radio'" v-bind="$attrs" v-model="selectedValue">
    <el-radio v-for="item in dicData" :key="item.value" :label="item.value">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
  <!-- Checkbox 类型：多选 -->
  <el-checkbox-group v-else-if="type === 'checkbox'" v-bind="$attrs" v-model="selectedCheckboxValue">
    <el-checkbox v-for="item in dicData" :key="item.value" :label="item.value">
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
  <!-- Button 类型：按钮 -->
  <el-button-group v-else-if="type === 'button'" v-bind="$attrs">
    <el-button
      v-for="item in dicData"
      :key="item.value"
      :type="item.value === selectedValue ? 'primary' : 'default'"
      @click="handleButtonClick(item)"
    >
      {{ item.label }}
    </el-button>
  </el-button-group>
  <!-- label 类型：文字 -->
  <div v-else-if="type === 'label'" v-bind="$attrs">
    {{ dicData.find(x => x.value === selectedValue)?.label }}
  </div>
</template>

<script setup lang="ts">
import type { SysDicItemChildView } from '@/services/SysServiceProxies'
import { useAppStore } from '@/stores'
/** 字典明细 */
interface CustomSysDicItemChildView extends SysDicItemChildView {
  label?: string
}
const props = defineProps({
  dicCode: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<'select' | 'radio' | 'checkbox' | 'button' | 'label'>,
    default: 'select', // 默认使用 select 类型
  },
  isMultiple: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  optionValue: {
    type: Array<CustomSysDicItemChildView>,
    default: () => [],
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | Array<string | number>): void
  (event: 'change', value: string | number | Array<string | number>): void
}>()
const { getDicDataByCode } = useAppStore()

const dicData = computed<CustomSysDicItemChildView[]>(() => {
  if (props.optionValue.length > 0) {
    return props.optionValue
  }
  else {
    return getDicDataByCode(props.dicCode).map((x) => {
      return {
        ...x,
        label: x.name,
      }
    })
  }
})

// 单选
const selectedValue = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})
// 多选
const selectedCheckboxValue = computed({
  get: () => {
    return props.modelValue.split(',')
  },
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

// 点击按钮时更新值
function handleButtonClick(item: CustomSysDicItemChildView) {
  selectedValue.value = item.value
  emit('update:modelValue', item.value)
}
</script>

<style scoped lang="less">
/* 可以在这里进行样式的定制 */
</style>
