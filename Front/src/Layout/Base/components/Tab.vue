<template>
  <div class="my-tab-routes" v-if="tabRoutes.length">
    <el-button :type='i.path === $route.path ? "success" : ""' @click='selectTab(i.path)' v-for="i in tabRoutes" :key="i.id" size="mini">{{
      i.title
    }}</el-button>
  </div>
</template>

<script>
import jsCookie from 'js-cookie';
export default {
  name: 'MyTab',
  components: {},
  props: {},
  data () {
    return {
      activeName: 'first',
      tabRoutes: []
    };
  },
  computed: {},
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },
    selectTab (path) {
      this.$router.push({
        path
      });
    }
  },
  created () {
    this.tabRoutes = JSON.parse(jsCookie.get('cacheRoutes'));
  },
  mounted () {},
  watch: {
    '$route.path' () {
      this.tabRoutes = JSON.parse(jsCookie.get('cacheRoutes'));
    }
  }
};
</script>

<style lang="scss" scoped>
.my-tab-routes {
  height: 36px;
  padding: 4px 0 2px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    width: 0;
    height: 4px;
  }

  // /* 滚动槽 */
  // &::-webkit-scrollbar-track {
  //   border-radius: 10px;
  // }

  // /* 滚动条滑块 */
  // &::-webkit-scrollbar-thumb {
  //   width: 200px !important;
  //   border-radius: 10px;
  //   background: rgba(0,0,0,.5);
  //   padding: 0;
  //   margin: 0;
  // }
}
</style>
