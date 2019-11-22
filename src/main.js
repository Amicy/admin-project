// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
// 引入elementUI css样式表
import 'element-ui/lib/theme-chalk/index.css';
// 引入App.vue
import App from './App';
// 引入路由
import router from './router';
// 引入状态管理
import store from './vuex/store';
// 引入icon
import './assets/icon/iconfont.css'
// 

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import axios from 'axios';
Vue.prototype.$axios = axios;


/* 组织启动生产消息,
 * you are running Vue in development mode...
*/
Vue.config.productionTip = false;


// 使用element UI
Vue.use(ElementUI);

// 过滤器
import * as custom from './utils/util'

Object.keys(custom).forEach(key => {
    Vue.filter(key, custom[key])
})

// 路由拦截器
// 跳转之前执行
router.beforeEach((to, from, next) => {
    if (to.matched.length != 0) {
        if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
            if (Boolean(localStorage.getItem("userInfo"))) { // 通过vuex state获取当前的user是否存在
                next();
            } else {
                next({
                    path: '/login',
                    query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        } else {
            if (Boolean(localStorage.getItem("userInfo"))) { // 判断是否登录
                if (to.path != "/" && to.path != "/login") { //判断是否要跳到登录界面
                    next();
                    console.log(1)
                } else {
                    /**
                     * 防刷新，如果登录，修改路由跳转到登录页面，修改路由为登录后的首页 
                     */
                    next({
                        path: '/goods/Goods'
                    })
                }
            } else {
                next();
            }
        }
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //使用store vuex状态管理
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})