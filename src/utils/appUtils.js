/**
 * 应用相关工具
 * 陈登文
 * 2018年8月6日 19:11:00
 */
import { Notice } from 'iview';

let appUtils = {}

/**
 * 打开加载
 * @param that
 * @param msg
 * @returns {*}
 */
appUtils.showLoading = function (that, msg) {
    var loading = layer.msg(msg == null ? '正在加载，请稍后...' : msg, { icon: 16, time: false, shade: 0.1 })
    return loading
}

/**
 * 关闭加载
 * @param loading
 */
appUtils.hideLoading = function (loading) {
    if (loading != null) {
        layer.close(loading)
    } else {
        layer.closeAll()
    }
}

/**
 * 显示成功
 * @param that
 * @param msg
 */
appUtils.showSuccess = function (msg, title) {
    Notice.success({
        title: title == null ? '成功' : title,
        desc: msg
    });
}

appUtils.showError = function (msg, title) {
    Notice.error({
        title: title == null ? '失败' : title,
        desc: msg
    });
}

export default appUtils
