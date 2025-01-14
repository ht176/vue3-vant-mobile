<template>
  <el-alert v-show="getAbnormal.length > 0" title="异常信息" type="error" :closable="false">
    <div v-for="item in getAbnormal" :key="item.type">
      {{ item.message }}
    </div>
  </el-alert>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const props = defineProps({
  patientId: String, // 患者Id
  sbp: { type: [String, Number] }, // 收缩压
  dbp: { type: [String, Number] }, // 舒张压
  bloodPressureShow: { type: Boolean, default: true }, // 血压是否显示
  ufg: { type: [String, Number] }, // 预脱
  ufgShow: { type: Boolean, default: true }, // 预脱是否显示
  bestWeight: { type: [String, Number] }, // 干体重
  pulse: { type: [String, Number] }, // 脉搏
  pulseShow: { type: Boolean, default: true }, // 脉搏是否显示
  temp: { type: [String, Number] }, // 体温
  tempShow: { type: Boolean, default: true }, // 体温是否显示
})

const { getParametersValue, getPatientThresholdSettingById } = useAppStore()

/** 患者个人生命体征阈值 */
const patientThreshold = computed(() => {
  return getPatientThresholdSettingById(props.patientId)
})
/** 血压单位 */
const paramBpUnit = getParametersValue('VITALSIGNS.BP.UNIT')
/** 收缩压最高值 */
const paramMaxSbpValue = patientThreshold.value ? patientThreshold.value.sbpHigh : getParametersValue('VITALSIGNS.SBP.HIGH')
/** 收缩压最低值 */
const paramMinSbpValue = patientThreshold.value ? patientThreshold.value.sbpLower : getParametersValue('VITALSIGNS.SBP.LOWER')
/** 舒张压最高值 */
const paramMaxDbpValue = patientThreshold.value ? patientThreshold.value.dbpHigh : getParametersValue('VITALSIGNS.DBP.HIGH')
/** 舒张压最低值 */
const paramMinDbpValue = patientThreshold.value ? patientThreshold.value.dbpLower : getParametersValue('VITALSIGNS.DBP.LOWER')
/** 预脱百分比 */
const paramUfgPercentage = patientThreshold.value ? patientThreshold.value.ufgPercentage : getParametersValue('VITALSIGNS.UFG.PERCENTAGE')
/** 预脱单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 脉博最高值 */
const paramMaxPulseValue = patientThreshold.value ? patientThreshold.value.pulseHigh : getParametersValue('VITALSIGNS.PULSE.HIGH')
/** 脉搏最低值 */
const paramMinPulseValue = patientThreshold.value ? patientThreshold.value.pulseLower : getParametersValue('VITALSIGNS.PULSE.LOWER')
/** 体温最高值 */
const paramMaxTempValue = patientThreshold.value ? patientThreshold.value.tempHigh : getParametersValue('VITALSIGNS.TEMP.HIGH')
/** 体温最低值 */
const paramMinTempValue = patientThreshold.value ? patientThreshold.value.tempLower : getParametersValue('VITALSIGNS.TEMP.LOWER')
/** 异常信息 */
const getAbnormal = computed(() => {
  const array: AbnormalInfo[] = []
  if (props.bloodPressureShow && props.sbp && (Number(paramMaxSbpValue) < Number(props.sbp) || (Number(paramMinSbpValue) > Number(props.sbp)))) {
    array.push({
      type: 'sbp',
      message: `收缩压不在范围内（ 参考范围：${paramMinSbpValue}${paramBpUnit} ~ ${paramMaxSbpValue}${paramBpUnit}）`,
    })
  }
  if (props.bloodPressureShow && props.dbp && (Number(paramMaxDbpValue) < Number(props.dbp) || (Number(paramMinDbpValue) > Number(props.dbp)))) {
    array.push({
      type: 'dbp',
      message: `舒张压不在范围内（ 参考范围：${paramMinDbpValue}${paramBpUnit} ~ ${paramMaxDbpValue}${paramBpUnit}）`,
    })
  }
  if (props.ufgShow && props.bestWeight && (paramUfgPercentage || paramUfgPercentage === 0) && (props.ufg || props.ufg === 0)) {
    const calculatedValue = paramUfgUnit === 'kg' ? Number(props.bestWeight) * (Number(paramUfgPercentage) / 100) : (Number(props.bestWeight) * (Number(paramUfgPercentage) / 100)) * 1000
    if (calculatedValue < Number(props.ufg)) {
      array.push({ type: 'ufg', message: '预脱不在范围内' })
    }
  }
  if (props.pulseShow && props.pulse && (Number(paramMaxPulseValue) < Number(props.pulse) || (Number(paramMinPulseValue) > Number(props.pulse)))) {
    array.push({
      type: 'pulse',
      message: `脉搏不在范围内（ 参考范围：${paramMinPulseValue}次/分~${paramMaxPulseValue}次/分）`,
    })
  }
  if (props.tempShow && props.temp && (Number(paramMaxTempValue) < Number(props.temp) || (Number(paramMinTempValue) > Number(props.temp)))) {
    array.push({
      type: 'temp',
      message: `脉搏不在范围内（ 参考范围：${paramMinTempValue}次/分~${paramMaxTempValue}次/分）`,
    })
  }
  return array
})
</script>

<style scoped lang="less">
</style>
