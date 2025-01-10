<template>
  <!-- Select 类型：支持单选和多选 -->
  <el-select v-if="type === 'select'" v-model="selectedValue" :multiple="isMultiple" :placeholder="placeholder" :clearable="clearable">
    <el-option v-for="item in dictData" :key="item.value" :label="item.name" :value="item.value" />
  </el-select>

  <!-- Radio 类型：单选 -->
  <el-radio-group v-if="type === 'radio'" v-model="selectedValue">
    <el-radio v-for="item in dictData" :key="item.value" :label="item.value">
      {{ item.name }}
    </el-radio>
  </el-radio-group>

  <!-- Checkbox 类型：多选 -->
  <el-checkbox-group v-if="type === 'checkbox'" v-model="selectedCheckboxValue">
    <el-checkbox v-for="item in dictData" :key="item.value" :label="item.value">
      {{ item.name }}
    </el-checkbox>
  </el-checkbox-group>

  <!-- Button 类型：按钮 -->
  <el-button-group v-if="type === 'button'">
    <el-button
      v-for="item in dictData"
      :key="item.value"
      :type="item.value === selectedValue ? 'primary' : 'default'"
      @click="handleButtonClick(item)"
    >
      {{ item.name }}
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import type { SysDicItemChildView } from '@/services/SysServiceProxies'
import { useAppStore } from '@/stores'

const props = defineProps({
  dicCode: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<'select' | 'radio' | 'checkbox' | 'button'>,
    default: 'select', // 默认使用 select 类型
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | Array<string | number>): void }>()
const { getDicDataByCode } = useAppStore() // 假设我们有一个从 store 获取字典数据的 API

const dictData = ref<SysDicItemChildView[]>([]) // 存储字典数据

// 单选
const selectedValue = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  },
})
// 多选
const selectedCheckboxValue = computed({
  get: () => {
    return props.modelValue.split(',')
  },
  set: (value) => {
    emit('update:modelValue', value)
  },
})

// 判断是否是多选
const isMultiple = computed(() => props.type === 'select' && Array.isArray(selectedValue.value))

// 获取字典数据
async function fetchDictData() {
  const data = await getDicDataByCode(props.dicCode) // 假设从 store 获取数据
  dictData.value = data
}

// 获取字典数据
onMounted(() => {
  fetchDictData()
})

// 点击按钮时更新值
function handleButtonClick(item: SysDicItemChildView) {
  selectedValue.value = item.value
  emit('update:modelValue', item.value)
}
</script>

<style scoped lang="less">
/* 可以在这里进行样式的定制 */
</style>
