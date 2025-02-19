import { ref } from "vue"
import { useTemplateStore } from '@/stores'

export function useTemplateInfo(key) {

  const prompt = ref(null)

  getFromLocal()

  function getFromLocal() {
    const templateStore = useTemplateStore()
    const find = templateStore.templateState.prompts.find(v => v.key === key)
    prompt.value = find ? find : { id: '', key: '', value: '' }
  }

  return {
    prompt,
  }
}

export function updateTemplateInfo({ id, key, value }) {
  const templateStore = useTemplateStore()
  if (templateStore.addPrompt({ key, value })) return
  templateStore.updatePrompt(id, key, value)
}