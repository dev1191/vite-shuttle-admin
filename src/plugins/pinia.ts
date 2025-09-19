import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // pinia plugin

const store = createPinia()
store.use(createPersistedState())

export default store
