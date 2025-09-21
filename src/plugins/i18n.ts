import enUS from '@/locales/en-US.json'
import arSA from '@/locales/ar-SA.json'

import { createI18n } from 'vue-i18n'

const messages: { [key: string]: any } = {
  'en-US': enUS,
  'ar-SA': arSA,
}

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages,
})

interface Translation {
  (key: string): string
}

export const $t = i18n.global.t as Translation


export default i18n
