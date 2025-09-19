import enUS from '@/locales/en-US.json'

import { createI18n } from 'vue-i18n'

const messages: { [key: string]: any } = {
  'en-US': enUS,
}

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages,
})

export default i18n
