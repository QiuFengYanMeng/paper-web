import request from '@/plugins/request';

/**
 * 角色列表
 * @param data
 * @constructor
 */
export function roleList () {
    return request({
        url: '/system/role/list',
        method: 'get'
    });
}
