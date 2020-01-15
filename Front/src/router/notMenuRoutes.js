/**
 * 存储非导航栏上的路由，一般不作为BaseLayout的children项
 */

const notMenuRoutes = [
  {
    path: '/NotMenu',
    name: 'NotMenu',
    meta: {},
    component: () => import('@/Layout/NotMenu'),
    children: [
      {
        path: '/PersonalCenter',
        name: 'PersonalCenter',
        meta: {
          title: '个人中心',
          isNotMenu: true
        },
        component: () => import('@/views/User/PersonalCenter'),
        children: null
      }
    ]
  }
];

export default notMenuRoutes;
