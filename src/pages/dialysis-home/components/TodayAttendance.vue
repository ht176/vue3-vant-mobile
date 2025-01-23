<template>
  <div class="h-full flex flex-col overflow-hidden p-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="text-xl" @click="handleBackClick">
          返回
        </div>
        <div class="text-xs">
          <div class="head-title-div">
            <span class="text-base font-700">{{ cureData.patientName }}</span>
            <span>{{ cureData.age }}岁</span>
            <span>{{ cureData.genderLabel }}</span>
            <span><el-icon color="red"><WarnTriangleFilled /></el-icon> 异常</span>
          </div>
          <div class="head-title-div">
            <span>{{ cureData.dialysisAreaName }}</span>
            <span>{{ cureData.bedName }}</span>
            <span v-if="cureData.isHistory">{{ formatToDate(cureData.dialysisDate) }}</span>
            <span v-if="cureData.timeOn && !cureData.timeOff && (cureData.timeOn && new Date(cureData.timeOn) <= new Date())">{{ cureData.dialysisDate }}</span>
            <span>{{ cureData.dialysisMode }}</span>
            <span>{{ cureData.vascularAccessName }}</span>
          </div>
        </div>
      </div>
      <div class="flex">
        <el-radio-group v-model="contentType" size="small">
          <el-radio-button v-for="item in contentTypeList.filter(x => x.isMenu)" :key="item.value" :label="item.label" :value="item.value" />
        </el-radio-group>
        <el-dropdown @command="handleCommandClick">
          <el-button size="small">
            ...
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in contentTypeList.filter(x => x.isOperation)" :key="item.value" :command="item.value">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <component :is="selectComp" class="flex-1" :cure-data="cureData" />
  </div>
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { formatToDate } from '@/utils/date'
import { ArrowDown, WarnTriangleFilled } from '@element-plus/icons-vue'

const { cureData } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
})
const emit = defineEmits(['handleBackClick'])
onMounted(() => {
  initLoad()
})

const contentType = ref(1)
const contentTypeList = reactive([
  { value: 1, label: '透析流程', isMenu: true, comp: markRaw(defineAsyncComponent(() => import('./DialysisProcedure.vue'))) },
  { value: 2, label: '医嘱', isMenu: true },
  { value: 3, label: '透中事件', isMenu: !!cureData.timeOn },
  { value: 4, label: '透析记录单', isMenu: true },
  { value: 5, label: '宣教', isMenu: true },
  { value: 6, label: '实验室检查', isOperation: true },
  { value: 7, label: '辅助检查', isOperation: true },
  { value: 8, label: '各种评估', isOperation: true },
  { value: 9, label: '患者签名', isOperation: true },
  { value: 10, label: '穿刺记录', isOperation: true },
  { value: 11, label: '体温记录单', isOperation: true },
])
const selectComp = computed(() => {
  return contentTypeList.find(x => x.value === contentType.value)?.comp
})

async function initLoad() {
}
function handleBackClick() {
  emit('handleBackClick')
}
/** 模块点击 */
function handleCommandClick(val) {
  contentType.value = val
}
</script>

<style scoped lang="less">
.head-title-div {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
</style>
