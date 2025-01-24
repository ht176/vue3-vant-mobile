import { useAppStore } from '@/stores'
import { minus } from 'number-precision'
import { CUREFLOW_BP_POSITION_NOMEASURE, CUREFLOW_WEIGHT_MODE_NOMEASURE } from './constant'

const { getParametersValue, menuList } = useAppStore()

/** 不用填写体重的测量方式 */
const paramNoWeight = getParametersValue(CUREFLOW_WEIGHT_MODE_NOMEASURE)
/**
 * 根据体重测量方式判断是否需要填写
 * @param mode 测量方式
 */
export function disabledWeight(mode: string) {
  if (mode) {
    return paramNoWeight.split(';').includes(mode)
  }
  return false
}
/** 不用填写血压的测量方式 */
const paramNoBooldPosition = getParametersValue(CUREFLOW_BP_POSITION_NOMEASURE)
/**
 * 根据血压测量方式判断是否需要填写
 * @param mode 测量方式
 */
export function disabledSbp(mode: string) {
  if (mode) {
    const list = paramNoBooldPosition.split(';')
    list.push('REJECT')// 拒测
    return list.includes(mode)
  }
  return false
}

/** 预脱计算模式 */
const paramUfgFormulaMode = getParametersValue('CUREFLOW.UFG.FORMULA.MODE')

/**
 * 根据提供的参数计算预脱目标 (Ufg)。
 *
 * @param {CalcUfgModel} val - 包含计算所需参数的模型。
 * @returns {number | null} - 计算出的 Ufg 值，如果条件不满足则返回 null。
 *
 * 该函数执行以下步骤：
 * 1. 如果 `deductionWeight` 为 '-'，则将其设置为空字符串。
 * 2. 定义辅助函数 `parseWeight`，根据单位转换重量。
 * 3. 定义辅助函数 `calculateUfg`，计算 Ufg 值。
 * 4. 根据 `paramUfgFormulaMode`，使用不同的公式计算 Ufg：
 *    - 如果 `paramUfgFormulaMode` 为 '1'，则使用 `beforeWeight`、`deductionWeight` 和 `bestWeight` 计算 Ufg。
 *    - 如果 `paramUfgFormulaMode` 为 '2'，则使用 `beforeWeight`、`deductionWeight`、`lastAfterWeight` 和 `lastDeductionWeight` 计算 Ufg。
 */
export function calcUfgValue(val: CalcUfgModel) {
  if (val.deductionWeight === '-') {
    val.deductionWeight = ''
  }

  const parseWeight = (weight: string | number, unit: string) => {
    return unit === 'kg' ? Number(weight) : Number(weight) / 1000
  }

  const calculateUfg = (beforeWeight: number, deductionWeight: number, targetWeight: number, unit: string) => {
    const ufg = minus(beforeWeight, deductionWeight, targetWeight)
    return unit === 'kg' ? ufg : ufg * 1000
  }

  let ufg = null
  if (paramUfgFormulaMode === '1') {
    // 预脱 = 透前体重-干体重-偏移调整
    if (val.beforeWeight && val.bestWeight && val.beforeWeight > val.bestWeight) {
      const deductionWeight = val.deductionWeight ? parseWeight(val.deductionWeight, val.deductionWeightUnit) : 0
      ufg = calculateUfg(val.beforeWeight, deductionWeight, val.bestWeight, val.ufgUnit)
    }
  }
  else if (paramUfgFormulaMode === '2') {
    // 预脱 = 透前体重-偏移调整-（上次透后体重LastBeforeWeight-上次偏移调整LastDeductionWeight）
    val.lastDeductionWeight = val.lastDeductionWeight === '-' ? 0 : val.lastDeductionWeight
    if (val.beforeWeight && val.lastAfterWeight && val.beforeWeight > val.lastAfterWeight) {
      const deductionWeight = val.deductionWeight ? parseWeight(val.deductionWeight, val.deductionWeightUnit) : 0
      const lastDeductionWeight = val.lastDeductionWeight ? parseWeight(val.lastDeductionWeight, 'g') : 0
      ufg = calculateUfg(val.beforeWeight, deductionWeight, minus(val.lastAfterWeight, lastDeductionWeight), val.ufgUnit)
    }
  }
  return ufg
}
/**
 * 根据提供的参数计算实际脱水量（Ufv）
 * @param beforeWeight 透前体重
 * @param afterWeight 透后体重
 * @param unit 单位（kg或g）
 * @returns {number | null} 计算出的实际脱水量，如果输入无效则返回null
 */
export function calcUfvValue(beforeWeight: string | number, afterWeight: string | number, unit: string): number | null {
  if ((beforeWeight || beforeWeight === 0) && (afterWeight || afterWeight === 0)) {
    const val = minus(beforeWeight, afterWeight)
    return unit === 'kg' ? val : val * 1000
  }
  return null
}
/**
 * 验证权限方法
 * @param {string} key 权限配置代码
 * @returns {boolean} 是否有权限
 */
export function auth(key: string): boolean {
  const authCode = `${key}`
  if (authCode.includes('.')) {
    const menuCode = authCode.substring(0, authCode.lastIndexOf('.'))
    const menu = menuList.find(item => item.code === menuCode)
    if (menu && menu.rights) {
      return menu.rights.some(item => item.code === authCode)
    }
    return false
  }
  return true
}

/**
 * 直接验证权限方法
 * @param {string} key 菜单代码
 * @param {string} code 权限代码
 * @returns {boolean} 是否有权限
 */
export function directAuth(key: string, code: string): boolean {
  const menu = menuList.find(item => item.code === key)
  if (menu && menu.rights) {
    return menu.rights.some(item => item.code.includes(code))
  }
  return false
}
/**
 * 透析单位转换
 * @param {number | string} val 需要转换的值（预脱、偏移调整等需要转换的值）
 * @param {string} unit 目标单位
 * @param {number} conversionFactor 转换因子
 * @returns {number | null} 转换后的值
 */
export function convertDialysisUnit(val: number | string, unit: string, conversionFactor: number = 1000): number | null {
  if (unit === 'kg') {
    return (val || val === 0) ? (Number(val) / conversionFactor) : null
  }
  return (val || val === 0) ? Number(val) : null
}
