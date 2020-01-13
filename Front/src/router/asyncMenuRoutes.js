/**
 * 保存菜单栏上的导航路由
 */
const asyncMenuRoutes = [
  {
    path: '/baseLayout',
    name: 'baseLayout',
    meta: {
      title: 'baseLayout'
    },
    component: () => import('@/Layout/Base'),
    redirect: {
      path: '/Dashboard'
    },
    children: []
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    meta: {
      title: 'Dashboard'
    },
    component: () => import('@/views/Dashboard'),
    children: null
  },
  {
    path: '/WaitingTodo',
    name: 'WaitingTodo',
    meta: {
      title: '待办事项'
    },
    component: () => import('@/views/WaitingTodo'),
    children: null
  },
  {
    path: '/Pie',
    name: 'Pie',
    meta: {
      title: 'Pie'
    },
    component: () => import('@/views/Pie'),
    children: null
  },
  {
    path: '/BaiduMap',
    name: 'BaiduMap',
    meta: {
      title: 'BaiduMap'
    },
    component: () => import('@/views/BaiduMap'),
    children: null
  },
  {
    path: '/Menu1-1',
    name: 'Menu1-1',
    meta: {
      title: '菜单1-1'
    },
    component: () => import('@/views/NestedRoute/Menu1_1'),
    children: null
  },
  {
    path: '/Menu1-2-1',
    name: 'Menu1-2-1',
    meta: {
      title: '菜单1-2-1'
    },
    component: () => import('@/views/NestedRoute/Menu1_2_1'),
    children: null
  },
  {
    path: '/Menu1-2-2',
    name: 'Menu1-2-2',
    meta: {
      title: '菜单1-2-2'
    },
    component: () => import('@/views/NestedRoute/Menu1_2_2'),
    children: null
  },
  {
    path: '/Menu1-2-3',
    name: 'Menu1-2-3',
    meta: {
      title: '菜单1-2-3'
    },
    component: () => import('@/views/NestedRoute/Menu1_2_3'),
    children: null
  },
  {
    path: '/Menu1-3',
    name: 'Menu1-3',
    meta: {
      title: '菜单1-3'
    },
    component: () => import('@/views/NestedRoute/Menu1_3'),
    children: null
  },
  {
    path: '/Menu2',
    name: 'Menu2',
    meta: {
      title: '菜单2'
    },
    component: () => import('@/views/NestedRoute/Menu2'),
    children: null
  },
  {
    path: '/rolePermission',
    name: 'rolePermission',
    meta: {
      title: '角色权限'
    },
    component: () => import('@/views/Permission/role'),
    children: null
  }
];

export default asyncMenuRoutes;
