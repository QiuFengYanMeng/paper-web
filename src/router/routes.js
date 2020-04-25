import dashboard from './modules/dashboard';
import form from './modules/form';
import list from './modules/list';
import search from './modules/search';
import result from './modules/result';
import exception from './modules/exception';
import setting from './modules/setting';
import BasicLayout from '@/layouts/basic-layout';
import student from "@/router/modules/student";
import teacher from "@/router/modules/teacher";

/**
 * 在主框架内显示
 */

const frameIn = [
    {
        path: '/',
        redirect: {
            name: 'dashboard-operate'
        },
        component: BasicLayout,
        children: [
            {
                path: 'index',
                name: 'index',
                redirect: {
                    name: 'dashboard-operate'
                }
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: {
                    beforeRouteEnter (to, from, next) {
                        next(instance => instance.$router.replace(from.fullPath));
                    },
                    render: h => h()
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter (to, from, next) {
                        next(instance => instance.$router.replace(JSON.parse(from.params.route)));
                    },
                    render: h => h()
                }
            }
        ]
    },
    dashboard,
    form,
    list,
    search,
    result,
    exception,
    setting,
    student,
    teacher
];

/**
 * 在主框架之外显示
 */

const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('@/pages/account/login')
    },
    // 注册
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册'
        },
        component: () => import('@/pages/account/register')
    },
    // 注册结果
    {
        path: '/register/result',
        name: 'register-result',
        meta: {
            auth: true,
            title: '注册结果'
        },
        component: () => import('@/pages/account/register/result')
    }
];

/**
 * 错误页面
 */

/*const errorPage = [
    {
        path: '/403',
        name: '403',
        component: () => import('@/pages/system/error/403')
    },
    {
        path: '/500',
        name: '500',
        component: () => import('@/pages/system/error/500')
    },
    {
        path: '*',
        name: '404',
        component: () => import('@/pages/system/error/404')
    }
];*/

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut
];
