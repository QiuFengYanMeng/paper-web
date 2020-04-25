import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview';

import util from '@/libs/util'

import Setting from '@/setting';

import store from '@/store/index';

import dataUtils from '@/utils/dataUtils';

// 路由数据
import routes from './routes';

import { includeArray } from '@/libs/system';

Vue.use(VueRouter);

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes,
    mode: Setting.routerMode
});

/**
 * 路由拦截
 * 权限验证
 */

router.beforeEach((to, from, next) => {
    if (Setting.showProgressBar) iView.LoadingBar.start();
    const token = dataUtils.getData(Setting.key.token)
    if (token == null || token === 'undefined') {
        if (to.name === 'login') {
            next();
        } else {
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            });
        }
        return
    }
    // 判断是否需要登录才可以进入
    if (to.matched.some(_ => _.meta.auth)) {
        // 这里依据 token 判断是否登录，可视情况修改
        const userInfo = dataUtils.getData(Setting.key.userInfo)
        const isPermission = includeArray(to.meta.auth, [userInfo.role.enName]);
        if (isPermission) {
            next();
        } else {
            next({
                name: '403'
            });
        }
    } else {
        // 不需要身份校验 直接通过
        next();
    }
});

router.afterEach(to => {
    if (Setting.showProgressBar) iView.LoadingBar.finish();
    // 多页控制 打开新的页面
    store.dispatch('admin/page/open', to);
    // 更改标题
    util.title({
        title: to.meta.title
    });
    // 返回页面顶端
    window.scrollTo(0, 0);
});

export default router;
