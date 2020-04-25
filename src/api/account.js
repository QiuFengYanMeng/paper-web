import request from '@/plugins/request';

/**
 * 登录
 * @param data
 * @constructor
 */
export function AccountLogin (data) {
    return request({
        url: '/system/login',
        method: 'post',
        data: data
    });
}