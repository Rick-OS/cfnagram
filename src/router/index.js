import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import store from '../store'
import { Auth } from 'aws-amplify';

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  /**
   * Authentication Guard for routes with requiresAuth metadata
   *
   * @param {Object} to - Intended route navigation
   * @param {Object} from - Previous route navigation
   * @param {Object} next - Next route navigation
   * @returns {Object} next - Next route
   */
   Router.beforeEach(async (to, from, next) => {
    const isProtected = to.matched.some((record) => record.meta.requiresAuth)
    const isAuthenticated = await Auth.currentUserInfo();
    console.log('isProtected:', isProtected)
    console.log('isAuthenticated:', isAuthenticated)
    if (isProtected) {
      console.info(`Page ${to.fullPath} requires Auth!`)
      console.info(`Page name ${to.name} requires Auth!`)
      
      if (!isAuthenticated) {
        try {
          await store.dispatch('profile/getSession')
        } catch (err) {
          next({ name: 'auth', query: { redirectTo: to.name } })
        }
      }
    }
    next()
  })

  return Router
}
//   Router.beforeEach(async (to, from, next) => {
//     const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//     const isAuthenticated = await Auth.currentUserInfo();
//     console.log('requiresAuth:', requiresAuth)
//     console.log('isAuthenticated:', isAuthenticated)
//     if (requiresAuth) {
//       console.info(`Page ${to.fullPath} requires Auth!`)
//       if (requiresAuth && !isAuthenticated) {
//         next("/");
//       } else {
//       next()
//       }
//     next()
//     }
//     })

//   return Router
// }