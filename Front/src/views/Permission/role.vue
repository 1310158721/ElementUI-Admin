<template>
  <div class="role-permission-wrapper">
    <div class="button-wrapper">
      <el-button type="primary" class="mgr-20" size="small" @click="addRole"
        >新增角色</el-button
      >
      <el-date-picker
        class="mgr-20"
        v-model="timeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        @change="timePickerChange"
        :picker-options='pickerOptions'
      />
      <el-select size="small" clearable v-model="params.roleLevel" @change='roleLevelChange' placeholder="请选择用户权限级别">
        <el-option
          v-for="item in roleEnum"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span class="fixed-space"></span>
      <SearchBar
        class="search-bar"
        placeholder="Role/Username/Description"
        v-model="params.keyword"
        @sureKeyword="sureKeyword"
      />
    </div>
    <div class="table-wrapper" v-loading="!rolePermissionList">
      <el-table :data="rolePermissionList" height="100%" border>
        <el-table-column label="Role" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.role | roleTransform }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="Username"
          width="180"
          align="center"
        />
        <el-table-column prop="desc" label="Description" align="center" />
        <el-table-column label="createdTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operations" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-permission="'SUPERADMIN'"
              size="mini"
              @click="throttleHandleEdit(scope.row)"
              >编辑权限</el-button
            >
            <el-button type="warning" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        v-if='rolePermissionList'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[20, 30, 50]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rolePermissionListCount"
      />
    </div>

    <!-- 编辑权限弹窗 -->
    <EditPermissionDialog
      :permissionDialogVisible="permissionDialogVisible"
      :roleId="roleId"
      @closeEditPermissionDialog="closeEditPermissionDialog"
    />

    <!-- 新增用户弹窗 -->
    <AddRole 
      :addRoleDialog="addRoleDialog"
      @closeAddRoleDialog='closeAddRoleDialog'
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
      theTimeRange: null,
      params: {
        page: 1,
        size: 20,
        keyword: null,
        startTime: null,
        endTime: null,
        roleLevel: null
      },
      addRoleDialog: false,
      roleLevel: null,
      pickerOptions: {
        disabledDate (date) {
          return date > Date.now();
        }
      }
    };
  },
  computed: {
    // 缓存节流函数(throttleHandleEdit接受的参数通过arguments内参传递给了throttle接受的函数)
    throttleHandleEdit () {
      return $throttle(row => this.handleEdit(row), 2000);
    },
    timeRange: {
      get () {
        return this.theTimeRange;
      },
      set (val) {
        if (!val) {
          this.params.startTime = null;
          this.params.ednTime = null;
          this.theTimeRange = null;
        } else {
          this.theTimeRange = val;
          this.params.startTime = $formDate(val[0], 'yyyy-MM-dd');
          this.params.endTime = $formDate(val[1], 'yyyy-MM-dd');
        }
      }
    },
    roleEnum () {
      return [
        { value: 'COMMON', label: '普通用户' },
        { value: 'SUPERADMIN', label: '超级管理员' }
      ];
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
      })
        .then(() => {
          const params = { roleId };
          this.$axios.get('/deleteSingleUser', { params }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getRoleList();
          });
        })
        .catch(() => {
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
      this.params.startTime = null;
      this.params.endTime = null;
      this.theTimeRange = null;
      this.params.roleLevel = null;
      this.getRoleList();
    },
    timePickerChange () {
      this.params.keyword = null;
      this.params.roleLevel = null;
      this.getRoleList();
    },
    roleLevelChange (val) {
      this.params.startTime = null;
      this.params.endTime = null;
      this.theTimeRange = null;
      this.params.keyword = null;
      if (!val) {
        this.params.roleLevel = null;
      }
      this.getRoleList();
    },
    closeAddRoleDialog () {
      this.addRoleDialog = false;
      this.getRoleList();
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
    formatTime (val) {
      return $formDate(new Date(val), 'yyyy-MM-dd hh:mm:ss');
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
    border: 1px #EBEEF5 solid;
    border-top: none;
    .el-pagination {
      float: right;
    }
  }
}
</style>
