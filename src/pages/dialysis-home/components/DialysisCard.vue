<template>
  <div class="card-div text-base">
    <div class="flex justify-between">
      <div class="flex items-baseline gap-2 text-gray-7">
        <span class="text-xl font-bold">{{ truncatedPatientName }}</span>
        <span v-if="item.patientId" @click="handleCommandClick(comands.focus, item)">{{ genderLabel }}</span>
        <span>{{ ageLabel }}岁</span>
        <van-icon v-if="item.focus === 1" name="like" color="red" />
        <span v-if="showDialysisCount">{{ `透析${item.dialysisCountTotal}次` }}</span>
        <!-- 穿刺节点 -->
        <div v-if="item.nodes && item.nodes.length > 0" class="flex gap-1 text-white">
          <template v-if="item.nodes.length < 3">
            <div v-for="node in item.nodes" :key="node.id" :class="getPunctureClass(node.vessel)">
              {{ node.title }}
            </div>
          </template>
          <template v-else>
            <el-popover trigger="click" placement="top-start">
              <div class="flex gap-1 text-white">
                <div v-for="node in item.nodes" :key="node.id" :class="getPunctureClass(node.vessel)">
                  {{ node.title }}
                </div>
              </div>
              <template #reference>
                <div class="flex gap-1">
                  <div v-for="node in item.nodes.slice(0, 2)" :key="node.id" class="h-6 w-6 rounded-6 text-center" :class="getPunctureClass(node.vessel)">
                    {{ node.title }}
                  </div>
                  <el-icon color="#666">
                    <MoreFilled />
                  </el-icon>
                </div>
              </template>
            </el-popover>
          </template>
        </div>
      </div>
      <!-- 状态显示 -->
      <div class="flex gap-1 text-base">
        <div v-if="item.eventCount > 0" class="status abnormal" @click="handleCommandClick(comands.cureingEvents, item)">
          异常
        </div>
        <div v-if="item.arrears" class="status">
          欠费
        </div>
        <div class="status shift-name">
          <span>{{ item.shiftName }}</span>
        </div>
        <div v-if="item.sourceLabel" class="status source-label">
          {{ item.sourceLabel }}
        </div>
      </div>
    </div>
    <!-- 区域和床位显示 -->
    <div class="flex justify-between text-lg">
      <div class="area-bed-div" :style="{ backgroundColor: colorObject.bgColor, color: colorObject.fontColor }">
        <div>{{ item.dialysisAreaName || '-' }}</div>
        <div class="text-gray">
          |
        </div>
        <div>{{ item.bedName || '-' }}</div>
      </div>
      <div class="flex items-center gap-1">
        <div class="font-bold" :style="{ color: colorObject.fontColor }">
          {{ item.statusLabel }} {{ statusExtrasLabel(item) }}
        </div>
        <el-dropdown trigger="click">
          <el-icon color="#666" class="!text-base">
            <Menu />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(btn, index) in (item.isHistory) ? (btnArraryLast.filter(i => { return (i.commandKey !== 'devRepair' && i.commandKey !== 'propaganda') })) : (btnArraryLast.filter(i => i.commandKey !== 'propaganda'))" :key="index" @click="handleCommandClick(btn.commandKey ? comands[btn.commandKey] : '', item)">
                <span v-if="!(enablePatientShift && (btn.commandKey === 'callScreen' || btn.commandKey === 'devRepair') && !item.bedId)">
                  {{ btn.name ? btn.name : '-' }}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 透析卡片内容 -->
    <div class="mt-1 font-bold" @click="handleCardClick(item.statusLabel, item)">
      <div class="middele-card flex justify-between">
        <div v-for="info in cardHeadInfo" :key="info.value" class="flex items-center gap-1">
          <img :src="info.icon" class="w-4">
          <span>{{ info.value }}</span>
        </div>
      </div>
      <el-row class="px-2 text-sm text-dark-1">
        <el-col v-for="code in columnArray" :key="code" :span="8">
          <span>{{ getCustomName(item, code) }}：<span>{{ getCustomValue(item, code) }}</span></span>
        </el-col>
        <el-col :span="8">
          抗凝：{{ item.anticoagulantShortName || item.anticoagulantName || '-' }}
        </el-col>
        <el-col v-if="['普通肝素', '阿加曲班'].includes(item.anticoagulantType)" :span="8">
          <template v-if="item.antiTmplType === '模板4'">
            剂量：{{ item.total }} {{ item.totalUnit }}
          </template>
          <template v-else>
            首剂：{{ item.first || '-' }} {{ item.firstUnit || '' }}
          </template>
        </el-col>
        <el-col v-if="['普通肝素', '阿加曲班'].includes(item.anticoagulantType)" :span="8">
          追加量：
          <template v-if="item.antiTmplType === '模板4'">
            {{ item.append }} {{ item.appendUnit }}
          </template>
          <template v-else>
            {{ item.appendRate || '-' }} {{ item.appendRateUnit || '' }}
          </template>
        </el-col>
        <el-col v-if="['模板1', '模板2', '模板4'].includes(item.antiTmplType)" :span="8">
          <div>
            总量：{{ getTotalValue(item) }}
          </div>
        </el-col>
        <el-col v-if="['低分子肝素模板', '模板3'].includes(item.antiTmplType)" :span="8">
          <div>
            剂量：{{ item.total || '-' }} &nbsp;{{ item.totalUnit || '' }}
          </div>
        </el-col>
        <el-col v-if="isProgressVisible" :span="24" class="card-content card-content-progress">
          <span>进度：</span>
          <el-progress class="custom-progress" :stroke-width="10" :show-text="true" :format="formatProgress" :percentage="item.percent >= 0 ? item.percent : 0" />
        </el-col>
      </el-row>
      <el-row class="border-t-gray-2 border-t-solid py-0.5">
        <el-col v-for="(btn, index) in btnArrayThird" :key="index" :span="8">
          <div v-if="btn.commandKey" class="flex items-center" @click.stop="handleCommandClick(comands[btn.commandKey], item)">
            <img class="mr-1 h-4 w-4" :src="requireImg(`dialysisIcon/flowIcon/${btn.commandKey}.png`)">
            <span v-if="!(enablePatientShift && (btn.commandKey === 'callScreen' || btn.commandKey === 'devRepair') && !item.bedId)">{{ btn.name }}</span>
            <span class="ml-1 h-5 w-5 rounded-5 bg-red text-center text-sm text-white empty:hidden">
              <!-- 医嘱数量 -->
              <template v-if="btn.commandKey === 'medicalOrderRecord' && item.medicalAdviceCountUnexecuted > 0">{{ item.medicalAdviceCountUnexecuted }}</template>
              <!-- 透中监测数量 -->
              <template v-else-if="btn.commandKey === 'cureingWatch' && item.monitorCount > 0">{{ item.monitorCount }}</template>
              <!-- 透中事件数量 -->
              <template v-else-if="btn.commandKey === 'cureingEvents' && item.eventCount > 0">{{ item.eventCount }}</template>
            </span>
          </div>
          <div v-else>
            -
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CureTodayView } from '@/services/CureServiceProxies'
import { Menu, MoreFilled } from '@element-plus/icons-vue'
import { formatToDate } from '@/utils/date'
import { requireImg } from '@/utils'

