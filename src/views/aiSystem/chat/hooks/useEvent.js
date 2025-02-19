// 给代码块加上复制及行号切换事件

let isShowLN = true

export default function useEvent() {

  onCopyCode()
  onToggleLN()

  function onCopyCode() {
    const selects = document.getElementsByClassName('copy-action')
    for (const cur of selects) {
      cur.addEventListener('click', () => {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(cur.parentNode)
        selection.removeAllRanges()
        selection.addRange(range)
      })
    }
  }

  function onToggleLN() {
    const selects = document.getElementsByClassName('ln-action')
    for (const cur of selects) cur.addEventListener('click', toggleNL)

    function toggleNL() {
      const ln = document.getElementsByClassName('line-numbers-rows')
      const pres = document.getElementsByTagName('pre')
      if (isShowLN) {
        for (const cur of pres) cur.style.paddingLeft = '0'
        for (const cur of ln) cur.style.display = 'none'
      } else {
        for (const cur of pres) cur.style.paddingLeft = '40px'
        for (const cur of ln) cur.style.display = 'block'
      }
      isShowLN = !isShowLN
    }
  }
}