import { useAgentStore } from "@/stores"

export function useCreateAgent({ name, model, prompt, persona, weight }) {

  createAgentLocal()

  function createAgentLocal() {
    const agentStore = useAgentStore()

    agentStore.addAgent({
      model,
      agentName: name,
      agentPersona: prompt,
      humanPersona: persona,
      weight: weight || 0
    })
  }

}
export function useDelAgent(agentId) {

  delLocal()

  function delLocal() {
    const agentStore = useAgentStore()
    agentStore.removeAgent(agentId)
  }
}

export function useUpdateAgent({ id, name, model, prompt, weight }) {

  updateLocal()

  function updateLocal() {
    const agentStore = useAgentStore()
    agentStore.updateAgent({
      id,
      agentName: name,
      model,
      agentPersona: prompt,
      weight: weight || 0
    })
  }
}

export default {
  useCreateAgent,
  useDelAgent,
  useUpdateAgent
}
