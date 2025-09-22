import NProgress from 'nprogress'
import type { Router } from 'vue-router'

/** Setup plugin NProgress */
export function setupNProgress(router: Router) {

  NProgress.configure({ showSpinner: false })

  router.beforeEach((to, from) => {
    if (to.path !== from.path) NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })
}
