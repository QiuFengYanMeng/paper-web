<template>
    <div class="page-account">
        <div class="page-account-container">
            <div class="page-account-top">
                <div class="page-account-top-logo" style="font-size: 24px;font-weight: bold">
                    毕业论文管理系统
                </div>
            </div>
            <Login @on-submit="handleSubmit">
                <!--<UserName name="tenantLoginName" :rules="tenantRule" placeholder="请输入学校名称"/>-->
                <UserName name="loginName"/>
                <Password name="password" enter-to-submit/>
                <!--<div class="page-account-auto-login">
                    <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>
                    <a href="">忘记密码</a>
                </div>-->
                <Submit :loading="loading"/>
            </Login>
        </div>
        <i-copyright/>
    </div>
</template>
<script>
    import iCopyright from '@/components/copyright';
    import {mapActions} from 'vuex';
    import appUtils from '@/utils/appUtils'

    export default {
        components: {iCopyright},
        data() {
            return {
                autoLogin: true,
                loading: false,
                tenantRule: [
                    {
                        required: true, message: '请输入学校名称！', trigger: 'change'
                    }
                ],
            }
        },
        methods: {
            ...mapActions('admin/account', [
                'login'
            ]),
            /**
             * @description 登录
             */
            handleSubmit(valid, values) {
                if (valid) {
                    const { loginName, password } = values;
                    this.loading = true
                    this.login({
                        loginName,
                        password
                    }).then((res) => {
                        if (res.state) {
                            // 重定向对象不存在则返回顶层路径
                            this.$router.replace('/');
                        } else {
                            appUtils.showError(res.msg)
                        }
                        this.loading = false
                    });
                }
            }
        }
    };
</script>
