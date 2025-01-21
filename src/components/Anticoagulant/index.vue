<template>
  <el-col :span="8">
    <el-form-item :label="label" :prop="propName">
      <el-select v-model="formData.anticoagulantName" :placeholder="`请选择${label}`" @change="handleAnticoagulantChange">
        <el-option v-for="item in dialysisStore.anticoagulantList" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
    </el-form-item>
  </el-col>
  <el-col v-if="formData?.classify1" :span="8">
    <el-form-item label="种类：">
      <Dictionary v-model="formData.classify1" :dic-code="DIC_ANTICOAGULANT_TYPE" type="label" />
    </el-form-item>
  </el-col>
  <el-col v-if="formData?.antiTmplType === '低分子肝素模板'" :span="8">
    <el-form-item label="子类：">
      <Dictionary v-model="formData.classify2" :dic-code="DIC_ANTICOAGULANT_LMWH_TYPE" type="select" placeholder="请选择子类" />
    </el-form-item>
  </el-col>
  <template v-else-if="formData?.antiTmplType === '模板1'">
    <el-col :span="8">
      <el-form-item label="首剂：">
        <el-input v-model="formData.first" type="number" placeholder="请输入首剂">
          <template #append>
            <Dictionary v-model="formData.firstUnit" class="!w-20" :dic-code="DIC_ANTICOAGULANT_UNIT" type="select" placeholder="单位" @change="handleFirstUnitChange" />
          </template>
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="追加速率：">
        <el-input v-model="formData.appendRate" type="number" placeholder="请输入追加速率">
          <template #append>
            <Dictionary v-model="formData.appendRateUnit" class="!w-24" :dic-code="DIC_ANTICOAGULANT_UNIT" :option-value="appendRateUnitOptions" type="select" placeholder="单位" />
          </template>
        </el-input>
      </el-form-item>
    </el-col>
  </template>
  <template v-else-if="formData?.antiTmplType === '模板2'">
    <el-col :span="8">
      <el-form-item label="浓度：">
        <el-input v-model="formData.concentration" type="number">
          <template #append>
            %
          </template>
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="速率：">
        <el-input v-model="formData.appendRate" type="number">
          <template #append>
            ml/h
          </template>
        </el-input>
      </el-form-item>
    </el-col>
  </template>
  <template v-if="formData?.antiTmplType === '模板1' || formData?.antiTmplType === '模板2' || formData?.antiTmplType === '模板4' || formData?.antiTmplType === '低分子肝素模板'">
    <el-col v-if="formData?.antiTmplType === '模板4' || formData?.antiTmplType === '低分子肝素模板'" :span="8">
      <el-form-item label="剂量：">
        <el-input v-model="formData.total" type="number">
          <template #append>
            <Dictionary v-model="formData.totalUnit" class="!w-20" :dic-code="DIC_ANTICOAGULANT_UNIT" type="select" placeholder="单位" />
          </template>
        </el-input>
      </el-form-item>
    </el-col>
    <template v-else>
      <el-col :span="8">
        <el-form-item label="追加时间：">
          <el-input v-model="formData.appendTime" type="number">
            <template #append>
              h
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="总量：">
          <el-input v-model="formData.total" type="number">
            <template #append>
              <el-select v-if="formData.antiTmplType === '模板2'" v-model="formData.totalUnit" class="!w-20" placeholder="单位">
                <el-option label="mg" value="mg" />
                <el-option label="g" value="g" />
                <el-option label="ml" value="ml" />
              </el-select>
              <Dictionary v-else v-model="formData.totalUnit" class="!w-20" :dic-code="DIC_ANTICOAGULANT_UNIT" type="select" placeholder="单位" />
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </template>
  </template>
  <el-col v-if="formData?.antiTmplType === '模板4'" :span="8">
    <el-form-item label="追加剂量：">
      <el-input v-model="formData.append" type="number">
        <template #append>
          <Dictionary v-model="formData.appendUnit" class="!w-20" :dic-code="DIC_ANTICOAGULANT_UNIT" type="select" placeholder="单位" />
        </template>
      </el-input>
    </el-form-item>
  </el-col>
  <el-col v-else-if="formData?.antiTmplType === '无抗凝剂'" :span="24">
    <el-form-item label="原因：">
      <el-input v-model="formData.nonReason" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
    </el-form-item>
  </el-col>
  <el-col v-else-if="formData?.antiTmplType === '其它'" :span="24">
    <el-form-item label="其它：">
      <el-input v-model="formData.anticoagulantOther" type="textarea" autosize />
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import type { PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { TmplAnticoagulantServiceProxy } from '@/services/TmplServiceProxies'
import { useAppStore, useDialysisStore } from '@/stores'
import { DIC_ANTICOAGULANT_LMWH_TYPE, DIC_ANTICOAGULANT_TYPE, DIC_ANTICOAGULANT_UNIT } from '@/utils/constant'
import { divide, plus, times } from 'number-precision'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView>,
    required: true,
  },
  propName: {
    type: String,
    default: 'anticoagulantName',
  },
  label: {
    type: String,
    default: '抗凝剂',
  },
})

