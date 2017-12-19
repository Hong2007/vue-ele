import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import header from 'components/header/header';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

// 定义路由插件
Vue.use(Router);

// 定义ajax获取数据的插件Resourse
Vue.use(Resource);

// 定义每个路由对应一个组件
let router = new Router({ // 创建 router 实例，然后传 `routes` 配置
  linkActiveClass: 'active',
  routes: [
    // 进入网页就显示goods的内容
    {
      path: '/',
      redirect: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/header',
      name: 'header',
      component: header
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
});
export default router;
