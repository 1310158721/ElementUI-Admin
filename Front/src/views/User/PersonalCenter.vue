<template>
  <div class="personal-center-page">
    <GlobalLoadingMask :isLoading="isLoading" />
    <el-form
      v-if="infos"
      class="personal-form"
      ref="form"
      :model="infos"
      label-position="left"
      label-width="96px"
    >
      <el-form-item size="small" label="账号:">
        <el-input type="text" size="small" v-model="infos.account" disabled />
      </el-form-item>
      <el-form-item size="small" label="密码:">
        <el-input
          type="password"
          size="small"
          v-model="infos.password"
          disabled
        />
      </el-form-item>
      <el-form-item size="small" label="名称:">
        <el-input type="text" size="small" v-model="infos.username" disabled />
      </el-form-item>
      <el-form-item size="small" label="级别:">
        <el-select v-model="infos.role" placeholder="请选择用户级别" disabled>
          <el-option
            v-for="item in roleLevel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="small" label="号码:">
        <el-input type="text" size="small" v-model="infos.mobile" disabled />
      </el-form-item>
      <el-form-item size="small" label="描述:">
        <el-input type="text" size="small" v-model="infos.desc" disabled />
      </el-form-item>
      <el-form-item size="small" label="创建时间:">
        <el-input type="text" size="small" v-model="infos.createdTime" disabled />
      </el-form-item>
      <el-form-item size="small" label="头像:">
        <TUploadImage />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { $formDate } from '@/assets/js/utils';
export default {
  name: "PersonalCenter",
  components: {},
  props: {},
  data() {
    return {
      infos: null,
      isLoading: false,
      roleLevel: [
        {
          value: "COMMON",
          label: "普通用户"
        },
        {
          value: "SUPERADMIN",
          label: "超级管理员"
        }
      ]
    };
  },
  computed: {},
  methods: {
    async getUserInfo() {
      this.isLoading = true;
      return await this.$axios.get("/getSingleUserInfo");
    }
  },
  created() {
    this.getUserInfo().then(res => {
      const { status, result } = res.data;
      this.infos = result;
      this.infos.createdTime = $formDate(new Date(this.infos.createdTime), 'yyyy-MM-dd');
      this.isLoading = false;
    });
  },
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.personal-form {
  // width: 500px;
}
</style>
