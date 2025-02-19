import { ref } from "vue"
import { useChatStore } from "@/stores"

export default function useChatHistory(agentId) {

  const chatHistory = ref([])
  const chatStore = useChatStore()
  if (!agentId) return chatHistory
  getFromLocal()

  function getFromLocal() {
    chatHistory.value = chatStore.getHistory(agentId)
  }

  return chatHistory
}