const props = defineProps({
  cureData: CureTodayView,
  comands: { type: Object, default: () => {} },
  colorObject: {
    type: Object,
    default: () => ({ fontColor: '#ccc', bgColor: '#ccc' }),
  },
  enactDoctorNameShow: { type: Boolean, default: true },
  getauthChangeBed: { type: Boolean, default: true },
  authList: { type: Array, default: () => [] },
})

const emit = defineEmits(['handleCommandClick', 'handleCardClick'])
const item = props.cureData
const truncatedPatientName = computed(() =>
  item.patientNameFull ? (item.patientNameFull.length > 5 ? `${item.patientNameFull.substring(0, 5)}...` : item.patientNameFull) : '',
)
const genderLabel = computed(() => (item.gender ? (item.gender === '2' ? '女' : '男') : '-'))
const ageLabel = computed(() => item.age || '-')
const showDialysisCount = computed(() => item.statusLabel !== '未排床' && item.statusLabel !== '未签到')
const enablePatientShift = ref(false)
/** 穿刺节点样式 */
const getPunctureClass = (vessel: string) => `${vessel === 'jing' ? 'bg-green-5' : 'bg-red-5'} rounded-4`

/** 透析操作命令 */
function handleCommandClick(cm: any, val: CureTodayView) {
  if (cm)
    emit('handleCommandClick', cm, val)
}

