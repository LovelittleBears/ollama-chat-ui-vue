/* 
  提供统一的 API ，如果已明确则无需使用
*/
const session = {
  setItem: (key, val) => sessionStorage.setItem(key, val),
  getItem: (key) => sessionStorage.getItem(key),
  delItem: (key) => sessionStorage.removeItem(key)
}

const local = {
  setItem: (key, val) => localStorage.setItem(key, val),
  getItem: (key) => localStorage.getItem(key),
  delItem: (key) => localStorage.removeItem(key)
}

export {
  session,
  local,
}