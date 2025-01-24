<template>
  <div class="py-2">
    <div>
      <slot name="header">
        今日收费项目
      </slot>
    </div>
    <el-table class="mt-2" :data="chargeTableData" show-summary :summary-method="getSummaries" border style="width: 100%">
      <el-table-column prop="name" label="项目" />
      <el-table-column prop="type" label="类别" />
      <el-table-column prop="price" label="单价(￥)" />
      <el-table-column prop="count" label="数量" :formatter="formatterCount" />
      <el-table-column prop="total" label="总价(￥)" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CureServiceProxy } from '@/services/CureServiceProxies'
import type { CureChargeView, CureTodayView } from '@/services/CureServiceProxies'
import type { TableColumnCtx } from 'element-plus'

interface SummaryMethodProps<T = CureChargeView> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
const { cureData } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
})
const chargeTableData = ref<CureChargeView[]>([])
onMounted(() => {
  getChargeData()
})
/** 查询今日收费项目 */
async function getChargeData() {
  const cureServiceProxy = new CureServiceProxy()
  const filter = {
    pageIndex: 1,
    pageSize: 1000,
  }
  const { success, data } = await cureServiceProxy.chargeCure(cureData.cureRecordId, JSON.stringify(filter))
  if (success) {
    chargeTableData.value = data
  }
}
function formatterCount(row: CureChargeView) {
  return row.count + row.unit
}
function getSummaries({ columns, data }: SummaryMethodProps) {
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (column.property === 'name') {
      sums[index] = '合计'
    }
    else if (column.property === 'total') {
      // 计算总价合计
      const totalSum = data.reduce((sum, row) => sum + (row.total || 0), 0)
      sums[index] = totalSum.toString()
    }
    else {
      sums[index] = ''
    }
  })
  return sums
}
</script>

<style scoped>

</style>
