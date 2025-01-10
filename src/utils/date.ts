/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm:ss'
const TIME_FORMAT_H_M = 'HH:mm'
const YEAR_FORMAT = 'YYYY'

export function formatToDateTime(
  date: dayjs.Dayjs | Date | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function formatToDate(
  date: dayjs.Dayjs | Date | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return date ? dayjs(date).format(format) : ''
}
export function getNowDate() {
  return dayjs(formatToDate(new Date()))
}

export function formatToTime(
  date: dayjs.Dayjs | Date | undefined = undefined,
  format = TIME_FORMAT,
): string {
  return date ? dayjs(date).format(format) : ''
}

export function formatToTimeHM(
  date: dayjs.Dayjs | Date | undefined = undefined,
  format = TIME_FORMAT_H_M,
): string {
  return date ? dayjs(date).format(format) : ''
}

export function formatToYear(
  date: dayjs.Dayjs | Date | undefined = undefined,
  format = YEAR_FORMAT,
): string {
  return date ? dayjs(date).format(format) : ''
}

export const dateUtil = dayjs
