<template>
  <div class="waiting-to-do-list">
    <span class="conditions-wrapper">
      <el-button type="primary" size="small">新增</el-button>
      <span class="fixed-space"></span>
      <SearchBar
        class="search-bar"
        v-model="params.keyword"
        @sureKeyword="sureKeyword"
      />
    </span>
    <span class="table-wrapper" v-loading='!list'>
      <el-table :data="list" border height="100%">
        <el-table-column prop="createdTime" label="创建时间" width="180" align='center'>
        </el-table-column>
        <el-table-column prop="content" label="内容" align='center'>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align='center'>
        </el-table-column>
        <el-table-column label="Operation" width="120" align='center'>
          <template slot-scope="scope">
            <el-button size='mini' type="text">已完成</el-button>
            <el-button size='mini' type="text">未完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
    <span class="pagination-wrapper"></span>
  </div>
</template>

<script>
export default {
  name: "WaitingToDoList",
  components: {},
  props: {},
  data() {
    return {
      params: {
        keyword: null
      },
      list: null
    };
  },
  computed: {},
  methods: {
    async getWaitingToDoList() {
      return await this.$axios.get('/getWaitingToDoList');
    },
    sureKeyword(val) {
      console.log(val);
    }
  },
  created() {
    this.getWaitingToDoList()
      .then((res) => {
        const { status, result } = res.data;
        if (status === 0) {
          this.list = result;
        }
      })
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
    padding-top: 20px;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
