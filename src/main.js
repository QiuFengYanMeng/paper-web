// Vue
import Vue from 'vue';
import App from './App';

// 插件
import plugins from '@/plugins';

// store
import store from '@/store/index';

// 引入echarts
import echarts from 'echarts';
//一般都要加个$加到vue的原型链上，方便引用
Vue.prototype.$echarts = echarts;

// iView 和 iView Pro
import iView from 'iview';
import iViewPro from '@/libs/iview-pro/iview-pro.min.js';

// 菜单和路由
import router from './router';
import menuHeader from '@/menu/header';
import menuSider from '@/menu/sider';
import { frameInRoutes } from '@/router/routes';

// 方法
import { getHeaderName, getMenuSider, getSiderSubmenu } from '@/libs/system';

// 内置组件
import iLink from '@/components/link';


// 使用样式，修改主题可以在 styles 目录下创建新的主题包并修改 iView 默认的 less 变量
// 参考 https://www.iviewui.com/docs/guide/theme
import './styles/index.less';
import './libs/iview-pro/iview-pro.css';

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import iviewArea from 'iview-area';

Vue.use(plugins);

Vue.use(iView);
Vue.use(iViewPro);
Vue.component('i-link', iLink);

Vue.use(ElementUI)
Vue.use(Avue);
Vue.use(iviewArea);
new Vue({
    router,
    store,
    render: h => h(App),
    created () {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('admin/page/init', frameInRoutes);
        // 设置顶栏菜单
        this.$store.commit('admin/menu/setHeader', menuHeader);
        // 加载用户登录的数据
        this.$store.dispatch('admin/account/load');
        // 初始化全屏监听
        this.$store.dispatch('admin/layout/listenFullscreen')
    },
    watch: {
        // 监听路由 控制侧边栏显示 标记当前顶栏菜单（如需要）
        '$route' ({ path }) {
            const headerName = getHeaderName(path, menuSider);
            // 在 404 时，是没有 headerName 的
            if (headerName !== null) {
                this.$store.commit('admin/menu/setHeaderName', headerName);

                const filterMenuSider = getMenuSider(menuSider, headerName);
                this.$store.commit('admin/menu/setSider', filterMenuSider);
                this.$store.commit('admin/menu/setActivePath', path);

                const openNames = getSiderSubmenu(path, menuSider);
                this.$store.commit('admin/menu/setOpenNames', openNames);
            }
        }
    }
}).$mount('#app');
