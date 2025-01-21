<template>
  <div>
    <el-radio-group v-model="selectAdviceTempId" size="small">
      <el-radio-button v-for="item in adviceTempList" :key="item.id" :label="item.name" :value="item.id" />
    </el-radio-group>
    <div class="mt-1">
      <el-tag v-for="detail in selectAdviceTempDetail" :key="detail.id" class="mr-2" type="success" @click="handldeAdviceTmplClick(detail)">
        {{ detail.name }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TmplDaView } from '@/services/TmplServiceProxies'
import { TmplDaDetailServiceProxy, TmplDaGroupServiceProxy } from '@/services/TmplServiceProxies'
import { useDialysisStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { showNotify } from 'vant'

const emit = defineEmits(['handldeAdviceTmplClick'])
const { setAdviceTempList } = useDialysisStore()
const { adviceTempList } = storeToRefs(useDialysisStore())
const selectAdviceTempId = ref()
const selectAdviceTempDetail = computed(() => {
  return adviceTempList.value.find(x => x.id === selectAdviceTempId.value)?.tmplDas || []
})

onMounted(() => {
  initLoad()
})

async function initLoad() {
  await getAdviceTempList()
}
/** 查询医嘱模板数据 */
async function getAdviceTempList() {
  const tmplDaGroupServiceProxy = new TmplDaGroupServiceProxy()
  const filter = {
    pageIndex: 1,
    pageSize: 100,
    order: 'Sequence ASC',
  }
  if (adviceTempList.value.length === 0) {
    const { success, data } = await tmplDaGroupServiceProxy.quick(JSON.stringify(filter))
    if (success) {
      setAdviceTempList(data)
    }
  }
  selectAdviceTempId.value = adviceTempList.value.length > 0 ? adviceTempList.value[0].id : null
}
/** 点击医嘱模板明细 */
async function handldeAdviceTmplClick(val: TmplDaView) {
  const tmplDaDetailServiceProxy = new TmplDaDetailServiceProxy()
  const { success, data, message } = await tmplDaDetailServiceProxy.tmplDaGET2(val.id, undefined)
  if (success) {
    emit('handldeAdviceTmplClick', data)
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
</script>

<style scoped>

</style>
