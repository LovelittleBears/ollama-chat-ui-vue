import { ref } from "vue"
import { useAgentStore, useSiteStore } from "@/stores"

export default function useActiveAgentInfo() {

  const agentInfo = ref(null)
  const siteStore = useSiteStore()
  const agentStore = useAgentStore()
  const id = siteStore.siteState.activeAgentId
  if (!id) {
    siteStore.setActiveAgentId('')
    return agentInfo
  }
  getFromLocal(id)

  function getFromLocal(id) {
    if (agentStore.agentState.agents.length > 0) {
      agentInfo.value = agentStore.agentState.agents.find(v => v.id === id)
    }
  }

  return agentInfo
}