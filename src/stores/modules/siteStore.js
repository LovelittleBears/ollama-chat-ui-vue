import { ref } from 'vue'
import { defineStore } from 'pinia'
import { local } from '@/utils/storage'

export const useSiteStore = defineStore('site', () => {
  const siteState = ref({
    activeAgentId: '',
    chatBarW: '220px',
    theme: '',
    autoScroll: false,
  })

  _init()

  const setState = (key, val) => (siteState.value[key] = val, _recordState())

  const setChatBarW = w => setState('chatBarW', w)
  const setTheme = theme => setState('theme', theme)
  const setActiveAgentId = id => setState('activeAgentId', id)
  const setAutoScroll = autoScroll => setState('autoScroll', autoScroll)

  const _reset = () => {
    siteState.value.activeAgentId = ''
    siteState.value.chatBarW = '220px'
    siteState.value.theme = ''
    siteState.value.autoScroll = false
    local.delItem('siteState')
  }

  function _init() {
    const state = JSON.parse(local.getItem('siteState'))
    if (state) Object.assign(siteState.value, state)
  }

  function _recordState() {
    local.setItem('siteState', JSON.stringify(siteState.value))
  }

  return {
    siteState,
    setChatBarW,
    setActiveAgentId,
    setTheme,
    setAutoScroll,
    _reset
  }
})