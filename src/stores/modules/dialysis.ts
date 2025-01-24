import type { PatientVascularAccessView } from '@/services/PatientServiceProxies'
import type { TmplAnticoagulantView, TmplDaGroupView, TmplDialysate, TmplDisinfectInstructionsView } from '@/services/TmplServiceProxies'
import type { DevDisinfectSettingView } from '@/services/WebApiServiceProxies'
import { defineStore } from 'pinia'

const useDialysisStore = defineStore('dialysis', () => {
  /** 医嘱模板数据 */
  const adviceTempList = ref<TmplDaGroupView[]>([])
  /** 医嘱模板赋值 */
  function setAdviceTempList(val: TmplDaGroupView[]) {
    adviceTempList.value = val
  }
  /** 抗凝剂列表 */
  const anticoagulantList = ref<TmplAnticoagulantView[]>([])
  /** 抗凝剂列表赋值 */
  function setAnticoagulantList(val: TmplAnticoagulantView[]) {
    anticoagulantList.value = val
  }
  /** 透析液列表 */
  const dialysateList = ref<TmplDialysate[]>([])
  /** 透析液列表赋值 */
  function setDialysateList(val: TmplDialysate[]) {
    dialysateList.value = val
  }
  /** 透析流程-当前选中患者的血管通路列表 */
  const selectDialysisPatientVascularAccessList = ref<PatientVascularAccessView[]>([])
  function setSelectDialysisPatientVascularAccessList(val: PatientVascularAccessView[]) {
    selectDialysisPatientVascularAccessList.value = val
  }
  /** 消毒配置 */
  const devDisinfectSettingList = ref<DevDisinfectSettingView[]>([])
  /** 消毒配置赋值 */
  function setDevDisinfectSettingList(val: DevDisinfectSettingView[]) {
    devDisinfectSettingList.value = val
  }
  /**
   * 根据设备类型、型号、班次查询消毒配置
   * @param devType - 设备类型
   * @param devModel - 设备型号
   * @param cureShiftId - 班次Id
   * @returns {DevDisinfectSettingView | null} 消毒配置数据
   */
  function getDevDisinfectSettingData(devType, devModel, cureShiftId) {
    return devDisinfectSettingList.value.find(x => x.devType === devType && x.devModel === devModel && x.cureShiftId === cureShiftId)
  }
  /** 消毒说明模板 */
  const tmplDisinfectInstructionList = ref<TmplDisinfectInstructionsView[]>([])
  /** 消毒说明模板赋值 */
  function setTmplDisinfectInstructionList(val: TmplDisinfectInstructionsView[]) {
    tmplDisinfectInstructionList.value = val
  }
  return {
    adviceTempList,
    setAdviceTempList,
    anticoagulantList,
    setAnticoagulantList,
    dialysateList,
    setDialysateList,
    selectDialysisPatientVascularAccessList,
    setSelectDialysisPatientVascularAccessList,
    tmplDisinfectInstructionList,
    setTmplDisinfectInstructionList,
    devDisinfectSettingList,
    setDevDisinfectSettingList,
    getDevDisinfectSettingData,
  }
}, {
  persist: true,
})

export default useDialysisStore