const emit = defineEmits(['update:modelValue'])
const { getDicDataByCode, getParametersValue } = useAppStore()
const dialysisStore = useDialysisStore()
const formData = computed<PrescriptionCureBeforeView>({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  },
})
let appendRateUnitOptions = []
/** 抗凝剂总量自动计算 */
const paramDosageComputed = getParametersValue('CUREFLOW.ANTI.FORMULA.MODE', true)

onMounted(() => {
  initLoad()
})
async function initLoad() {
  const unitoptions = getDicDataByCode(DIC_ANTICOAGULANT_UNIT).map((x) => {
    return {
      ...x,
      label: x.name,
    }
  })
  appendRateUnitOptions = [...unitoptions.map((x) => {
    return {
      ...x,
      label: `${x.name}/h`,
      value: `${x.value}/h`,
    }
  }), ...unitoptions.map((x) => {
    return {
      ...x,
      label: `${x.name}/0.5h`,
      value: `${x.value}/0.5h`,
    }
  })]
  if (dialysisStore.anticoagulantList.length === 0) {
    await getTmplAnticoagulantData()
  }
}
/** 查询抗凝剂模板 */
async function getTmplAnticoagulantData() {
  const filter = {
    pageIndex: 1,
    pageSize: 1000,
    order: 'Name asc',
  }
  const tmplAnticoagulantServiceProxy = new TmplAnticoagulantServiceProxy()
  const { success, data } = await tmplAnticoagulantServiceProxy.filter(JSON.stringify(filter), undefined)
  if (success) {
    dialysisStore.setAnticoagulantList(data)
  }
}
/**
 * 监听抗凝剂相关字段变化，自动计算总剂量
 * 计算逻辑根据抗凝剂模板类型不同而不同：
 * - 模板1：总剂量 = 首剂量 + (追加速率 * 时间系数 * 追加时间)
 *   - 时间系数：0.5h单位时为2，1h单位时为1
 * - 模板2：总剂量 = (追加速率 * 追加时间 * 浓度) / 100
 *   - 单位转换：mg单位时乘以1000，其他单位保留2位小数
 * 仅在paramDosageComputed为true时执行计算
 */
watch(
  () => [
    formData.value.first,
    formData.value.appendRate,
    formData.value.appendRateUnit,
    formData.value.appendTime,
    formData.value.concentration,
    formData.value.totalUnit,
    formData.value.antiTmplType,
  ],
  () => {
    if (paramDosageComputed) {
      const { first, appendRate, appendRateUnit, appendTime, concentration, totalUnit } = formData.value
      let count = 0
      switch (formData.value.antiTmplType) {
        case '模板1':
          formData.value.total = plus((first || 0), times((appendRate || 0), times(appendRateUnit.includes('0.5h') ? 2 : 1), (appendTime || 0)))
          break
        case '模板2':
          count = divide(times((appendRate || 0), (appendTime || 0), (concentration || 0)), 100)
          formData.value.total = totalUnit === 'mg' ? count * 1000 : Number(count.toFixed(2))
          break
        default:
          break
      }
    }
  },
)
/** 变更抗凝剂 */
function handleAnticoagulantChange() {
  const res = dialysisStore.anticoagulantList.find(x => x.name === formData.value.anticoagulantName)
  if (res) {
    Object.assign(formData.value, {
      antiTmplType: res.antiTmplType,
      classify1: res.classify1,
      classify2: res.classify2,
      first: res.first,
      firstUnit: res.firstUnit,
      appendRate: res.appendRate,
      appendRateUnit: res.appendRateUnit,
      concentration: res.concentration,
      appendTime: res.appendTime,
      total: res.total,
      totalUnit: res.totalUnit,
      append: res.append,
      appendUnit: res.appendUnit,
    })
  }
}
/** 变更首剂单位 */
function handleFirstUnitChange() {
  Object.assign(formData.value, {
    totalUnit: formData.value.firstUnit,
    appendRateUnit: `${formData.value.firstUnit}/h`,
  })
}
</script>

<style>
</style>
