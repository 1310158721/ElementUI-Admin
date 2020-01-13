import Vue from 'vue';
import store from '@/store';

Vue.directive('permission', {
  // 当绑定该指令的元素插入到 DOM 中时，第一个参数为绑定的 DOM 元素
  inserted (el, binding) {
    const { value } = binding;
    const { hasPermission } = store.state;
    if (hasPermission.includes(value)) {
      return false;
    } else {
      el.style.display = 'none';
    }
  }
});
