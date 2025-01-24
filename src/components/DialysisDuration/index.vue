<template>
  <div class="dialysis-duration">
    <el-input v-model.number="hours" type="number" :placeholder="hourPlaceholder" :min="0" :max="23" :disabled="disabled" @blur="handleChange">
      <template #append>
        h
      </template>
    </el-input>
    <el-input v-model.number="minutes" type="number" :placeholder="minutePlaceholder" :min="0" :max="59" :disabled="disabled" @blur="handleChange">
      <template #append>
        min
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
// 定义 props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  hourPlaceholder: {
    type: String,
    default: '小时',
  },
  minutePlaceholder: {
    type: String,
    default: '分钟',
  },
  disabled: { type: Boolean, defalut: false },
})

// 定义 emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

// 使用 ref 来管理小时和分钟
const hours = ref(Math.floor(props.modelValue / 60))
const minutes = ref(props.modelValue % 60)
// 监听 modelValue 的变化
watch(() => props.modelValue, (newValue) => {
  hours.value = Math.floor(newValue / 60)
  minutes.value = newValue % 60
})
// 校验小时和分钟，确保其值在合理范围内
function validateInput() {
  // 校验小时
  if (hours.value < 0) {
    hours.value = 0
  }
  else if (hours.value > 23) {
    hours.value = 23
  }

  // 校验分钟
  if (minutes.value < 0) {
    minutes.value = 0
  }
  else if (minutes.value > 59) {
    minutes.value = 59
  }
}

// 处理变化，重新计算总分钟数并触发更新
function handleChange() {
  validateInput() // 校验输入值
  const totalMinutes = hours.value * 60 + minutes.value
  emit('update:modelValue', totalMinutes) // 触发双向绑定
}
</script>

<style lang="less" scoped>
.dialysis-duration {
  display: flex;
  align-items: center;

  ::v-deep(.el-input-group__append, .el-input-group__prepend) {
    padding: 0 14px;
  }
}
</style>
