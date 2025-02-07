<template>
  <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto">
    <div class="dialysis-procedure-title-div">
      小结
    </div>
    <el-row>
      <!-- 透后小结模板 -->
      <el-col :span="24">
        <el-form-item label="选择模板">
          <el-button v-for="item in tmpOptions" :key="item.id" @click="handleTmpClick(item)">
            {{ item.name }}
          </el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="透后小结" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="8" placeholder="请输入透后小结" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { CureServiceProxy, SummaryCureAfterView } from '@/services/CureServiceProxies'
import type { CureTodayView, TmplCommon } from '@/services/CureServiceProxies'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'
import { useAppStore } from '@/stores'

const { cureData } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})
const emit = defineEmits(['hanldeChangeLoading'])
const { getParametersValue } = useAppStore()
const ruleFormRef = ref<FormInstance>()
const formData = ref<SummaryCureAfterView>(new SummaryCureAfterView()) // 小结表单数据
const tmpOptions = ref<TmplCommon[]>([]) // 小结表单数据
// 表单校验规则
const formRules = reactive<FormRules<SummaryCureAfterView>>({
  content: [{ required: true, message: '请输入小结内容', trigger: 'change' }],
})
const paramSummaryTemple = getParametersValue('CUREFLOW.SUMMARY.TEMPLE', true)
onMounted(() => {
  initLoad()
})
/** 初始化小结数据 */
async function initLoad() {
  emit('hanldeChangeLoading', true)
  await getTmplDisinfectInstructions()
  await getSummaryCureAfterData()
  if (ruleFormRef.value) {
    ruleFormRef.value.clearValidate()
  }
  emit('hanldeChangeLoading', false)
}

/** 获取小结数据 */
async function getSummaryCureAfterData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.summaryCureAfterGET(cureData.cureRecordId)
  if (success) {
    formData.value = data
    if (tmpOptions.value.length > 0 && !formData.value.content) {
      formData.value.content = tmpOptions.value[0].content
    }
  }
  else {
    showNotify({ type: 'danger', message })
  }
}

/** 获取小结说明模板 */
async function getTmplDisinfectInstructions() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data } = await cureServiceProxy.tmpl2(cureData.cureRecordId)
  if (success) {
    tmpOptions.value = data
  }
}
/**
 * 点击小结模板
 * @param val 模板对象
 */
function handleTmpClick(val: TmplCommon) {
  if (paramSummaryTemple) {
    formData.value.content = val.content
  }
  else {
    formData.value.content = (formData.value.content || '') + (val.content || '')
  }
}
/** 保存 */
async function handleSaveForm() {
  let formSaveData = null
  await ruleFormRef.value?.validate((valid) => {
    if (valid) {
      formSaveData = toRaw(formData.value)
    }
  })
  return formSaveData
}
defineExpose({
  handleSaveForm,
})
</script>

<style scoped>

</style>
