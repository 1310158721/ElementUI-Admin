<template>
  <div>
    <el-upload
      :action='action'
      list-type="picture-card"
      :multiple='multiple'
      :on-success='successCallback'
      :on-preview='previewCallback'
      :limit='limit'
      :on-exceed='exceedCallback'
      :on-error='errorCallback'
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div class="images" v-viewer="{movable: false}" v-show='false'>
      <img v-for="src in urlList" :src="src" :key="src">
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
  export default {
    name: 'TUploadImage',
    data() {
      return {
        dialogImageUrl: '',
        urlList: null
      };
    },
    props: {
      // 必选参数，上传的地址
      action: {
        type: String,
        default: 'https://jsonplaceholder.typicode.com/posts/'
      },
      // 设置上传的请求头部
      headers: {
        type: Object,
        default: () => {}
      },
      // 上传时附带的额外参数
      data: {
        type: Object,
        default: () => {}
      },
      // 是否支持多选文件
      multiple: {
        type: Boolean,
        default: true
      },
      // 是否启用拖拽上传
      drag: {
        type: Boolean,
        default: false
      },
      limit: {
        type: Number,
        default: 10
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      successCallback (response, file, fileList) {
        this.urlList = fileList.map((i) => i.url);
      },
      previewCallback(file) {
        const viewer = this.$el.querySelector('.images').$viewer
        console.log(viewer);
        viewer.show()
      },
      exceedCallback() {
        Message.error('最大上传文件个数超出'  + this.limit + '个了');
      },
      errorCallback(err, file, fileList) {
        this.urlList = fileList.map((i) => i.url);
      }
    }
  }
</script>

<style lang="scss" scoped></style>
