import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import i18n from '@/plugins/i18n'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})


router.beforeEach((to, _, next) => {
  const { t } = i18n.global
  let title = t('title')
  if (to.meta.title) title = `${t(`menu.${to.meta.title}`)} - ${title}`

  document.title = title
  next()
})


export default router