function handleCardClick(statusLabel: string, val: CureTodayView) {
  emit('handleCardClick', statusLabel, val)
}

/** 透析卡片状态 */
function statusExtrasLabel(val: CureTodayView) {
  if (val.check === 0 && !val.hasEnactBefore)
    return '（待调整）'
  if (val.status === 'UNSIGNED' && !val.hasEnactBefore)
    return '（已制定）'
  if ((val.status === 'UP' || val.status === 'INPROGRESS') && !val.hasVerifyMiddle)
    return '（未核对）'
  if (val.statusLabel === '已签到')
    return `（${val.timeSigninLable}）`
  return ''
}

/** 卡片内容头部信息 */
const cardHeadInfo = computed(() => [
  {
    show: item.patientId && item.isHistory,
    icon: requireImg('dialysisIcon/flowIcon/DialysisDate.png'),
    value: formatToDate(item.dialysisDate),
  },
  {
    show: props.enactDoctorNameShow,
    icon: requireImg('dialysisIcon/flowIcon/EnactDoctorName.png'),
    value: item.enactDoctorName ?? '-',
  },
  {
    show: true,
    icon: requireImg(item.dialysisMode === 'HD' ? 'dialysisIcon/flowIcon/DialysisDate.png' : 'dialysisIcon/flowIcon/DialysisModeLabel.png'),
    value: item.dialysisModeLabel,
  },
  {
    show: true,
    icon: requireImg('dialysisIcon/flowIcon/VascularAccessName.png'),
    value: `${item.vascularAccessName ?? ''} ${item.otherVascularAccessName ?? ''}`,
  },
].filter(info => info.show))

const columnArray = ref(['M-L-R1-C1', 'M-L-R1-C2', 'M-L-R2-C1', 'M-L-R2-C2', 'M-L-R3-C1', 'M-L-R3-C2', 'M-L-R4-C1', 'M-L-R4-C2'])

// 获取自定义名称
function getCustomName(item: CureTodayView, code: string) {
  const custom = item.customs.find(c => c.code === code)
  return custom ? custom.name : '-'
}

// 获取自定义值
function getCustomValue(item: CureTodayView, code: string) {
  const custom = item.customs.find(c => c.code === code)
  return custom ? custom.value : '-'
}

// 计算进度是否可见
const isProgressVisible = computed(() => {
  return ['UP', 'VERIFY', 'INPROGRESS'].includes(item.status) && item.timeLeft !== '0' && item.timeLeft !== '00:00' && item.timeOn && new Date(item.timeOn) <= new Date()
})

// 计算总量
function getTotalValue(item: CureTodayView) {
  // 根据实际业务逻辑计算总量
  return item.total || '-'
}

// 格式化方法
const formatProgress = percent => `${percent}%`

/**
 * 根据权限获取卡片操作按钮
 * btnArr 操作按钮数组
 */
function getAuthBtns(btnArr) {
  props.authList.forEach((x: { key: string }) => {
    btnArr = btnArr.filter(item => item.commandKey !== x.key)
  })
  return btnArr
}

const btnArraryLast = computed(() => {
  let btnArr = item.buttons
  if (!props.getauthChangeBed) {
    btnArr = btnArr.filter(item => item.commandKey !== 'changeBed')
  }
  btnArr = getAuthBtns(btnArr)
  if (btnArr.length > 3) {
    return btnArr.filter((_, i) => {
      return i >= 3
    })
  }
  else {
    return [{
      commandKey: '',
      name: '-',
    }]
  }
})
const btnArrayThird = computed(() => {
  let btnArr = item.buttons
  if (!props.getauthChangeBed) {
    btnArr = btnArr.filter(item => item.commandKey !== 'changeBed')
  }
  btnArr = getAuthBtns(btnArr)
  const btnArrLength = btnArr.length
  if (btnArrLength > 3) {
    return btnArr.slice(0, 3)
  }
  else {
    const tempArr = Object.assign([], btnArr)
    for (let i = 0; i < 3 - btnArrLength; i++) {
      tempArr.push({
        commandKey: '',
        Name: '-',
      })
    }
    return tempArr
  }
})
</script>
