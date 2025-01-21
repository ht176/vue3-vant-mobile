<template>
  <div class="advice-div my-2">
    <el-table :key="tableData.length" ref="adviceTableRef" row-key="id" :data="tableData" border style="width: 100%" :span-method="objectSpanMethod">
      <el-table-column v-if="isLongAdviceType" type="selection" width="40" :selectable="selectable" />
      <el-table-column prop="group" label="组合" width="60" align="center" />
      <el-table-column v-if="isLongAdviceType" prop="doctorCreateTime" label="开立日期" :width="isEdit ? 160 : 100">
        <template #default="scope">
          <el-date-picker v-if="scope.row.edit" v-model="scope.row.doctorCreateTime" class="!w-full" type="date" placeholder="请选择开立日期" format="YYYY-MM-DD" />
          <template v-else>
            {{ formatToDate(scope.row.doctorCreateTime) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="!isLongAdviceType" prop="doctorCreateTime" label="开立时间" :width="isEdit ? 140 : 90">
        <template #default="scope">
          <el-date-picker v-if="scope.row.edit" v-model="scope.row.doctorCreateTime" class="!w-full" type="datetime" placeholder="请选择开立时间" format="HH:mm" />
          <template v-else>
            {{ formatToTimeHM(scope.row.doctorCreateTime) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="doctorName" label="开立医生" width="100" />
      <el-table-column v-if="!isLongAdviceType" prop="statusName" label="状态" width="80" />
      <el-table-column prop="typeName" label="医嘱类型" :width="isEdit ? 120 : 90">
        <template #default="scope">
          <Dictionary v-if="scope.row.edit && scope.row.merge === 1" v-model="scope.row.type" :dic-code="DIC_DA_TYPE" type="select" placeholder="请选择医嘱类型" />
          <template v-else>
            {{ formatterTypeName(scope.row.typeName) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="医嘱内容" :min-width="isEdit ? 620 : 320">
        <template #default="scope">
          <div class="flex">
            <template v-if="scope.row.edit">
              <div v-if="scope.row.type === 'TEXT'">
                <!-- 文字医嘱 -->
                <el-input v-model="scope.row.content" placeholder="医嘱内容" />
              </div>
              <template v-else>
                <!-- 非文字医嘱 -->
                <AdviceChooseSelect v-model="scope.row.roomItemListId" :advice-type="scope.row.type" class="flex-1" @change="handleRoomItemListIdChange($event, scope.row)" />
                <div>
                  <el-input v-model="scope.row.singleDosage" class="!w-18" type="number" :min="1" placeholder="单次用量" @change="handleChangeSingleDosage(scope.row)" />
                </div>
                <Dictionary v-model="scope.row.singleUnit" class="!w-22" :dic-code="DIC_SYS_UNIT" type="select" placeholder="单位" />
                <Dictionary v-if="scope.row.merge" v-model="scope.row.usage" class="!w-30" :dic-code="DIC_DA_USAGE" type="select" placeholder="用法" />
                <div v-else class="!w-30" />
                <el-checkbox v-model="scope.row.owned" class="ml-2">
                  自备
                </el-checkbox>
              </template>
            </template>
            <template v-else>
              {{ scope.row.cureDaContent }}
              <el-tag v-if="scope.row.listEnabled === 0" type="warning" size="small">
                停用
              </el-tag>
              <i v-if="scope.row.type === 'DRUG'" class="fa fa-bar-chart" @click="handleShowDrugChart(scope.row)" />
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Dosage" label="数量" :width="isEdit ? 170 : 80">
        <template #default="scope">
          <div v-if="scope.row.edit && scope.row.type !== 'TEXT'" class="flex">
            <el-input v-model="scope.row.dosage" type="number" :min="1" placeholder="数量" />
            <Dictionary v-model="scope.row.unit" class="!w-34" dic-code="" :option-value="scope.row.unitList" type="select" placeholder="用法" />
          </div>
          <template v-else-if="scope.row.type !== 'TEXT'">
            {{ scope.row.dosage ? `${scope.row.dosage} ${scope.row.unit}` : '' }}
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="showInventoryCount" prop="inventoryCount" label="库存" width="63" />
      <el-table-column prop="orally" label="口服药" width="80" align="center">
        <template #default="scope">
          <template v-if="scope.row.Type !== 'TEXT'">
            <el-checkbox v-if="scope.row.edit" v-model="scope.row.orally" />
            <template v-else>
              {{ scope.row.Orally === 1 ? '是' : '否' }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="isLongAdviceType" prop="intervalName" label="频次" :width="isEdit ? 160 : 100">
        <template #default="scope">
          <Dictionary v-if="scope.row.edit" v-model="scope.row.interval" class="!w-full" :dic-code="DIC_DA_INTERVAL" type="select" placeholder="频次" />
          <span v-else>{{ scope.row.intervalName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isLongAdviceType" prop="weekdayName" label="周执行" :width="isEdit ? 220 : 200">
        <template #default="scope">
          <Dictionary v-if="scope.row.edit" v-model="scope.row.weekday" class="!w-full" :dic-code="DIC_DA_WEEKDAY" type="select" :is-multiple="true" placeholder="周执行" collapse-tags />
          <span v-else>{{ scope.row.weekdayName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="180" :show-overflow-tooltip="!isEdit">
        <template #default="scope">
          <el-input v-if="scope.row.edit" v-model="scope.row.remark" placeholder="请输入内容" maxlength="60" />
          <template v-else>
            {{ scope.row.remark }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="isEdit ? 230 : 220">
        <template #default="scope">
          <el-button v-if="scope.row.edit" size="small" @click="handleRemoveAdviceClick(scope.row, scope.$index)">
            {{ scope.row.merge ? '取消' : '移除' }}
          </el-button>
          <el-button v-if="scope.row.edit && scope.row.merge" size="small" :disabled="scope.row.type === 'TEXT'" type="primary" @click="handleAddCombinationAdviceClick(scope.row, scope.$index)">
            添加
          </el-button>
          <el-button v-if="scope.row.edit && scope.row.merge" size="small" type="primary" @click="handleSaveAdviceClick(scope.row, scope.$index)">
            保存
          </el-button>
          <el-button v-if="!scope.row.edit && scope.row.allowModify && scope.row.cureRecordId" size="small" :disabled="isEdit" type="primary" @click="handleEditAdviceClick(scope.row)">
            编辑
          </el-button>
          <el-button v-if="!scope.row.edit && scope.row.allowRevocation && scope.row.cureRecordId && scope.row.Status !== 'VOIDED'" size="small" :disabled="isEdit" @click="handleRevokeAdviceClick(scope.row)">
            撤销
          </el-button>
          <el-button v-if="!scope.row.edit && scope.row.status === 'EXECUTED' && scope.row.status !== 'VOIDED'" size="small" @click="handleInvalidAdviceClick(scope.row)">
            作废
          </el-button>
          <el-button v-if="!scope.row.edit && scope.row.enabled === 1" size="small" :disabled="isEdit" @click="handleStopAdviceClick(scope.row)">
            停药
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CureDaView, CureServiceProxy, PatientDaLongtermView } from '@/services/CureServiceProxies'
import { PatientDaLongtermServiceProxy } from '@/services/PatientServiceProxies'
import type { RoomItemFullView } from '@/services/RoomItemListServiceProxies'
import type { TmplDaDetailView } from '@/services/TmplServiceProxies'
import { useAppStore, useUserStore } from '@/stores'
import { getUuid } from '@/utils'
import { DIC_DA_INTERVAL, DIC_DA_TYPE, DIC_DA_USAGE, DIC_DA_WEEKDAY, DIC_SYS_UNIT } from '@/utils/constant'
import { dateUtil, formatToDate, formatToTimeHM } from '@/utils/date'
import { ElMessageBox } from 'element-plus'
import { showNotify } from 'vant'

const { patientId, cureRecordId, adviceData, adviceType, showInventoryCount } = defineProps({
  patientId: { type: String, required: true },
  cureRecordId: { type: String },
  adviceType: { type: String as PropType<'long' | 'temporary' | 'cure'>, default: 'cure' },
  adviceData: {
    type: Object as PropType<CustomPatientDaLongtermView[] | CustomCureDaView[]>,
    required: true,
  },
  stepType: { type: String, default: 'MakePrescription' },
  showInventoryCount: { type: Boolean, default: false },
})

const emit = defineEmits(['updateAdviceData'])

const { getDicDataByCode } = useAppStore()

const cureServiceProxy = new CureServiceProxy()
const { userInfo } = useUserStore()

const adviceTableRef = ref()
const tableData = ref<CustomPatientDaLongtermView[] | CustomCureDaView[]>([])
const getAdviceOrder = computed(() => {
  return tableData.value.length ? tableData.value[0].order + 100 : 100
})
const weekDayValues = getDicDataByCode(DIC_DA_WEEKDAY).map(x => x.value).join(',')

/** 初始化医嘱数据 */
function initLoad() {
  const array = adviceData.map((x, i) => {
    let merge = 0
    if (i === 0 || x.groupId !== adviceData[i - 1].groupId) {
      merge = adviceData.filter(e => e.groupId === x.groupId).length
    }
    return {
      ...x,
      edit: false,
      merge,
    }
  })
  tableData.value = tableData.value.filter(x => x.edit).concat(array) as CustomCureDaView[]
}
watch(() => adviceData, () => {
  initLoad()
}, { immediate: true })

const isLongAdviceType = computed(() => adviceType === 'long')
/**
 * 判断当前行是否可选
 * @param row - 当前行数据
 * @returns 返回布尔值表示是否可选
 * 规则：如果当前组内所有医嘱的项目启用状态都不为false，则该组可选
 */
function selectable(row): boolean {
  // 过滤出当前组的所有医嘱
  const groupItems = tableData.value.filter(item => item.groupId === row.groupId)
  // 使用every方法判断组内所有医嘱是否都可用
  return groupItems.every(item => (item as CustomPatientDaLongtermView).listEnabled !== 0)
}
/**
 * 优化后的单元格合并方法
 * @param val
 * @param val.row - 当前行信息
 * @param val.column - 当前列信息
 * @param val.rowIndex - 当前行下标
 * @param val.columnIndex - 当前列下标
 * @returns 返回合并配置 [rowspan, colspan]
 */
function objectSpanMethod({ row, column: _column, rowIndex: _rowIndex, columnIndex }) {
  // 定义不需要合并的列索引
  // temporary: 临时医嘱类型
  //   - 0: 药品名称列
  //   - 5: 数量列
  //   - 6: 库存列（当showInventoryCount为true时）
  //   - 7: 口服药列
  //   - 8: 备注列
  // long: 长期医嘱类型
  //   - 1: 药品名称列
  //   - 5: 频次列
  //   - 6: 周执行列
  //   - 7: 备注列
  //   - 8: 操作列（当showInventoryCount为true时）
  const excludeColumns = {
    temporary: showInventoryCount ? [0, 5, 6, 7, 8] : [0, 5, 6, 7],
    long: showInventoryCount ? [1, 5, 6, 7, 8] : [1, 5, 6, 7],
  }
  // 获取当前类型的排除列
  const currentExclude = isLongAdviceType.value ? excludeColumns.long : excludeColumns.temporary
  // 如果当前列在排除列表中，不进行合并
  if (currentExclude.includes(columnIndex)) {
    return [1, 1]
  }
  // 特殊处理操作列在编辑状态时不合并
  // 1. 根据是否显示库存数量，确定操作列的索引位置
  //    - 显示库存时，操作列索引为10
  //    - 不显示库存时，操作列索引为9
  const operationColumnIndex = showInventoryCount ? 10 : 9
  // 2. 判断当前列是否为操作列且处于编辑状态
  //    - 如果是操作列且处于编辑状态，返回[1,1]表示不合并
  //    - 这样可以确保每个编辑行都有独立的操作按钮
  if (columnIndex === operationColumnIndex && row.edit) {
    return [1, 1]
  }
  // 返回合并配置
  return row.merge ? [row.merge, 1] : [0, 0]
}
/** 格式化医嘱类型 */
function formatterTypeName(val) {
  return val ?? '组合'
}

const isEdit = computed(() => {
  const res = tableData.value.some(x => x.edit)
  return res
})
/** 新增医嘱模板 */
function addTmplAdviceData(array: TmplDaDetailView[]) {
  const newData = array.map((x, i) => {
    let merge = 0
    if (i === 0 || x.groupId !== array[i - 1].groupId) {
      merge = array.filter(e => e.groupId === x.groupId).length
    }
    return {
      ...x,
      id: null,
      patientId,
      cureRecordId,
      owned: 0,
      dialysis: 1,
      execDate: dateUtil(),
      doctorCreateTime: dateUtil(),
      doctorName: userInfo.name,
      doctorId: userInfo.id,
      order: getAdviceOrder.value,
      weekday: adviceType === 'long' ? weekDayValues : undefined,
      merge,
      edit: true,
    }
  })
  tableData.value.unshift(...newData as any)
}
/** 新增医嘱 */
function addAdviceData() {
  if (tableData.value.find(x => x.edit && x.id)) {
    showNotify({ type: 'danger', message: '请保存医嘱后再添加' })
    return
  }
  const obj = {
    patientId,
    cureRecordId,
    owned: 0,
    execDate: dateUtil(),
    groupId: getUuid(),
    doctorCreateTime: dateUtil(),
    doctorName: userInfo.name,
    doctorId: userInfo.id,
    type: 'DRUG',
    order: getAdviceOrder.value,
    weekday: adviceType === 'long' ? weekDayValues : undefined,
    merge: 1,
    edit: true,
  }
  tableData.value.splice(0, 0, obj as unknown as CustomCureDaView)
}
/** 新增组合医嘱 */
function handleAddCombinationAdviceClick(row: CustomPatientDaLongtermView | CustomCureDaView, index) {
  let newObj = {
    patientId,
    cureRecordId,
    owned: 0,
    execDate: dateUtil(),
    groupId: row.groupId,
    group: row.merge === 1 ? '└' : '|',
    doctorCreateTime: row.doctorCreateTime,
    doctorName: row.doctorName,
    doctorId: row.doctorId,
    merge: 0,
    edit: true,
  } as unknown as CustomPatientDaLongtermView | CustomCureDaView
  if (adviceType === 'long') {
    newObj = new PatientDaLongtermView()
  }
  else {
    const newRow = row as CustomCureDaView
    let obj = new CureDaView()
    obj = { ...newObj, cureRecordId: newRow.cureRecordId } as CustomCureDaView
    if (row.merge === 1) {
      row.group = '┌'
    }
    row.merge = row.merge + 1
    tableData.value.splice(index + 1, 0, obj)
  }
  tableData.value.filter(x => x.groupId === row.groupId).forEach((x, i) => x.order = row.order - i)
}
/** 编辑医嘱 */
function handleEditAdviceClick(row: CustomPatientDaLongtermView | CustomCureDaView) {
  if (isEdit.value) {
    showNotify({ type: 'danger', message: `只允许同时编辑一条` })
    return
  }
  tableData.value.filter(x => x.groupId === row.groupId).forEach(x => x.edit = true)
}
/** 移除/取消医嘱 */
function handleRemoveAdviceClick(row: CustomPatientDaLongtermView | CustomCureDaView, index) {
  const groupRowList = tableData.value.filter(x => x.groupId === row.groupId)
  // 取消
  if (row.merge) {
    if (row.id) {
      groupRowList.forEach(x => x.edit = false)
      initLoad()
    }
    else {
      const length = groupRowList.length - 1 ? groupRowList.length : 1
      tableData.value.splice(index, length)
    }
  }
  else {
    // 移除
    tableData.value.splice(index, 1)
    groupRowList.forEach((x, i) => {
      if (x.merge) {
        x.merge = x.merge - 1
      }
      else if (i === groupRowList.length - 1) {
        x.group = '└'
      }
    })
  }
}
/** 点击保存医嘱 */
async function handleSaveAdviceClick(row: CustomPatientDaLongtermView | CustomCureDaView, _index) {
  const array = tableData.value.filter(i => i.groupId === row.groupId)
  const validateRes = verifyAdviceList(array as CustomPatientDaLongtermView[] | CustomCureDaView[])
  if (validateRes) {
    // 表格行内保存，通过id判断新增、编辑
    SaveAdviceData([array], row.groupId, !array[0]?.id)
  }
}
/** 保存全部医嘱数据 */
function saveAllAdviceData() {
  const array = tableData.value.filter(x => x.edit)
  const validateRes = verifyAdviceList(array as CustomPatientDaLongtermView[] | CustomCureDaView[])
  if (validateRes) {
    const res = array.reduce((acc, item) => {
      const group = acc.find(group => group[0].groupId === item.groupId)
      if (group) {
        group.push(item)
      }
      else {
        acc.push([item])
      }
      return acc
    }, [])
    // 保存全部，通过判断第一条是否有id判断新增、编辑
    SaveAdviceData(res, array[0]?.id ? array[0].groupId : null, !array[0]?.id)
  }
}
/**
 * 保存医嘱数据
 * @param array 待保存数据
 * @param groupId 组合ID
 */
async function SaveAdviceData(array, groupId?, isAdd = false) {
  if (adviceType === 'cure') {
    const { success, message } = isAdd ? await cureServiceProxy.daCureMiddlePOST(array) : await cureServiceProxy.update(groupId, array[0])
    if (success) {
      showNotify({ type: 'success', message: isAdd ? '保存成功' : '更新成功' })
      tableData.value.filter(x => groupId ? (x.groupId === groupId) : x.edit).forEach(x => x.edit = false)
      // 提交事件，刷新数据
      emit('updateAdviceData')
    }
    else {
      showNotify({ type: 'danger', message })
    }
  }
  else if (adviceType === 'long') {
    const patientDaLongtermServiceProxy = new PatientDaLongtermServiceProxy()
    const { success, message } = await patientDaLongtermServiceProxy.patientDaLongtermPOST(array)
    if (success) {
      showNotify({ type: 'success', message: '保存成功' })
      tableData.value.filter(x => groupId ? (x.groupId === groupId) : x.edit).forEach(x => x.edit = false)
      // 提交事件，刷新数据
      emit('updateAdviceData')
    }
    else {
      showNotify({ type: 'danger', message })
    }
  }
}
/** 医嘱保存校验 */
function verifyAdviceList(array: CustomPatientDaLongtermView[] | CustomCureDaView[]) {
  // 定义校验规则
  const validationRules = [
    {
      condition: (item: CustomPatientDaLongtermView) => adviceType === 'long' && !item.doctorCreateTime,
      message: '请选择开立日期',
    },
    {
      condition: item => !item.roomItemListId || item.roomItemListId === '0', // 医嘱被停用后roomItemListId会被更新为0，以作区分
      message: '请选择医嘱内容',
    },
    {
      condition: item => item.type !== 'TEXT' && (!item.singleDosage || item.singleDosage <= 0),
      message: '请输入单次用量且单次用量不能为0',
    },
    {
      condition: item => item.type !== 'TEXT' && item.merge && !item.usage,
      message: '请选择用法',
    },
    {
      condition: item => item.type !== 'TEXT' && !item.singleUnit,
      message: '请选择单次用量单位',
    },
    {
      condition: item => !item.dosage || item.dosage <= 0,
      message: '请输入数量且用量不能为0',
    },
    {
      condition: item => !item.unit,
      message: '请选择单位',
    },
    {
      condition: (item: CustomPatientDaLongtermView) => adviceType === 'long' && !item.interval,
      message: '请选择频次',
    },
    {
      condition: (item: CustomPatientDaLongtermView) => adviceType === 'long' && !(item.weekday && item.weekday?.length > 0),
      message: '请选择周执行',
    },
  ]

  // 遍历数组进行校验
  for (const item of array) {
    // 找到第一个不符合规则的校验项
    const invalidRule = validationRules.find(rule => rule.condition(item as any))

    if (invalidRule) {
      showNotify({ type: 'danger', message: invalidRule.message })
      return false
    }
  }
  return true
}
/** 撤销医嘱 */
function handleRevokeAdviceClick(row: CustomPatientDaLongtermView | CustomCureDaView) {
  ElMessageBox.confirm(
    '确认要撤销医嘱吗?',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      appendTo: 'advice-div',
    },
  ).then(async () => {
    const { success } = await cureServiceProxy.revocation(row.groupId)
    if (success) {
      showNotify({ type: 'success', message: `撤销成功` })
      // 提交事件，刷新数据
      emit('updateAdviceData')
    }
  }).catch(() => {
  })
}
/** 作废医嘱 */
function handleInvalidAdviceClick(_row) {
  // 待完善
  ElMessageBox.prompt('请输入作废原因', '作废医嘱', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern:
      /[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
    inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      console.log('val', value)
    })
    .catch(() => {
    })
}
/** 停止医嘱 */
function handleStopAdviceClick(row: CustomPatientDaLongtermView | CustomCureDaView) {
  // 待完善
  ElMessageBox.confirm(
    '确认要停止医嘱吗?',
    '停药',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      appendTo: 'body',
    },
  ).then(async () => {
    const patientDaLongtermServiceProxy = new PatientDaLongtermServiceProxy()
    const { success } = await patientDaLongtermServiceProxy.batch(row.groupId)
    if (success) {
      showNotify({ type: 'success', message: `停嘱成功` })
      // 提交事件，刷新数据
      emit('updateAdviceData')
    }
  }).catch(() => {
  })
}
/** 显示医嘱统计图 */
function handleShowDrugChart(_row) {

}
/** 选择医嘱 */
function handleRoomItemListIdChange(val: RoomItemFullView, row: CustomPatientDaLongtermView | CustomCureDaView) {
  const obj = row as CustomCureDaView
  obj.roomItemListId = val.id
  obj.unitList = val.unitList
  obj.unit = val.unit
  obj.unitBase = val.unitBase
  obj.usage = val.usageMode
  obj.name = val.name
  obj.type = formatType(val.typeCode)
  obj.typeName = formatType(val.typeCode, false)
  obj.enabled = val.enabled
  obj.specLabel = val.spec
  obj.singleUnit = val.unitBase
  if (val.spec) {
    const dosage = val.spec?.split('/')
    if (obj.type === 'DRUG') {
      obj.singleDosage = Number(dosage[0])
    }
    obj.singleUnit = dosage[1] || obj.singleUnit
  }
  if (row.merge) {
    row.usage = val.usageMode
  }
  handleChangeSingleDosage(row)
}
function formatType(typeCode, isType = true) {
  if (typeCode.includes('.DRUG')) {
    return isType ? 'DRUG' : '药品'
  }
  else if (typeCode.includes('.CONSUMABLE')) {
    return isType ? 'CONSUMABLE' : '耗材'
  }
  else if (typeCode.includes('.PROJECT')) {
    return isType ? 'NURSING' : '护理'
  }
  else {
    return ''
  }
}
/** 变更医嘱单次用量 */
function handleChangeSingleDosage(row: CustomPatientDaLongtermView | CustomCureDaView) {
  if (row.type === 'DRUG') {
    const spec = row.specLabel?.split('/')?.[0]
    if (spec) {
      row.dosage = Math.ceil(row.singleDosage / Number(spec))
    }
  }
}
defineExpose({
  isEdit,
  addAdviceData,
  saveAllAdviceData,
  addTmplAdviceData,
})
</script>

<style scoped>

</style>
