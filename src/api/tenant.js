/**
 * 租户 接口
 *
 *  author： chendengwen
 *  date： 2019-08-03 12:45:11
 */
import request from '@/plugins/request';

/**
 * 租户列表
 * @param query
 */
export function listTenant(query) {
    return request({
        url: '/system/tenant/list',
        method: 'get',
        params: query
    })
}

/**
 * 租户分页
 * @param query
 */
export function pageTenant(query) {
    return request({
        url: '/system/tenant/page',
        method: 'get',
        params: query
    })
}

/**
 * 根据id删除租户
 * @param id
 */
export function delTenant(id) {
    return request({
        url: '/system/tenant/' + id,
        method: 'delete'
    })
}

/**
 * 编辑租户
 * @param obj
 */
export function saveTenant(obj) {
    return request({
        url: '/system/tenant/',
        method: 'post',
        data: obj
    })
}

/**
 * 根据id查询租户
 * @param id
 */
export function getTenant(id) {
    return request({
        url: '/system/tenant/' + id,
        method: 'get'
    })
}


/**
 * 根据id查询租户
 * @param id
 */
export function updateTenantStatus(obj) {
    return request({
        url: '/system/tenant/update-status',
        method: 'put',
        data: obj
    })
}
