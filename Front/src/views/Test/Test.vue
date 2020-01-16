<template>
  <div>
    <div @click='handleClick($event, Math.random() * 10000)' v-clipboard>Clipboard</div>
    <div @click='handleClick($event, Math.random() * 10000)' v-clipboard>Clipboard</div>
  </div>
</template>

<script>
export default {
  name: 'Clipboard',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleClick(e, data) {
      e.target.setAttribute('clipboard-data', data);
    }
  },
  created() {},
  mounted() {},
  watch: {}
};
</script>

<style lang="scss" scoped></style>
