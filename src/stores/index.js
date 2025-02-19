import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/siteStore'
export * from './modules/chatStore'
export * from './modules/agentStore'
export * from './modules/templateStore'