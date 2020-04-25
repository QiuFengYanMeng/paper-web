const pre = '/dashboard/';

export default {
    path: '/dashboard',
    title: 'Dashboard',
    header: 'home',
    custom: 'i-icon-demo i-icon-demo-dashboard',
    children: [
        {
            path: `${pre}operate`,
            title: '运营中心'
        }
    ],
    auth:['no-use']
}
