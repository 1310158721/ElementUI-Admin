<template>
  <div class="waiting-to-do-list">
    <span class="conditions-wrapper">
      <el-button type="primary" size="small" @click="throttleAddWaitingitem" class="mgr-20"
        >新增</el-button
      >
      <el-date-picker
        class="mgr-20"
        v-model="timeRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timePickerChange"
        size='small'
        :picker-options='pickerOptions'
      />
      <el-select size="small" clearable v-model="params.status" @change='selectStatus' placeholder="请选择状态">
        <el-option label='未完成' value='1'></el-option>
        <el-option label='已完成' value='0'></el-option>
      </el-select>
      <span class="fixed-space"></span>
      <SearchBar
        class="search-bar"
        v-model="params.keyword"
        @sureKeyword="sureKeyword"
      />
    </span>
    <span class="table-wrapper" v-loading="!list">
      <el-table :data="list" border height="100%">
        <el-table-column
          prop="createdTime"
          label="创建时间"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | createdTimeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" align="center">
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.status === '0' ? 'success' : 'warning'"
              >{{ scope.row.status | statusFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click.native="throttleSetStatus(scope.row)"
              type="text"
              v-if="scope.row.status === '1'"
              >置为完成</el-button
            >
            <el-button
              size="mini"
              @click="throttleSetStatus(scope.row)"
              type="text"
              v-else
              >置为未完</el-button
            >
            <el-button
              size="mini"
              @click="handelDeleteItem(scope.row)"
              type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </span>
    <span class="pagination-wrapper">
      <el-pagination
        v-if="list"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[20, 30, 50]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        size="small"
      />
    </span>
  </div>
</template>

<script>
import { $formDate, $throttle } from "@/assets/js/utils";
export default {
  name: 'WaitingToDoList',
  components: {},
  props: {},
  data() {
    return {
      theTimeRange: null,
      params: {
        size: 20,
        page: 1,
        keyword: null,
        startTime: null,
        endTime: null,
        status: null
      },
      list: null,
      count: 0,
      pickerOptions: {
        disabledDate(date) {
          return date > Date.now();
        }
      }
    };
  },
  computed: {
    // 节流更改数据状态
    throttleSetStatus() {
      // 缓存节流函数(throttleSetStatus接受的参数通过arguments内参传递给了throttle接受的函数)
      return $throttle(row => this.setStatus(row), 1000);
    },
    // 节流新增数据
    throttleAddWaitingitem() {
      return $throttle(() => this.addWaitingitem(), 1000);
    },
    timeRange: {
      get() {
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
    }
  },
  methods: {
    getWaitingToDoList() {
      this.list = null;
      this.$axios
        .get("/getWaitingToDoList", { params: this.params })
        .then(res => {
          const { status, result } = res.data;
          if (status === 0) {
            const { list, count } = result;
            this.list = list;
            this.count = count;
          }
        });
    },
    addItem(data) {
      this.$axios.post('/addWaitingItem', data)
        .then((res) => {
          const { status } = res.data;
          if (status === 0) {
            this.getWaitingToDoList();
          }
        })
    },
    async deleteItem (params) {
      return await this.$axios.get('/deleteWaitingItem', { params });
    },
    sureKeyword() {
      this.theTimeRange = null;
      this.params.startTime = null;
      this.params.endTime = null;
      this.params.status = null;
      this.getWaitingToDoList();
    },
    setStatus(row) {
      const { status, _id } = row;
      const postData = {
        status: status === "0" ? "1" : "0",
        _id
      };
      const text = "此操作将该条数据设置为已完成状态, 是否继续";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const { _id } = row;
          this.$axios.post("/updateWaitingItemStatus", postData).then(res => {
            const { status } = res.data;
            if (status === 0) {
              this.getWaitingToDoList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.params.size = val;
      this.getWaitingToDoList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getWaitingToDoList();
    },
    addWaitingitem() {
      this.$prompt('请输入内容', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[^\s\.]{1,}/,
          inputErrorMessage: '内容不能为空'
        }).then(({ value }) => {
          this.addItem({ content: value });
        }).catch(() => {});
    },
    timePickerChange() {
      this.params.keyword = null;
      this.params.status = null;
      this.getWaitingToDoList();
    },
    selectStatus() {
      this.params.keyword = null;
      this.theTimeRange = null;
      this.params.startTime = null;
      this.params.endTime = null;
      this.getWaitingToDoList();
    },
    handelDeleteItem(row) {
      // console.log(row);
      const { _id } = row;
      this.deleteItem({ _id })
        .then((res) => {
          const { status } = res.data;
          if (status === 0) {
            this.getWaitingToDoList();
          }
        })
    }
  },
  filters: {
    createdTimeFilter(val) {
      return $formDate(new Date(val), "yyyy-MM-dd");
    },
    statusFilter(val) {
      return val === "0" ? "已完成" : "未完成";
    }
  },
  created() {
    this.getWaitingToDoList();
  },
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.waiting-to-do-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  .conditions-wrapper {
    height: 32px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: row;
    .el-button {
      width: 96px;
    }
    .fixed-space {
      flex: 1;
    }
  }
  .table-wrapper {
    flex: 1;
  }
  .pagination-wrapper {
    height: 32px;
    padding: 10px 0;
    border: 1px #ebeef5 solid;
    border-top: none;
    .el-pagination {
      float: right;
    }
  }
}
</style>
