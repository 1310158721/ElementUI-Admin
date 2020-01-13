<template>
  <el-dialog
    title="权限编辑"
    class="permission-dialog"
    :visible.sync="permissionDialogVisible"
    width="600px"
    :before-close="closeEditPermissionDialog"
    @open="openEditPermissionDialog"
    destroy-on-close
    append-to-body
    modal-append-to-body
    :close-on-click-modal='false'
  >
    <el-form
      ref="form"
      :model="editPermissionModel"
      label-position="left"
      label-width="96px"
      v-loading='!isLoaded'
    >
      <el-form-item size="small" label="用户等级:" prop="role">
        <el-radio-group v-model="editPermissionModel.role">
          <el-radio
            v-for="item in roleEnum"
            :key="item.id"
            :label="item.label"
            >{{ item.title }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" label="用户名称:" prop="username">
        <el-input v-model="editPermissionModel.username" />
      </el-form-item>
      <el-form-item size="small" label="用户描述:" prop="desc">
        <el-input
          maxlength="200"
          show-word-limit
          :autosize="{ minRows: 5, maxRows: 8 }"
          type="textarea"
          v-model="editPermissionModel.desc"
        />
      </el-form-item>
      <el-form-item size="small" label="权限列表:" prop="permission">
        <el-tree
          :data="editPermissionModel.list"
          show-checkbox
          default-expand-all
          node-key="permission"
          :default-checked-keys="editPermissionModel.permission"
          ref="tree"
          highlight-current
          :props="defaultProps"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size='small' @click="closeEditPermissionDialog">取 消</el-button>
      <el-button size='small' type="primary" @click="editPermissionDialogSure"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditPermissionDialog',
  components: {},
  props: {
    permissionDialogVisible: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editPermissionModel: {
        role: 'COMMON',
        username: '',
        desc: '',
        list: null,
        permission: []
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      isLoaded: true
    };
  },
  computed: {
    // 用户等级枚举
    roleEnum () {
      return [
        { title: '普通用户', label: 'COMMON' },
        { title: '超级管理员', label: 'SUPERADMIN' }
      ];
    }
  },
  methods: {
    // 获取用户相关信息
    async getPermissionInfo (params = {}) {
      this.isLoaded = false;
      return await this.$axios.get('/eidtUserInfo', { params });
    },
    // 更新用户信息
    async updatePermissionInfo (params = {}) {
      return await this.$axios.get('/updateSingleUserInfo', { params });
    },
    openEditPermissionDialog () {
      this.getPermissionInfo({ roleId: this.roleId }).then(res => {
        const { status, result } = res.data;
        if (status === 0) {
          this.isLoaded = true;
          this.editPermissionModel = result;
        }
      });
    },
    closeEditPermissionDialog () {
      this.$emit('closeEditPermissionDialog');
    },
    formEditPermissionModel () {
      const { role, username, desc } = this.editPermissionModel;
      let selectPermissionKey = this.$refs.tree.getCheckedKeys();
      selectPermissionKey = selectPermissionKey.filter((i) => i).join(',');
      const result = {
        role,
        username,
        permission: selectPermissionKey,
        desc,
        roleId: this.roleId
      };
      return result;
    },
    editPermissionDialogSure () {
      this.updatePermissionInfo(this.formEditPermissionModel())
        .then((res) => {
          const { status } = res.data;
          if (status === 0) {
            this.$emit('closeEditPermissionDialog');
          }
        });
    }
    
  },
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.permission-dialog {
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
