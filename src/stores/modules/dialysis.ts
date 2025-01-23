import type { PatientVascularAccessView } from '@/services/PatientServiceProxies'
import type { TmplAnticoagulantView, TmplDaGroupView, TmplDialysate } from '@/services/TmplServiceProxies'
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
  return {
    adviceTempList,
    setAdviceTempList,
    anticoagulantList,
    setAnticoagulantList,
    dialysateList,
    setDialysateList,
    selectDialysisPatientVascularAccessList,
    setSelectDialysisPatientVascularAccessList,
  }
}, {
  persist: true,
})

export default useDialysisStore
