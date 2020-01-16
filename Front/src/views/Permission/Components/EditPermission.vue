<template>
  <el-dialog
    title="权限角色"
    class="permission-dialog"
    :visible.sync="permissionDialogVisible"
    width="600px"
    :before-close="closeEditPermissionDialog"
    @open="openEditPermissionDialog"
    destroy-on-close
    append-to-body
    modal-append-to-body
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :model="editPermissionModel"
      label-position="left"
      label-width="96px"
      :rules="editPermissionRules"
      v-loading="!isLoaded"
    >
      <el-form-item size="small" label="用户账号:" prop="account">
        <el-input
          size="small"
          v-model="editPermissionModel.account"
          placeholder="请输入用户账号"
        />
      </el-form-item>
      <el-form-item size="small" label="用户密码:" prop="password">
        <el-input
          size="small"
          v-model="editPermissionModel.password"
          placeholder="请输入用户密码"
        ></el-input>
      </el-form-item>
      <el-form-item size="small" label="电话号码:" prop="mobile">
        <el-input
          size="small"
          v-model="editPermissionModel.mobile"
          placeholder="请输入电话号码"
        ></el-input>
      </el-form-item>
      <el-form-item size="small" label="用户名称:" prop="username">
        <el-input
          size="small"
          v-model="editPermissionModel.username"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item size="small" label="用户级别:" prop="role">
        <el-select
          size="small"
          clearable
          v-model="editPermissionModel.role"
          placeholder="请选择用户权限级别"
        >
          <el-option
            v-for="item in roleEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item size="small" label="用户描述:" prop="desc">
        <el-input
          type="textarea"
          placeholder="请输入用户相关的描述"
          :autosize="{ minRows: 6, maxRows: 8 }"
          size="small"
          v-model="editPermissionModel.desc"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="editPermissionModel.list"
        size="small"
        label="权限列表:"
        prop="permission"
      >
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
      <el-button size="small" @click="closeEditPermissionDialog"
        >取 消</el-button
      >
      <el-button
        size="small"
        :loading="isUploading"
        type="primary"
        @click="editPermissionDialogSure"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { RegExp } from '@/assets/js/constant';
import { mapMutations } from 'vuex';
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
    const isPermissionEmpty = (rule, value, callback) => {
      if (!value || !value.length) {
        return callback(new Error('用户权限不能为空'));
      }
      callback();
    };
    return {
      editPermissionModel: {
        account: '',
        password: '',
        avatar: '',
        role: 'COMMON',
        mobile: '',
        username: '',
        desc: '',
        list: null,
        permission: []
      },
      editPermissionRules: {
        account: [
          { required: true, message: '请输入活动名称' },
          { pattern: RegExp.ACCOUNT, message: '账号格式不正确' }
        ],
        password: [
          { required: true, message: '请输入用户密码' },
          { pattern: RegExp.PASSWORD, message: '密码格式不正确' }
        ],
        username: [
          { required: true, message: '请输入用户名称' },
          { pattern: RegExp.USERNAME, message: '名称格式不正确' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码' },
          { pattern: RegExp.MOBILE, message: '手机格式不正确' }
        ],
        role: [{ required: true, message: '用户等级不能为空' }],
        desc: [{ required: true, message: '用户描述不能为空' }],
        permission: [{ validator: isPermissionEmpty }]
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      isLoaded: true,
      isUploading: false
    };
  },
  computed: {
    // 用户等级枚举
    roleEnum () {
      return [
        { label: '普通用户', value: 'COMMON' },
        { label: '超级管理员', value: 'SUPERADMIN' }
      ];
    }
  },
  methods: {
    ...mapMutations(['RESETMENULIST']),
    // 获取用户相关信息
    async getPermissionInfo (params = {}) {
      this.isLoaded = false;
      return await this.$axios.get('/eidtUserInfo', { params });
    },
    // 更新用户信息
    async updatePermissionInfo (params = {}) {
      this.isUploading = true;
      return await this.$axios.post('/updateSingleUserInfo', params);
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
      if (this.isUploading) {
        return false;
      }
      this.$emit('closeEditPermissionDialog');
    },
    formEditPermissionModel () {
      const {
        role,
        username,
        desc,
        account,
        password,
        avatar,
        mobile
      } = this.editPermissionModel;
      let selectPermissionKey = this.$refs.tree.getCheckedKeys();
      selectPermissionKey = selectPermissionKey.filter(i => i).join(',');
      const result = {
        account,
        password,
        avatar,
        role,
        mobile,
        username,
        permission: selectPermissionKey,
        desc,
        roleId: this.roleId
      };
      return result;
    },
    editPermissionDialogSure () {
      this.$confirm('此操作需要刷新页面才能生效, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updatePermissionInfo(this.formEditPermissionModel()).then(
            res => {
              const { status } = res.data;
              if (status === 0) {
                this.isUploading = false;
                this.RESETMENULIST([]);
                window.location.reload();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
    height: 54px;
    position: relative;
    z-index: 100;
  }
}
</style>
