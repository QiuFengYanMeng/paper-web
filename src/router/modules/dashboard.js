import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: false
};

const pre = 'dashboard-';

export default {
    path: '/dashboard',
    name: 'dashboard',
    redirect: {
        name: `${pre}console`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'operate',
            name: `${pre}operate`,
            meta: {
                title: '运营中心'
            },
            component: () => import('@/pages/dashboard/console')
        }
    ]
};
