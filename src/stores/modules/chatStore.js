import { ref } from 'vue'
import { defineStore } from 'pinia'
import { local } from '@/utils/storage'
import { useAgentStore } from './agentStore'

export const useChatStore = defineStore('chat', () => {
  const chatState = ref({
    chatHistory: {}
  })

  _init()

  const getHistory = (agentId) => {
    if (!chatState.value.chatHistory[agentId]) {
      chatState.value.chatHistory[agentId] = []
    }
    return chatState.value.chatHistory[agentId]
  }

  const addChat = (agentId, { inversion, text, timestamp }) => {
    if (!chatState.value.chatHistory[agentId]) {
      chatState.value.chatHistory[agentId] = []
    }

    chatState.value.chatHistory[agentId].push({
      inversion,
      text,
      timestamp: timestamp || new Date().toISOString()
    })

    _recordState(agentId)
  }

  const updateChat = (agentId, idx, text) => {
    _recordState(agentId)
  }

  const removeChat = (agentId) => {
    local.delItem(`chatHistory_${agentId}`)
    if (chatState.value.chatHistory[agentId])
      chatState.value.chatHistory[agentId].length = 0
  }

  const removeChatItem = (agentId, idx) => {
    chatState.value.chatHistory[agentId].splice(idx, 1)
    _recordState(agentId)
  }

  function _init() {
    const agentStore = useAgentStore()
    const agentList = agentStore.agentState.agents
    agentList.forEach(agent => {
      const history = local.getItem(`chatHistory_${agent.id}`)
      if (history) chatState.value.chatHistory[agent.id] = JSON.parse(history)
    })
  }

  function _reset() {
    for (const v in chatState.value.chatHistory) local.delItem(`chatHistory_${v}`)
    chatState.value.chatHistory = {}
  }

  function _recordState(agentId) {
    local.setItem(`chatHistory_${agentId}`, JSON.stringify(chatState.value.chatHistory[agentId]))
  }

  return {
    chatState,
    addChat,
    getHistory,
    updateChat,
    removeChat,
    removeChatItem,
    _reset
  }
})