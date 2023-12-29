import { createRouter, createWebHistory } from 'vue-router'
import { useEmployeeStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      //基本架子
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          //首页
          path: '/home',
          component: () => import('@/views/home/HomePage.vue')
        },
        {
          //个人信息
          path: '/employee/info',
          component: () => import('@/views/employee/EmployeeInfo.vue')
        },
        {
          //修改个人信息
          path: '/employee/update',
          component: () => import('@/views/employee/EmployeeUpdate.vue')
        },
        {
          //修改密码
          path: '/employee/password',
          component: () => import('@/views/employee/EmployeePassword.vue')
        },
        {
          //员工管理
          path: '/employee',
          component: () => import('@/views/employee/EmployeeManage.vue')
        },
        {
          //分类管理
          path: '/category',
          component: () => import('@/views/category/CategoryManage.vue')
        },
        {
          //商品管理
          path: '/shopping',
          component: () => import('@/views/shopping/ShoppingManage.vue')
        }
      ]
    }
  ]
})

// 登录拦截(默认是放行的):没有token只能访问到登录页
router.beforeEach((to) => {
  const employeeStore = useEmployeeStore()
  // 如果没有token，并且访问的是非登录页，拦截到登录，其他情况正常放行
  if (!employeeStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
