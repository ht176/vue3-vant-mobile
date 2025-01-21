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
    anticoagulantList.value = val
  }
  return {
    adviceTempList,
    setAdviceTempList,
    anticoagulantList,
    setAnticoagulantList,
    dialysateList,
    setDialysateList,
  }
}, {
  persist: true,
})

export default useDialysisStore
