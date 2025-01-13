import type { CureShift } from '@/services/CureV1_2ServiceProxies'
import type { DialysisTreeView } from '@/services/DeptV1ServiceProxies'
import type { SysDicAllView, SysFieldItemView, SysSettingView } from '@/services/SysServiceProxies'
import { defineStore } from 'pinia'
import type { ConfigProviderTheme } from 'vant'

export interface AppStore {
  switchMode: (val: ConfigProviderTheme) => void
}

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const useAppStore = defineStore('app', () => {
  const theme = prefersDark ? 'dark' : 'light'
  const mode = ref<ConfigProviderTheme>(theme)
  const switchMode = (val: ConfigProviderTheme) => {
    mode.value = val
  }
  // 全局透析班次
  const dialysisShiftList = ref<CureShift[]>([])
  function setDialysisShifts(val: CureShift[]) {
    dialysisShiftList.value = val
  }
  // 全局透析分区
  const dialysisAreaList = ref<DialysisTreeView[]>([])
  function setDialysisAreas(val: DialysisTreeView[]) {
    dialysisAreaList.value = val
  }
  // 全局参数
  const sysSettingList = ref<SysSettingView[]>([])
  function setSettingList(val: SysSettingView[]) {
    sysSettingList.value = val
  }
  /**
   * 根据参数代码从系统设置列表中获取参数值。
   * @param code - 要获取的参数的代码。
   * @param boolean - 如果为 true，则返回一个布尔值，指示参数值是否为 '1'。默认为 false。
   * @param defaults - 如果未找到参数，则返回的默认值。默认为空字符串。
   * @returns 如果找到参数，则返回参数值，否则返回默认值。如果 `boolean` 为 true，则返回布尔值。
   */
  function getParametersValue(code: string, boolean: boolean = false, defaults: string = '') {
    const itemFind = sysSettingList.value.find(_ => _.code === code)
    if (itemFind) {
      return boolean ? itemFind.value === '1' : itemFind.value
    }
    return defaults
  }
  const sysFiledList = ref<SysFieldItemView[]>([])
  function setSysFiledList(val: SysFieldItemView[]) {
    sysFiledList.value = val
  }
  const dicDataList = ref<SysDicAllView[]>([])
  function setDicDataList(val: SysDicAllView[]) {
    dicDataList.value = val
  }
  /** 根据字典code获取字典明细 */
  function getDicDataByCode(code: string) {
    return dicDataList.value.find(x => x.sysDicTypeCode === code)?.child?.map((x) => {
      return { ...x, name: x.customLabel || x.name }
    }) || []
  }
  return {
    mode,
    switchMode,
    dialysisShiftList,
    setDialysisShifts,
    dialysisAreaList,
    setDialysisAreas,
    sysSettingList,
    setSettingList,
    getParametersValue,
    sysFiledList,
    setSysFiledList,
    dicDataList,
    setDicDataList,
    getDicDataByCode,
  }
}, {
  persist: true,
})

export default useAppStore
