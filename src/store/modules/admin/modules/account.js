/**
 * 注册、登录、注销
 * */
import util from '@/libs/util';
import router from '@/router';
import appUtils from '@/utils/appUtils';
import { AccountLogin, AccountRegister,updateUserPwd } from '@api/account';
import dataUtils from '@/utils/dataUtils'
import { Modal } from 'iview';
import Setting from '../../../../setting';

var md5 = require('js-md5');

export default {
    namespaced: true,
    actions: {
        /**
         * @description 登录
         * @param {Object} param context
         * @param {Object} param username {String} 用户账号
         * @param {Object} param password {String} 密码
         * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
         */
        login ({ dispatch }, {
            loginName = '',
            password = ''
        } = {}) {
            return new Promise((resolve, reject) => {
                // 开始请求登录接口
                AccountLogin({
                    loginName,
                    password: md5.hex(password)
                })
                    .then(async res => {
                        if (res.state) {
                            dataUtils.setData(Setting.key.uuid, res.uuid)
                            dataUtils.setData(Setting.key.token, res.token)
                            dataUtils.setData(Setting.key.userInfo, res.data)
                            // 设置 vuex 用户信息
                            await dispatch('admin/user/set', res.data, { root: true });
                            // 用户登录后从持久化数据加载一系列的设置
                            await dispatch('load');
                        }
                        // 结束
                        resolve(res);
                    })
                    .catch(err => {
                        // console.log('err: ', err);
                        reject(err);
                    })
            })
        },
        /**
         * @description 退出登录
         * */
        logout ({ commit, dispatch }, { confirm = false } = {}) {
            async function logout () {
                // 删除cookie
                util.cookies.remove('token');
                util.cookies.remove('uuid');
                // 清空 vuex 用户信息
                await dispatch('admin/user/set', {}, { root: true });
                // 跳转路由
                router.push({
                    name: 'login'
                });
            }

            if (confirm) {
                Modal.confirm({
                    title: '退出登录确认',
                    content: '您确定退出登录当前账户吗？打开的标签页和个人设置将会保存。',
                    onOk () {
                        logout();
                    }
                });
            } else {
                logout();
            }
        },
        /**
         * @description 注册
         * @param {Object} param context
         * @param {Object} param mail {String} 邮箱
         * @param {Object} param password {String} 密码
         * @param {Object} param mobile {String} 手机号码
         * @param {Object} param captcha {String} 验证码
         */
        register ({ dispatch }, {
            passwordOld = '',
            password = '',
            passwordConfirm = ''
        } = {}) {
            return new Promise((resolve, reject) => {
                //显示遮罩
                let loading = appUtils.showLoading();
                // 开始请求登录接口
                updateUserPwd({
                    passwordOld: md5.hex(passwordOld),
                    password: md5.hex(password),
                    passwordConfirm: md5.hex(passwordConfirm)
                })
                    .then(async res => {
                        //隐藏遮罩
                        appUtils.hideLoading(loading)
                        //修改成功
                        if (res.state) {
                            // 删除cookie
                            util.cookies.remove('token');
                            util.cookies.remove('uuid');
                            // 清空 vuex 用户信息
                            await dispatch('admin/user/set', {}, { root: true });
                            // 跳转路由
                            router.push({
                                name: 'login'
                            });
                        }else {
                            appUtils.showError(res.msg)
                        }
                    })
                    .catch(err => {
                        // console.log('err: ', err);
                        reject(err);
                    })
            })
        },
        /**
         * @description 用户登录后从持久化数据加载一系列的设置
         * @param {Object} state vuex state
         * @param {Object} dispatch vuex dispatch
         */
        load ({ state, dispatch }) {
            return new Promise(async resolve => {
                // 加载用户登录信息
                await dispatch('admin/user/load', null, { root: true });
                // 持久化数据加载上次退出时的多页列表
                await dispatch('admin/page/openedLoad', null, { root: true });
                // end
                resolve();
            })
        }
    }
};
