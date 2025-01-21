import { v4 as uuidv4 } from 'uuid'

/**
 * 获取加载图片地址
 * examples: bg/bg.png
 * @param imgPath
 */
export function requireImg(imgPath: string) {
  const url = new URL(`src/assets/${imgPath}`, new URL(import.meta.url).origin).href
  return url
}
/** 生成uuid */
export function getUuid() {
  return uuidv4().replace(/-/g, '')
}
