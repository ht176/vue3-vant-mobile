<template>
  <el-input v-model="dbpValue" class="custom-blood-pressure-input" placeholder="舒张压" type="number">
    <template #prepend>
      <el-input v-model="sbpValue" placeholder="收缩压" class="!w-full" type="number" />
    </template>
    <template #append>
      {{ unit }}
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  unit: {
    type: String,
    default: 'mmHg',
  },
  sbpField: {
    type: String,
    default: 'sbp',
  },
  dbpField: {
    type: String,
    default: 'dbp',
  },
})

const emit = defineEmits(['update:modelValue'])

// 计算属性处理收缩压
const sbpValue = computed({
  get: () => props.modelValue[props.sbpField],
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [props.sbpField]: value ? Number(value) : null,
    })
  },
})

// 计算属性处理舒张压
const dbpValue = computed({
  get: () => props.modelValue[props.dbpField],
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [props.dbpField]: value ? Number(value) : null,
    })
  },
})
</script>

<style lang="less" scoped>
.custom-blood-pressure-input {
  ::v-deep .el-input-group__prepend {
    padding: 0;
  }
}
</style>
