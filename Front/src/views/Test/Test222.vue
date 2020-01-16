<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      ref="tree"
      check-on-click-node
      :default-expand-all="true"
      :check-strictly="true"
      :expand-on-click-node="true"
      @node-click="nodeClick"
      :props="defaultProps"
    >
    </el-tree>
    <div class="buttons">
      <el-button @click="getCheckedNodes">通过 node 获取</el-button>
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <el-button @click="setCheckedNodes">通过 node 设置</el-button>
      <el-button @click="setCheckedKeys">通过 key 设置</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Test",
  components: {},
  props: {},
  data() {
    return {
      treeData: [
        {
          children: null,
          _id: "5e11ba54cb51fea5316ad828",
          title: "Dashboard",
          id: "DASHBOARD",
          icon: "icon-shouye"
        },
        {
          children: [
            {
              title: "菜单1",
              children: [
                { title: "菜单1-1", children: null, id: "MENU1-1" },
                {
                  title: "菜单1-2",
                  children: [
                    {
                      title: "菜单1-2-1",
                      children: null,
                      id: "MENU1-2-1"
                    },
                    {
                      title: "菜单1-2-2",
                      children: null,
                      id: "MENU1-2-2"
                    },
                    {
                      title: "菜单1-2-3",
                      children: null,
                      id: "MENU1-2-3"
                    }
                  ]
                },
                { title: "菜单1-3", children: null, id: "MENU1-3" }
              ]
            },
            { title: "菜单2", children: null, id: "MENU2" }
          ],
          _id: "5e11ba54cb51fea5316ad829",
          title: "路由嵌套",
          icon: "icon-nested"
        },
        {
          children: [
            {
              title: "Echarts",
              children: [{ title: "Pie", children: null, id: "PIE" }]
            },
            { title: "BaiduMap", children: null, id: "BAIDUMAP" }
          ],
          _id: "5e11ba54cb51fea5316ad82a",
          title: "组件",
          icon: "icon-zujian"
        },
        {
          children: [
            { title: "角色权限", children: null, id: "SUPERADMIN" }
          ],
          _id: "5e155f1acb51fea5316ad82b",
          title: "系统权限",
          icon: "icon-quanxianguanli-"
        },
        {
          children: [
            { title: "TEST1", id: "TEST1" },
            { title: "TEST2", id: "TEST2" }
          ],
          _id: "5e19f3158259073fe5254cdd",
          title: "待办事项",
          id: "WAITINGTODO",
          icon: "icon-daibantixing",
          buttons: [
            { title: "TEST1", id: "TEST1" },
            { title: "TEST2", id: "TEST2" }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    };
  },
  computed: {},
  methods: {
    nodeClick(data, node) {
      this.childNodesChange(node);
      this.parentNodesChange(node);
    },
    childNodesChange(node) {
      let len = node.childNodes.length;
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = false;
        this.childNodesChange(node.childNodes[i]);
      }
    },
    parentNodesChange(node) {
      if (node.parent) {
        for (let key in node) {
          if (key == "parent") {
            node[key].checked = true;
            this.parentNodesChange(node[key]);
          }
        }
      }
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 'WAITINGTODO',
          label: "待办事项"
        }
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    }
  },
  created() {},
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped></style>
