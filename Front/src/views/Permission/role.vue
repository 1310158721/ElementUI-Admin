<template>
  <div class="role-permission-wrapper">
    <div class="button-wrapper">
      <el-button type="primary" class="add-role" size="small" @click='addRole'>新增角色</el-button>
      <el-date-picker
        v-model="params.createdTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size='small'
        @change='timePickerChange'
      />
      <span class="fixed-space"></span>
      <SearchBar class="search-bar" placeholder='Role/Username/Description' v-model='params.keyword' @sureKeyword='sureKeyword' />
    </div>
    <div class="table-wrapper" v-loading='!rolePermissionList'>
      <el-table :data="rolePermissionList" height='100%' border>
        <el-table-column label="Role" width="180" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.role | roleTransform }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="Username" width="180" align='center' />
        <el-table-column prop="desc" label="Description" align='center' />
        <el-table-column label="createdTime" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operations" align='center'>
          <template slot-scope="scope">
            <el-button type="primary" v-permission='"SUPERADMIN"' size="small" @click='throttleHandleEdit(scope.row)'>编辑权限</el-button>
            <el-button type="warning" size="small" @click='handleDel(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[20, 30, 50]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rolePermissionListCount">
      </el-pagination>
    </div>

    <!-- 编辑权限弹窗 -->
    <EditPermissionDialog
      :permissionDialogVisible='permissionDialogVisible'
      :roleId='roleId'
      @closeEditPermissionDialog='closeEditPermissionDialog'
    />

    <!-- 新增用户弹窗 -->
    <AddRole
      :addRoleDialog='addRoleDialog'
    />
  </div>
</template>

<script>
import EditPermissionDialog from './Components/EditPermission';
import AddRole from './Components/AddRole';
import { $throttle, $formDate } from '@/assets/js/utils';

export default {
  name: 'RolePermission',
  components: {
    EditPermissionDialog,
    AddRole
  },
  props: {},
  data () {
    return {
      rolePermissionList: null,
      rolePermissionListCount: 0,
      permissionDialogVisible: false,
      roleId: null,
      params: {
        page: 1,
        size: 20,
        keyword: null,
        createdTime: null
      },
      addRoleDialog: false
    };
  },
  computed: {
    // 缓存节流函数(throttleHandleEdit接受的参数通过arguments内参传递给了throttle接受的函数)
    throttleHandleEdit () {
      return $throttle((row) => this.handleEdit(row), 2000);
    }
  },
  methods: {
    // 获取所有用户信息列表
    getRoleList () {
      this.rolePermissionList = null;
      this.$axios.get('/getAllUserInfos', { params: this.params }).then(res => {
        const { status, result } = res.data;
        const { list, count } = result;
        if (status === 0) {
          this.rolePermissionList = list;
          this.rolePermissionListCount = count;
        }
      });
    },
    // 删除单个用户
    deleteUser (roleId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = { roleId };
          this.$axios.get('/deleteSingleUser', { params })
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getRoleList();
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleEdit (row) {
      this.roleId = row._id;
      this.permissionDialogVisible = true;
    },
    handleDel (row) {
      const { _id } = row;
      this.deleteUser(_id);
    },
    handleSizeChange (val) {
      this.params.size = val;
      this.getRoleList();
    },
    handleCurrentChange (val) {
      this.params.page = val;
      this.getRoleList();
    },
    closeEditPermissionDialog () {
      this.permissionDialogVisible = false;
      this.getRoleList();
    },
    addRole () {
      this.addRoleDialog = true;
    },
    sureKeyword () {
      this.getRoleList();
    },
    timePickerChange(val) {
      console.log(val);
    }
  },
  filters: {
    roleTransform (role) {
      switch (role) {
        case 'SUPERADMIN':
          return '超级管理员';
        case 'COMMON':
          return '普通用户';
        default:
          return '';
      }
    },
    formatTime(val) {
      return $formDate(new Date(val), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  created () {
    this.getRoleList();
  },
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.role-permission-wrapper {
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  .button-wrapper {
    margin-bottom: 10px;
    height: 32px;
    display: flex;
    flex-direction: row;
    .fixed-space {
      flex: 1;
    }
  }
  .table-wrapper {
    flex: 1;
    height: 100%;
  }
  .pagination-wrapper {
    height: 32px;
    padding: 10px 0;
    .el-pagination {
      float: right;
    }
  }
}
</style>
