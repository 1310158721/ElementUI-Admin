<template>
  <el-container id='app-root-wrapper'>
    <my-aside />
    <el-container class="app-main-wrapper">
      <my-header />
      <my-tab v-if='$store.state.isShowSystemTabView' />
      <el-main class="my-main">
        <router-view />
      </el-main>
    </el-container>
    <LayoutConfig />
  </el-container>
</template>

<script>
import MyAside from './Aside';
import MyHeader from './Header';
import MyTab from './components/Tab';
import LayoutConfig from '@/components/System/LayoutConfig';
export default {
  name: 'LayoutBase',
  components: {
    MyAside,
    MyHeader,
    LayoutConfig,
    MyTab
  },
  props: {},
  data () {
    return {};
  },
  computed: {},
  methods: {},
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped>
#app-root-wrapper {
  width: 100vw;
  height: 100vh;
  min-width: 1100px;
  .app-main-wrapper {
    display: flex;
    flex-direction: column;
    .my-main {
      flex: 1;
    }
  }
}
</style>
