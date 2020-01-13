<template>
  <el-drawer
    size='600px'
    :visible.sync="$store.state.layoutConfigDrawer"
    :before-close='handleClose'
    :with-header="false">
    <span>我来啦!</span>
  </el-drawer>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'LayoutConfig',
  components: {},
  props: {},
  data () {
    return {};
  },
  computed: {},
  methods: {
    ...mapMutations(['SETLAYOUTCONFIGDRAWER']),
    handleClose () {
      console.log('handleClose');
      this.SETLAYOUTCONFIGDRAWER(false);
    }
  },
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped></style>
