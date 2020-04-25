import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: false
};

const pre = 'student-';

export default {
    path: '/student',
    name: 'student',
    redirect: {
        name: `${pre}student-list`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'student-list',
            name: `${pre}list`,
            meta: {
                ...meta,
                title: '学生管理'
            },
            component: () => import('@/pages/student/student-list')
        }
    ]
};
