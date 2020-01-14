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
      :rules='addRoleRules'
    >
      <el-form-item size='small' label="用户账号:" prop='account'>
        <el-input size='small' v-model="addRoleModel.account" placeholder='请输入用户账号' />
      </el-form-item>
      <el-form-item size='small' label="用户密码:" prop='password'>
        <el-input size='small' v-model="addRoleModel.password" placeholder='请输入用户密码'></el-input>
      </el-form-item>
      <el-form-item size='small' label="电话号码:" prop='mobile'>
        <el-input size='small' v-model="addRoleModel.mobile" placeholder='请输入电话号码'></el-input>
      </el-form-item>
      <el-form-item size='small' label="用户名称:" prop='username'>
        <el-input size='small' v-model="addRoleModel.username" placeholder='请输入用户名称'></el-input>
      </el-form-item>
      <el-form-item size='small' label="用户级别:" prop='role'>
        <el-select size="small" clearable v-model="addRoleModel.role" placeholder="请选择用户权限级别">
          <el-option
            v-for="item in roleEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item size='small' label="用户描述:" prop='desc'>
        <el-input type='textarea' placeholder='请输入用户相关的描述' :autosize='{ minRows: 6, maxRows: 8 }' size='small' v-model="addRoleModel.desc"></el-input>
      </el-form-item>
      <el-form-item v-if='addRoleModel.list' size="small" label="权限列表:" prop="permission">
        <el-tree
          :data="addRoleModel.list"
          show-checkbox
          default-expand-all
          node-key="permission"
          :default-checked-keys="addRoleModel.permission"
          ref="tree"
          highlight-current
          :props="defaultProps"
          @check-change='treeChange'
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size='small' @click="closeAddRoleDialog">取 消</el-button>
      <el-button size='small' :loading='isUploading' type="primary" @click="throttleSureAddRoleDialog('form')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { RegExp } from '@/assets/js/constant';
import { $throttle } from '@/assets/js/utils';
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
    const isPermissionEmpty = (rule, value, callback) => {
      if (!value || !value.length) {
        return callback(new Error('用户权限不能为空'));
      }
      callback();
    }
    return {
      isLoaded: true,
      isUploading: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      addRoleModel: {
        list: null,
        account: '',
        password: '',
        mobile: '',
        avatar: '',
        permission: [],
        desc: '',
        role: 'COMMON',
        username: ''
      },
      addRoleRules: {
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
        role: [
          { required: true, message: '用户等级不能为空' }
        ],
        desc: [
          { required: true, message: '用户描述不能为空' }
        ],
        permission: [
          { validator: isPermissionEmpty }
        ]
      }
    };
  },
  computed: {
    roleEnum () {
      return [
        { value: 'COMMON', label: '普通用户' },
        { value: 'SUPERADMIN', label: '超级管理员' }
      ];
    },
    throttleSureAddRoleDialog() {
      return $throttle((formRef) => this.sureAddRoleDialog(formRef), 1000);
    }
  },
  methods: {
    async getAllMenuItem() {
      this.isLoaded = false;
      return await this.$axios.get('/getAllMenuItem');
    },
    async addSingleUser (params = {}) {
      this.isUploading = true;
      return await this.$axios.get('/addSingleUser', { params });
    },
    closeAddRoleDialog () {
      if (this.isUploading) {
        return false;
      }
      this.addRoleModel = {
        list: null,
        account: '',
        password: '',
        mobile: '',
        avatar: '',
        permission: [],
        desc: '',
        role: 'COMMON',
        username: ''
      }
      this.$refs['form'].resetFields();
      this.$emit('closeAddRoleDialog');
    },
    openAddRoleDialog () {
      this.getAllMenuItem()
        .then((res) => {
          const { result, status, msg } = res.data;
          if (status === 0) {
            this.addRoleModel.list = result;
            this.isLoaded = true;
          }
        })
    },
    sureAddRoleDialog(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          const result = Object.assign({}, {
            account: this.addRoleModel.account,
            password: this.addRoleModel.password,
            mobile: this.addRoleModel.mobile,
            avatar: this.addRoleModel.avatar,
            permission: this.addRoleModel.permission.join(','),
            desc: this.addRoleModel.desc,
            role: this.addRoleModel.role,
            username: this.addRoleModel.username
          });
          
          this.addSingleUser(result)
            .then((res) => {
              const { status } = res.data;
              if(status === 0) {
                this.isUploading = false;
                this.closeAddRoleDialog();
              }
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    treeChange() {
      this.addRoleModel.permission = this.$refs.tree.getCheckedKeys();
    }
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
