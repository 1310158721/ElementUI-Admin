import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuList: [],
    hasPermission: [],
    layoutConfigDrawer: false,
    isShowSystemTabView: true,
    isFixedSystemAside: true,
    isShowSystemLogo: false
  },
  mutations: {
    // 重置 vuex 的 menulist(导航栏数据)
    RESETMENULIST (state, menuList) {
      state.menuList = menuList;
    },
    // 重置 vuex 的 hasPermission(用户拥有的权限)
    SETHASPERMISSION (state, permission) {
      state.hasPermission = permission;
    },
    // 重置 vuex 中的 layoutConfigDrawer(系统布局抽屉)
    SETLAYOUTCONFIGDRAWER (state, boolean) {
      state.layoutConfigDrawer = boolean;
    }
  },
  actions: {
  },
  modules: {
  }
});
