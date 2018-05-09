import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('@/components/login')
const twoset = () => import('@/components/twoset')
const register = () => import('@/components/register')
const home = () => import('@/components/home/home.vue')
const homepage = () => import('@/components/home/children/homepage.vue')
const maillist = () => import('@/components/home/children/maillist.vue')
const teaminvi = () => import('@/components/home/children/teaminvi.vue')
const teamapplication = () => import('@/components/home/children/teamapplication.vue')
const setup = () => import('@/components/home/children/setup.vue')
const xiuload = () => import('@/components/xiuload.vue')
const teamcertifi = () => import('@/components/home/children/teamcertifi.vue')
const company = () => import('@/components/home/children/children/company.vue')
const government = () => import('@/components/home/children/children/government.vue')
const individual = () => import('@/components/home/children/children/individual.vue')
const otherorg = () => import('@/components/home/children/children/otherorg.vue')
const examine = () => import('@/components/home/children/examine.vue')
const inout = () => import('@/components/home/children/inout.vue')
const confirmin = () => import('@/components/home/children/confirmin.vue')
const confirmout = () => import('@/components/home/children/confirmout.vue')
const companyset = () => import('@/components/home/children/children/companyset.vue')
const modifyadminpw = () => import('@/components/home/children/children/modifyadminpw.vue')
const replacemainadmin = () => import('@/components/home/children/children/replacemainadmin.vue')
const setminadmin = () => import('@/components/home/children/children/setminadmin.vue')
const addminadmin = () => import('@/components/home/children/children/addminadmin.vue')
const destroycompany = () => import('@/components/home/children/children/destroycompany.vue')
const report = () => import('@/components/home/children/children/applis/report.vue')
const notice = () => import('@/components/home/children/children/applis/notice.vue')



Vue.use(Router)

const router = new Router({
  // mode:'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/twoset',
      name: 'twoset',
      component: twoset
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect:'/home/homepage',
      children:[{
        path:'homepage',
        component:homepage,
      },{
        path:'maillist',
        component:maillist,
      },{
        path:'teaminvi',
        component:teaminvi,
      },{
        path:'inout',
        component:inout,
      },{
        path:'confirmin',
        component:confirmin,
      },{
        path:'confirmout',
        component:confirmout,
      },{
        path:'teamapplication',
        component:teamapplication,
      },{
         path:'report',
         component:report,
      },{
         path:'notice',
         component:notice,
      },{
        path:'setup',
        component:setup,
        // redirect:'/home/setup/companyset',
        children:[{
          path:'companyset',
          component:companyset,
        },{
          path:'modifyadminpw',
          component:modifyadminpw,
        },{
          path:'replacemainadmin',
          component:replacemainadmin,
        },{
          path:'setminadmin',
          component:setminadmin,
        },{
          path:'addminadmin',
          component:addminadmin,
        },{
          path:'destroycompany',
          component:destroycompany,
        }]
      },{
        path:'examine',
        component:examine,
      },{
        path:'teamcertifi',
        component:teamcertifi,
        redirect:'/home/teamcertifi/company',
        children:[{
          path:'company',
          component:company,
        },{
          path:'government',
          component:government,
        },{
          path:'individual',
          component:individual,
        },{
          path:'otherorg',
          component:otherorg,
        }]
      }]
    },
    {
      path: '/xiuload',
      name: 'xiuload',
      component: xiuload,
      meta: { 
           requireAuth: true
         }
    },
  ]
})

// 判断是否需要登录权限 以及是否登录
// router.beforeEach((to, from, next) => {
//  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
//    if (sessionStorage.getItem('entid')) {// 判断是否登录
//     next()
//    } else {// 没登录则跳转到登录界面
//     next({
//     path: '/login',
//     // query: {redirect: to.fullPath}
//     })
//    }
//    } else {
//    next()
//    }
// })

export default router
