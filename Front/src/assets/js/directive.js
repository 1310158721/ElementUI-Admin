import Vue from 'vue';
import store from '@/store';
import { Message } from 'element-ui';

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

Vue.directive('clipboard', {
  inserted (el, binding) {
    el.style.cursor = 'pointer';
    // 兼容外部元素点击事件，在点击事件后执行（可以通过外部元素设置属性来获取数据）
    el.onclick = () => {
      const clipBoardData = el.getAttribute('clipboard-data');
      const inputDom = document.createElement('input');
      inputDom.value = clipBoardData;
      document.body.appendChild(inputDom);
      inputDom.select();
      document.execCommand('Copy');
      Message.success('复制成功');
      inputDom.remove();
    }
  }
});
