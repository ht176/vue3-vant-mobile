<template>
  <div v-show="!selectDialysisPatient" v-loading="loading" class="h-full flex flex-col overflow-hidden">
    <div class="custom-head-color flex items-center justify-between px-4 py-1 text-xs text-white font-bold">
      <div>
        用户名：{{ userStore.userInfo?.name }}
      </div>
      <div class="flex items-center gap-3">
        <div>
          <div v-show="filterType === 'area'">
            <el-checkbox-group v-model="filter.dialysisAreaId" size="small" @change="debounceGetCureList">
              <el-checkbox-button v-for="item in dialysisAreaList" :key="item.id" :value="item.id">
                {{ item.name }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
          <span v-show="filterType !== 'area'" class="cursor-pointer" @click="() => { filterType = 'area' }">
            区域选择
          </span>
        </div>
        <div>
          <div v-show="filterType === 'shift'">
            <el-checkbox-group v-model="filter.shiftId" size="small" @change="debounceGetCureList">
              <el-checkbox-button v-for="item in dialysisShiftList.filter(x => x.enabled)" :key="item.id" :value="item.id">
                {{ item.name }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
          <span v-show="filterType !== 'shift'" class="cursor-pointer" @click="() => { filterType = 'shift' }">
            班次选择
          </span>
        </div>
        <div>
          <div v-show="filterType === 'name'">
            <el-input v-model="filterKey" size="small" style="width: 240px" placeholder="请输入患者姓名" />
          </div>
          <span v-show="filterType !== 'name'" class="cursor-pointer" @click="() => { filterType = 'name' }">
            患者姓名
          </span>
        </div>
        <div class="cursor-pointer" @click="() => { filterType = 'more' }">
          更多筛选<van-icon name="filter-o" />
        </div>
        <div class="h-5 w-5 flex items-center justify-center rounded-6 bg-gray-200">
          <el-icon class="!text-xs" color="#909399">
            <CreditCard />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto p-1">
      <el-row :gutter="10">
        <el-col v-for="item in getCureDataList" :key="item.cureRecordId" class="pb-2" :span="12">
          <DialysisCard :cure-data="item" :comands="comands.Comands" :color-object="getCardColorState(item.statusLabel)" @handle-command-click="handleCommandClick" @handle-card-click="handleCardClick" />
        </el-col>
      </el-row>
    </div>
  </div>
  <TodayAttendance v-if="selectDialysisPatient" :cure-data="selectDialysisPatient" @handle-back-click="handleBackClick" />
</template>

<script setup lang="ts">
import { CureServiceProxy, type CureTodayView } from '@/services/CureServiceProxies'
import { CreditCard } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import comands from '@/assets/json/DialysisOperationComands.json'
import { SysTodayCardServiceProxy, SysTodayCardSummaryView } from '@/services/SysServiceProxies'
import { useAppStore, useUserStore } from '@/stores'
import { debounce } from 'lodash-es'
import { getToken } from '@/utils/auth'

const token = getToken()
const { dialysisShiftList, dialysisAreaList } = useAppStore()
const userStore = useUserStore()
const filterType = ref('')
const filterKey = ref('')
const loading = ref(false)

onMounted(() => {
  getSysTodayCard()
  getCureList()
})
const cureDataList = ref<CureTodayView[]>([])
const getCureDataList = computed(() => {
  return cureDataList.value.filter(item => item.patientNameFull && (
    item.patientNameFull.toLowerCase().includes(filterKey.value)
    || item.pinyinCode.toLowerCase().includes(filterKey.value)
    || item.wubiCode.toLowerCase().includes(filterKey.value)))
})

const selectDialysisPatient = ref < CureTodayView | null > (null)

const cureServiceProxy = new CureServiceProxy()

const filter = reactive({
  date: dayjs().format('YYYYMMDD'),
  dialysisAreaId: [],
  shiftId: [],
  dialysisMode: 'HD+HP,HF,HDF,test1,test3,22,Test11,Test12,Test13,Test14,Test15,Test16,Test17,Test18,321,Test19,HD2,HD3,HDF2,HD,HP,SUF,HDF+HP,HFHD,LFHD,PE,Test,Test10,Test9,Test8,Test7,Test6,Test3,Test2,Test1,Test5,Test4',
  infectiousDiseases: '',
  focus: '0',
  emptyBed: '0',
  gender: '0',
  sort: '2',
  hospitalAreaId: token.hid,
  bedOrShift: 'bed',
})
/**
 * 获取透析首页患者数据
 */
async function getCureList() {
  loading.value = true
  const { success, data } = await cureServiceProxy.cure(filter.date, filter.dialysisAreaId.join(','), filter.shiftId.join(','), filter.dialysisMode, filter.infectiousDiseases, filter.focus, filter.emptyBed, filter.gender, filter.sort, filter.hospitalAreaId, filter.bedOrShift)
  if (success) {
    cureDataList.value = data
  }
  loading.value = false
}
const debounceGetCureList = debounce(getCureList, 500)

const cardConfig = ref(new SysTodayCardSummaryView())
/**
 *  获取今日就诊卡片配置
 */
async function getSysTodayCard() {
  const sysTodayCardServiceProxy = new SysTodayCardServiceProxy()
  const { success, data } = await sysTodayCardServiceProxy.all3()
  if (success) {
    cardConfig.value = data
  }
}
/**
 *  获取当前患者状态颜色
 */
function getCardColorState(val: string) {
  const { cardItems } = cardConfig.value.cards.find(x => x.stats === val)
  return cardItems.reduce((acc: ColorObject, item) => {
    if (item.code === 'FONT') {
      acc.fontColor = item.value
    }
    else if (item.code === 'COLOR') {
      acc.bgColor = item.value
    }
    return acc
  }, {})
}
function handleCommandClick(cm, val) {
  console.log('handleCommandClick', cm, val)
}
function handleCardClick(statusLabel: string, val: CureTodayView) {
  console.log('handleCardClick', statusLabel, val)
  selectDialysisPatient.value = val
}
function handleBackClick() {
  selectDialysisPatient.value = null
}
</script>

<style lang="less">
.custom-head-color {
  background: #12377c;
}
.card-div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #aaa;
  border-radius: 12px;
  padding: 2px 10px;
  box-shadow: 2px 2px 2px 1px #aaa;
}
.status {
  height: max-content;
  padding: 2px 4px;
  font-weight: 500;
  text-align: center;
  border-radius: 4px;
  background: #fff9e5;
  color: #f2c572;
}
.abnormal {
  background: #ffefef;
  color: #f88c8c;
}
.shift-name {
  background: #e4e7ff;
  color: #7277f2;
}
.source-label {
  background: #dcf0ff;
  color: #74bcf3;
}

.area-bed-div {
  width: 14vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 14px;
  font-weight: 500;
  border-top-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.middele-card {
  padding: 0px 10px;
  background: #f8f9fb;
  color: #7a7b81;
}
</style>

<route lang="json">
  {
    "name": "dialysis-home"
  }
</route>
