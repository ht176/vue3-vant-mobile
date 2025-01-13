<template>
  <el-form-item
    :label="item.label"
    :prop="`CureRecordFieldItems.${index}.FieldValue`"
    :rules="{
      required: item.required, message: `请输入${item.label?.replace('：', '')}`, trigger: 'blur',
    }"
  >
    <el-input v-if="item.dataType === 'TEXT' || item.dataType === 'NUMERICAL'" v-model="newModelValue" :placeholder="item.placeholder" :type="item.dataType === 'NUMERICAL' ? 'number' : undefined" :disabled="disabled" maxlength="64">
      <template v-if="item.unit" #append>
        {{ item.unit }}
      </template>
    </el-input>
    <div v-else class="w-full flex">
      <el-select v-model="newModelValue" class="flex-grow" :placeholder="item.placeholder" :disabled="disabled">
        <el-option
          v-for="option in item.default?.split(',')"
          :key="option"
          :label="option"
          :value="option"
        />
      </el-select>
      <div v-if="item.unit" class="el-input-group__append custom-input-append">
        {{ item.unit }}
      </div>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
const { item, modelValue, index, disabled } = defineProps({
  item: { type: Object as PropType<CustomSysFieldItemView> },
  modelValue: { type: [String, Number] },
  index: { type: Number },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const newModelValue = computed({
  get() {
    return modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="less">
</style>
