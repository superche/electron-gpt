// import * as Vue from 'vue';
import * as VueRouter from 'vue-router';

const constantRouterMap = [
  {
    path: '/',
    component: () => import('/@/pages/home'),
  },
  // {
  //   path: '/assistant',
  //   component: () => import('/@/pages/assistant'),
  //   props: route => ({ conversationId: route.query.conversationId })
  // },
  // {
  //   path: '/index',
  //   redirect: '/assistant',
  // },
  // {
  //   path: '/assistant/share/:shareKey',
  //   component: () => import('/@/pages/share.tsx'),
  // },
  // {
  //   path: '/calc',
  //   component: () => import('/@/pages/calcPage.tsx'),
  // },
  // {
  //   name: 'noPermission',
  //   path: '/noPermission',
  //   component: () => import('/@/pages/noPermission.tsx'),
  // },
  // {
  //   name: 'notFound',
  //   path: '/**',
  //   component: () => import('/@/pages/notFound.tsx'),
  // },
];

// hack router push callback
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location: any, onResolve: any, onReject: any) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location);
// };

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: constantRouterMap, // short for `routes: routes`
});

// Vue.use(Router);

// const router = (window as any).__global_router__ = new Router({
//   mode: 'history',
//   base: process.env.PUBLIC_URL,
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap,
// });

export default router;
