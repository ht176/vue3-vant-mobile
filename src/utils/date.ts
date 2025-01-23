/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('zh-cn')
dayjs.tz.setDefault('Asia/Shanghai')

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
  return formatToDate(dayjs())
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

export const dateUtil = () => formatToDateTime(dayjs()) as unknown as Dayjs
