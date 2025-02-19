import { ref } from "vue"
import { useAgentStore, useChatStore } from "@/stores"

export default function useAgentInfo(currPage, pageSize) {

  const agentList = ref([])
  const total = ref(0)

  getFromLocal(currPage, pageSize)

  function getFromLocal(p, s) {
    const agentStore = useAgentStore()
    const chatStore = useChatStore()
    agentList.value = agentStore.agentState.agents
      .sort((a, b) => b.weight - a.weight)
      .slice((p - 1) * s, p * s)
    agentList.value.forEach(v => {
      if (!chatStore.chatState.chatHistory[v.id]) return
      v.chatCount = chatStore.chatState.chatHistory[v.id].length
      v.lastRun = chatStore.chatState.chatHistory[v.id].at(-1)?.timestamp || ''
    })
    total.value = agentStore.agentState.agents.length
  }

  return {
    agentList,
    total,
    getPageData: getFromLocal
  }
}