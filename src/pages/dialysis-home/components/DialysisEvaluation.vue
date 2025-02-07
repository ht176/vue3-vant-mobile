<template>
  <div class="dialysis-procedure-title-div">
    <slot name="header">
      透析评估
    </slot>
  </div>
  <GenerateForm v-if="formData.data" ref="generateFormRef" :data="formData.data" :value="formData.dataValue" />
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { AssementCureDialysisView, CureServiceProxy } from '@/services/CureServiceProxies'
import { showNotify } from 'vant'

const { cureData } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})

const emit = defineEmits(['hanldeChangeLoading'])
const formData = ref<AssementCureDialysisView>(new AssementCureDialysisView())
const generateFormRef = ref(null)
onMounted(() => {
  initLoad()
})
async function initLoad() {
  emit('hanldeChangeLoading', true)
  await getDialysisEvaluationData()
  emit('hanldeChangeLoading', false)
}
async function getDialysisEvaluationData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.assementCureDialysisGET(cureData.cureRecordId)
  if (success) {
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
/** 保存 */
async function handleSaveForm() {
  let formSaveData = null
  if (generateFormRef.value) {
    const { success, data } = await generateFormRef.value.getData()
    if (success) {
      formSaveData = { ...toRaw(formData.value), dataValue: data }
    }
  }
  return formSaveData
}
defineExpose({ handleSaveForm })
</script>

<style scoped lang="less">
</style>
