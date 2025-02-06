<template>
  <div>
    <h4 v-if="dataList.length === 0" style="text-align:center;color:#909399">
      暂无转入信息
    </h4>
    <el-timeline style="text-align:left">
      <el-timeline-item v-for="(item, index) in itemArr" :key="item.Id" placement="top" :timestamp="formatToDate(item.item.Date)">
        <el-card class="box-card">
          <template #header>
            <div class="clearfix">
              <span>{{ item.item.typeLabel }}</span>
              <el-button :disabled="itemArr.length === index + 1" style="float: right; padding: 3px 0;color:#93a1a7" type="text" @click="remove(item.item)">
                删除
              </el-button>
              <el-button v-if="item?.item?.quitCause !== 'DIE'" style="float: right; padding: 3px 0;margin-right: 10px" type="text" @click="edit(item.item)">
                编辑
              </el-button>
            </div>
          </template>
          <table>
            <tr v-for="(i, indexs) in item.data" :key="indexs">
              <td width="180px" style="text-align:right;">
                {{ i.type === '转入' ? `${formatToDate(item.item.date)} ${
                  item.item.typeLabel}` : `${i.type}：` }}
              </td>
              <td>
                <el-tag v-for="(value) in i.value" :key="value" type="success" :title="i.type" style="margin: 5px">
                  {{ value }}
                </el-tag>
              </td>
            </tr>
          </table>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import { formatToDate } from '@/utils/date'
import type { PatientPrognosisView } from '@/services/PatientServiceProxies'

const { dataList } = defineProps({
  dataList: { type: Array<PatientPrognosisView> },
})
const emit = defineEmits(['delete', 'edit'])
const itemArr = computed(() => {
  const as = []
  dataList.forEach((item) => {
    const arr = []
    switch (item.type) {
      case 'IN':
        // 转入
        arr.push({
          type: '转入',
          value: [],
        })
        break
      case 'OUT':
        // 转出地点
        arr.push({
          type: '机构所在地',
          value: item.outLocation ? [item.outLocation] : [],
        })
        // 转出原因
        arr.push({
          type: '透析机构名称',
          value: item.outCause === 'OTHER' ? (item.outCauseOther ? [item.outCauseOther] : []) : (item.outCause ? [item.outCause] : []),
        })
        break
      case 'QUIT':
        /*  item.quitDieCauseLabel as any = item.quitDieCauseLabel ? item.quitDieCauseLabel.split(';') : []
        item.quitDieCauseCveLabel as any = item.quitDieCauseCveLabel ? item.quitDieCauseCveLabel.split(';') : []
        item.quitDieCauseMacceLabel as any= item.quitDieCauseMacceLabel ? item.quitDieCauseMacceLabel.split(';') : []
        item.quitDieCauseInfectionLabel as any = item.quitDieCauseInfectionLabel ? item.quitDieCauseInfectionLabel.split(';') : [] */
        // 退出原因
        arr.push({
          type: '退出原因',
          value: item.quitCause === 'OTHER' ? (item.quitCauseOther ? [item.quitCauseOther] : []) : (item.quitCauseLabel ? [item.quitCauseLabel] : []),
        })
        if (item.quitCause === 'DIE') {
          // 死亡原因
          arr.push({
            type: '死亡原因',
            value: item.quitDieCauseLabel,
          })
        }
        break
      default:
        break
    }
    as.push({ item, data: arr })
  })
  return as
})
function remove(item) {
  emit('delete', item)
}
function edit(item) {
  emit('edit', item)
}
</script>
