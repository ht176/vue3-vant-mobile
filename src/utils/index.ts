/**
 * 获取加载图片地址
 * examples: bg/bg.png
 * @param imgPath
 */
export function requireImg(imgPath: string) {
  const url = new URL(`src/assets/${imgPath}`, new URL(import.meta.url).origin).href
  return url
}
