// import { TOKEN_MENU_STORAGE_NAME, TOKEN_USER_STORAGE_NAME, UID_STORAGE_NAME } from './constant'
// import { useLocalStorage } from '@vueuse/core'

// import { decrypt, encrypt } from './crypto'

// /**
//  * 新增本地数据
//  * @param name
//  * @param value
//  */
// function setLocalStorage(name: string, value: string) {
//   name = encrypt(name)
//   value = encrypt(value)
//   const storage = useLocalStorage(name, '')
//   storage.value = value
// }

// /**
//  * 获取本地数据
//  * @param name
//  */
// function getLocalStorage(name: string) {
//   name = encrypt(name)
//   const storage = useLocalStorage(name, '')
//   return storage.value ? decrypt(storage.value) : null
// }

// /**
//  * 清除本地数据
//  * @param name
//  */
// function clearLocalStorage(name: string) {
//   name = encrypt(name)
//   if (localStorage) {
//     localStorage[name] && (delete localStorage[name])
//   }
//   else { cookie.remove(name) }
// }

// /**
//  * 新增SessionStorage数据
//  * @param name
//  * @param value
//  */
// function saveSessionStorage(name: string, value: string) {
//   // value = encrypt(value)
//   if (sessionStorage) {
//     sessionStorage[name] = value
//   }
//   else { cookie.set(name, value) }
// }

// /**
//  * 获取SessionStorage数据
//  * @param name
//  * @returns {null} 返回SessionStorage数据
//  */
// function findSessionStorage(name: string) {
//   let value = null
//   if (sessionStorage) {
//     value = sessionStorage[name] || null
//   }
//   else { value = cookie.get(name) || null }

//   if (!value) {
//     return null
//   }

//   try {
//     return value
//     // return decrypt(value)
//   }
//   // eslint-disable-next-line unused-imports/no-unused-vars
//   catch (e) {
//     return null
//   }
// }

// /**
//  * 清除SessionStorage数据
//  * @param name
//  */
// function clearSessionStorage(name: string) {
//   if (sessionStorage) {
//     sessionStorage[name] && (delete sessionStorage[name])
//   }
//   else { cookie.remove(name) }
// }

// /**
//  * 获取用户信息
//  * @returns {null} -返回用户信息
//  */
// function getUser() {
//   const temp = getLocalStorage(TOKEN_USER_STORAGE_NAME)
//   try {
//     const user = JSON.parse(temp)
//     if (user) {
//       return user
//     }
//     return null
//   }
//   // eslint-disable-next-line unused-imports/no-unused-vars
//   catch (e) {
//     return null
//   }
// }
// /**
//  * 保存用户信息
//  * @param user
//  */
// function setUser(user) {
//   setLocalStorage(TOKEN_USER_STORAGE_NAME, JSON.stringify(user))
// }

// /**
//  * 清除用户信息
//  */
// function clearUser() {
//   clearLocalStorage(TOKEN_USER_STORAGE_NAME)
// }

// /**
//  * 获取记住的用户名
//  * @returns {*} 返回记住的用户名
//  */
// function getRememberUid() {
//   return getLocalStorage(UID_STORAGE_NAME)
// }
// /**
//  * 保存记住的用户名
//  * @param uid
//  */
// function setRememberUid(uid) {
//   setLocalStorage(UID_STORAGE_NAME, uid)
// }

// /**
//  * 清除记住的用户名
//  */
// function clearRememberUid() {
//   clearLocalStorage(UID_STORAGE_NAME)
// }
// /**
//  * 获取菜单
//  * @returns {null} -返回菜单
//  */
// function getMenus() {
//   const temp = findSessionStorage(TOKEN_MENU_STORAGE_NAME)

//   if (temp == null) {
//     return null
//   }
//   try {
//     const menus = JSON.parse(temp)
//     // const { insertTime, expireInterval } = menus
//     // if (moment(insertTime) + expireInterval * 1000 >= moment().valueOf()) { return menus }
//     return menus
//     // return null
//   }
//   // eslint-disable-next-line unused-imports/no-unused-vars
//   catch (e) {
//     return null
//   }
// }
// /**
//  * 保存菜单
//  * @param menus
//  */
// function setMenus(menus) {
//   saveSessionStorage(TOKEN_MENU_STORAGE_NAME, JSON.stringify(menus))
// }
// /**
//  * 清除菜单
//  */
// function clearMenus() {
//   clearSessionStorage(TOKEN_MENU_STORAGE_NAME)
// }
// function setSessionStorage(name, value) {
//   saveSessionStorage(name, JSON.stringify(value))
// }
// function setSessionStorage2(name, value) {
//   saveSessionStorage(name, value)
// }
// function getSessionStorage(name) {
//   const temp = findSessionStorage(name)
//   return JSON.parse(temp)
// }
// function getSessionStorage2(name) {
//   const temp = findSessionStorage(name)
//   return temp
// }
// function deleteSessionStorage(name) {
//   return clearSessionStorage(name)
// }
// /** * 今日就诊筛选条件 */
// function setCureFilter(key, value) {
//   setLocalStorage(key, value)
// }
// function getCureFilter(key) {
//   return getLocalStorage(key)
// }
// function clearCureFilter(key) {
//   clearLocalStorage(key)
// }
// /** * 透前/透中/透后筛选条件 */
// function setManageFilter(key, value) {
//   setLocalStorage(key, value)
// }
// function getManageFilter(key) {
//   return getLocalStorage(key)
// }
// function clearManageFilter(key) {
//   clearLocalStorage(key)
// }
// export {
//   setLocalStorage,
//   getLocalStorage,
//   clearLocalStorage,
//   getUser,
//   setUser,
//   clearUser,
//   getRememberUid,
//   setRememberUid,
//   clearRememberUid,
//   getMenus,
//   setMenus,
//   clearMenus,
//   setSessionStorage,
//   setSessionStorage2,
//   getSessionStorage,
//   getSessionStorage2,
//   deleteSessionStorage,
//   setCureFilter,
//   getCureFilter,
//   clearCureFilter,
//   setManageFilter,
//   getManageFilter,
//   clearManageFilter,
// }
