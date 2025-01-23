<template>
  <div class="py-2">
    <div class="flex justify-between">
      项目
      <el-button @click="handleEditClick">
        编辑
      </el-button>
    </div>
    <el-table :data="formData.cureCostGroups" border>
      <el-table-column label="项目类型">
        <template #default="scope">
          {{ scope.row.roomItemTypeName }}
          <template v-if="stepType === 'MakePrescription' && paramInventoryDeduction && paramPrescriptionConsumable">
            <span v-if="scope.row.enabled === 0" class="text-red">【已停用】</span>
            <span v-if="scope.row.inventoryCount <= 0" class="text-red">【库存不足】</span>
          </template>
          <span v-if="scope.row.code && isCheck && paramHighValueConsumables" style="color:red">【已扫码核对】</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="roomItemListName" />
      <el-table-column v-if="paramHighValueConsumables" label="批号" prop="batchNo" />
      <el-table-column label="数量" prop="count" />
      <el-table-column v-if="paramConsumableDevbarcode && paramHighValueConsumables" label="条码" prop="devBarCode" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button v-if="!cureData.hasVerifyMiddle" @click="handleRemoveItemClick(scope.$index)">
            删除
          </el-button>
          <el-button v-show="isShowScan(scope.row.RoomItemTypeName)" @click="handleScanClick(scope.row)">
            {{ scope.row.DevBarCode ? '已扫码' : '扫码' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { CureTodayView, OnCureMiddleView, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView | OnCureMiddleView>,
    required: true,
  },
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})
const emit = defineEmits(['update:modelValue'])
/** 是否核对-待完善 */
const isCheck = false
const formData = computed<PrescriptionCureBeforeView>({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  },
})
const { getParametersValue } = useAppStore()
/** 启用库存扣减 0-停用 1-启用 */
const paramInventoryDeduction = getParametersValue('ROOM.INVENTORY.DEDUCTION', true)
/** 医生制定处方时是否必须指定耗材 0-关闭 1-开启 */
const paramPrescriptionConsumable = getParametersValue('CUREFLOW.PRESCRIPTION.CONSUMABLE', true)
/** 启用后耗材/药品支持批号入库管理，支持流程扫码及条码展示 */
const paramHighValueConsumables = getParametersValue('ROOM.INVENTORY.HIGHVALUECONSUMABLES', true)
/** 是否使用高值耗材条码 */
const paramConsumableDevbarcode = getParametersValue('CUREFLOW.DISPLAY.CONSUMABLE.DEVBARCODE', true)
/** 启用透析流程高值耗材扫码 */
const paramScan = getParametersValue('IOT.CONSUMABLE.SCAN', true)

/** 编辑 */
function handleEditClick() {

}
/** 删除项目 */
function handleRemoveItemClick(index) {
  formData.value.cureCostGroups.splice(index, 1)
}
function isShowScan(val) {
  if (!paramScan && !paramHighValueConsumables) {
    return false
  }
  if (props.stepType === 'OperateComputer') {
    return ['透析器', '灌流器', '血滤器', '血路管'].includes(val) && paramConsumableDevbarcode && !props.cureData.hasOnMiddle
  }
  else if (props.stepType === 'CrossCheck') {
    return ['透析器', '灌流器', '血滤器', '血路管'].includes(val) && paramConsumableDevbarcode
  }
  return false
}
function handleScanClick(_row) {

}
</script>

<style scoped>

</style>
