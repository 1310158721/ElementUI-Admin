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
  name: 'Test',
  components: {},
  props: {},
  data () {
    return {
      treeData: [
        {
          // id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1',
                  children: [
                    {
                      id: 11,
                      label: '四级 1-1-1'
                    }
                  ]
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ]
    };
  },
  computed: {},
  methods: {
    nodeClick (data, node) {
      console.log(node);
      this.childNodesChange(node);
      this.parentNodesChange(node);
    },
    childNodesChange (node) {
      let len = node.childNodes.length;
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = false;
        this.childNodesChange(node.childNodes[i]);
      }
    },
    parentNodesChange (node) {
      if (node.parent) {
        for (let key in node) {
          if (key == 'parent') {
            node[key].checked = true;
            this.parentNodesChange(node[key]);
          }
        }
      }
    },
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys () {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes () {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: '二级 2-1'
        },
        {
          id: 9,
          label: '三级 1-1-1'
        }
      ]);
    },
    setCheckedKeys () {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([]);
    }
  },
  created () {},
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped></style>
