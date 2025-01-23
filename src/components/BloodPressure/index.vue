<template>
  <div :class="{ 'is-error': isError }" class="custom-blood-pressure-div">
    <el-input v-model="localSbpValue" class="custom-blood-pressure-input" placeholder="收缩压" type="number" @blur="updateValue" />
    <el-input v-model="localDbpValue" class="custom-blood-pressure-input" placeholder="舒张压" type="number" @blur="updateValue" />
    <div class="custom-blood-pressure-unit-div">
      {{ unit }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Object, required: true },
  unit: { type: String, default: 'mmHg' },
  sbpField: { type: String, default: 'sbp' },
  dbpField: { type: String, default: 'dbp' },
  isError: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

// 本地状态
const localSbpValue = ref(props.modelValue[props.sbpField])
const localDbpValue = ref(props.modelValue[props.dbpField])

// 血压值更新
function updateValue() {
  const updatedValue = {
    ...props.modelValue,
    [props.sbpField]: localSbpValue.value,
    [props.dbpField]: localDbpValue.value,
  }
  // emit('change', updatedValue)
  emit('update:modelValue', updatedValue)
}
</script>

<style lang="less" scoped>
.custom-blood-pressure-div {
  display: flex;
  justify-content: space-between;

  .is-error .el-input__wrapper {
    border-color: #f56c6c !important;
  }
}

.custom-blood-pressure-input {
  ::v-deep(.el-input-group__prepend) {
    padding: 0;
  }
  ::v-deep(.el-form-item.is-error .el-input__wrapper) {
    box-shadow: 0;
  }
}
.custom-blood-pressure-unit-div {
  padding: 0 10px;
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow:
    0 1px 0 0 var(--el-border-color) inset,
    0 -1px 0 0 var(--el-border-color) inset,
    -1px 0 0 0 var(--el-border-color) inset;
  background-color: var(--el-fill-color-light);
  color: var(--el-color-info);
}
</style>
