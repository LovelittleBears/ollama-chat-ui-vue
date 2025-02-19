import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';
import { local } from '@/utils/storage'

export const useTemplateStore = defineStore('template', () => {
  const templateState = ref({
    prompts: JSON.parse(local.getItem('prompts')) || []
  })

  const addPrompt = function ({ key, value }) {
    // 不能重复
    if (templateState.value.prompts.find(v => v.key === key))
      return false
    templateState.value.prompts.push({
      id: uuidv4(),
      key,
      value
    })
    local.setItem('prompts', JSON.stringify(templateState.value.prompts))
    return true
  }

  const updatePrompt = function (id, key, value) {
    const idx = templateState.value.prompts.findIndex(v => v.id === id)
    if (idx !== -1) {
      templateState.value.prompts[idx].key = key
      templateState.value.prompts[idx].value = value
      local.setItem('prompts', JSON.stringify(templateState.value.prompts))
      return true
    }
    return false
  }

  const removePrompt = function (id) {
    const idx = templateState.value.prompts.findIndex(v => v.id === id)
    if (idx !== -1) {
      templateState.value.prompts.splice(idx, 1)
      local.setItem('prompts', JSON.stringify(templateState.value.prompts))
      return true
    }
    return false
  }

  const _reset = function () {
    templateState.value.prompts = []
    local.delItem('prompts')
  }

  return {
    templateState,
    addPrompt,
    updatePrompt,
    removePrompt,
    _reset
  }
})