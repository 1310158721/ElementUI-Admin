<template>
  <el-dialog
    title="新增用户"
    class="add-role-dialog"
    :visible.sync="addRoleDialog"
    width="600px"
    :before-close="closeAddRoleDialog"
    @open="openAddRoleDialog"
    destroy-on-close
    append-to-body
    modal-append-to-body
    :close-on-click-modal='false'
  >
  </el-dialog>
</template>

<script>
export default {
  name: 'AddRole',
  components: {},
  props: {
    addRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addRoleModel: {
        account: '',
        password: '',
        username: '',
        desc: '',
        permission: '',
        role: ''
      }
    };
  },
  computed: {},
  methods: {
    closeAddRoleDialog () {},
    openAddRoleDialog () {}
  },
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.add-role-dialog {
  /deep/.el-dialog__header {
    box-shadow: 0px 5px 5px rgba(0,0,0,.1);
    position: relative;
    z-index: 100;
  }
  /deep/.el-dialog__body {
    box-sizing: border-box;
    padding: 30px 20px;
    height: 460px;
    max-height: 460px;
    overflow-y: auto;
  }
  /deep/.el-dialog__footer {
    box-shadow: 0px -5px 5px rgba(0,0,0,.1);
    height: 54px;
    position: relative;
    z-index: 100;
  }
}
</style>
