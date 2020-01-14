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
    <el-form
      ref="form"
      :model="addRoleModel"
      label-position="left"
      label-width="96px"
      v-loading='!isLoaded'
    >
      <el-form-item size='small' label="用户账号:">
        <el-input size='small' v-model="addRoleModel.account"></el-input>
      </el-form-item>
      <el-form-item size='small' label="用户密码:">
        <el-input size='small' v-model="addRoleModel.password"></el-input>
      </el-form-item>
      <el-form-item size='small' label="用户名称:">
        <el-input size='small' v-model="addRoleModel.username"></el-input>
      </el-form-item>
      <el-form-item size='small' label="用户名称:">
        <el-select size="small" clearable v-model="addRoleModel.role" placeholder="请选择用户权限级别">
          <el-option
            v-for="item in roleEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item size='small' label="用户描述:">
        <el-input type='textarea' :autosize='{ minRows: 6, maxRows: 8 }' size='small' v-model="addRoleModel.desc"></el-input>
      </el-form-item>
    </el-form>
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
      isLoaded: true,
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
  computed: {
    roleEnum () {
      return [
        { value: 'COMMON', label: '普通用户' },
        { value: 'SUPERADMIN', label: '超级管理员' }
      ];
    }
  },
  methods: {
    closeAddRoleDialog () {
      this.$emit('closeAddRoleDialog');
    },
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
