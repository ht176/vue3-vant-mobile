import type { CureShift, DialysisTreeView, RoleRightMenuListView } from '@/services/WebApiServiceProxies'
import type { PatientThresholdSettingView } from '@/services/PatientServiceProxies'
import type { RoomItemFullView } from '@/services/RoomItemListServiceProxies'
import type { SysDicAllView, SysSettingView } from '@/services/SysServiceProxies'
import { SysFieldItemView } from '@/services/SysServiceProxies'
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
  function getParametersValue(code: string, boolean: true, defaults?: boolean): boolean
  function getParametersValue(code: string, boolean?: false, defaults?: string): string
  function getParametersValue(code: string, boolean: boolean = false, defaults: string | boolean = ''): string | boolean {
    const itemFind = sysSettingList.value.find(_ => _.code === code)
    if (itemFind) {
      return boolean ? itemFind.value === '1' : itemFind.value
    }
    return defaults
  }
  /** 菜单列表 */
  const menuList = ref<RoleRightMenuListView[]>([])
  function setMenuList(val: RoleRightMenuListView[]) {
    menuList.value = val
  }
  /**
   * 根据参数代码从系统设置列表中获取参数。
   */
  function getParameterData(code: string) {
    return sysSettingList.value.find(_ => _.code === code)
  }
  /** 流程自定义字段 */
  const sysFiledList = ref<SysFieldItemView[]>([])
  function setSysFiledList(val: SysFieldItemView[]) {
    sysFiledList.value = val.map((x) => {
      return new SysFieldItemView({
        ...x,
        value: x.value.charAt(0).toLowerCase() + x.value.slice(1),
      })
    })
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
  /** 患者生命体征阈值 */
  const patientThresholdSettingList = ref<PatientThresholdSettingView[]>([])
  function setPatientThresholdSettingList(val: PatientThresholdSettingView[]) {
    patientThresholdSettingList.value = val
  }
  /** 根据患者Id查询患者生命体征阈值 */
  function getPatientThresholdSettingById(id: string) {
    return patientThresholdSettingList.value.find(x => x.patientId === id)
  }
  const drugList = ref<RoomItemFullView[]>([])
  /** 药品数据 */
  function setDrugList(val: RoomItemFullView[]) {
    drugList.value = val
  }
  /** 耗材数据 */
  const consumableList = ref<RoomItemFullView[]>([])
  function setConsumableList(val: RoomItemFullView[]) {
    consumableList.value = val
  }
  /** 项目数据 */
  const projectList = ref<RoomItemFullView[]>([])
  function setProjectList(val: RoomItemFullView[]) {
    projectList.value = val
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
    menuList,
    setMenuList,
    sysFiledList,
    setSysFiledList,
    dicDataList,
    setDicDataList,
    getDicDataByCode,
    patientThresholdSettingList,
    setPatientThresholdSettingList,
    getPatientThresholdSettingById,
    getParameterData,
    drugList,
    setDrugList,
    consumableList,
    setConsumableList,
    projectList,
    setProjectList,
  }
}, {
  persist: true,
})

export default useAppStore
