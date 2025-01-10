/**
 * 获取加载图片地址
 * examples: bg/bg.png
 * @param imgPath
 */
export function requireImg(imgPath: string) {
  return new URL(`../assets/${imgPath}`, import.meta.url).href
}
