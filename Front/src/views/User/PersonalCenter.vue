<template>
  <div class="personal-center-page">
    <GlobalLoadingMask
      :isLoading='isLoading'
    />
    <el-form
      v-if='infos'
      ref="form"
      :model="infos"
      label-position="left"
      label-width="96px"
    >
      <el-form-item size='small' label="账号:">
        <span>{{ infos.account }}</span>
      </el-form-item>
      <el-form-item size='small' label="密码:">
        <span>{{ infos.password }}</span>
      </el-form-item>
      <el-form-item size='small' label="名称:">
        <span>{{ infos.username }}</span>
      </el-form-item>
      <el-form-item size='small' label="级别:">
        <span>{{ infos.role | levelFilter }}</span>
      </el-form-item>
      <el-form-item size='small' label="号码:">
        <span>{{ infos.mobile }}</span>
      </el-form-item>
      <el-form-item size='small' label="描述:">
        <span>{{ infos.desc }}</span>
      </el-form-item>
      <el-form-item size='small' label="创建时间:">
        <span>{{ infos.createdTime }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PersonalCenter',
  components: {},
  props: {},
  data () {
    return {
      infos: null,
      isLoading: false
    };
  },
  computed: {},
  methods: {
    async getUserInfo() {
      this.isLoading = true;
      return await this.$axios.get('/getSingleUserInfo');
    }
  },
  filters: {
    levelFilter(role) {
      const roleEnum = [
        { label: '普通用户', value: 'COMMON' },
        { label: '超级管理员', value: 'SUPERADMIN' }
      ];
      return roleEnum.filter((i) => i.value === role)[0].label;
    }
  },
  created () {
    this.getUserInfo()
      .then((res) => {
        const { status, result } = res.data;
        this.infos = result;
        this.isLoading = false;
      })
  },
  mounted () {},
  watch: {}
};
</script>

<style lang="scss" scoped></style>
