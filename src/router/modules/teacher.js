import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: false
};

const pre = 'teacher-';

export default {
    path: '/teacher',
    name: 'teacher',
    redirect: {
        name: `${pre}teacher-list`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'teacher-list',
            name: `${pre}list`,
            meta: {
                ...meta,
                title: '教师管理'
            },
            component: () => import('@/pages/teacher/teacher-list')
        }
    ]
};
