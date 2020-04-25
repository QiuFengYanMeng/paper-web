<template>
    <div class="setting-account-safety">
        <h2>安全设置</h2>
        <div class="ivu-mt ivu-pl ivu-pr">
            <Row type="flex" justify="center" align="middle">
                <Col span="22">
                    <h4>账户密码</h4>
                </Col>
            </Row>
            <Divider/>
            <Row type="flex" justify="center" align="middle">
                <el-form :model="user" :rules="form" ref="user" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原始密码" prop="oldPass">
                        <el-input type="password" v-model="user.oldPass" placeholder="请输入原密码"
                                  style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPass">
                        <el-input type="password" v-model="user.newPass" placeholder="请输入新密码"
                                  style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="Pass">
                        <el-input type="password" v-model="user.Pass" placeholder="请输入新密码"
                                  style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePss">修改</el-button>
                    </el-form-item>
                </el-form>
            </Row>
        </div>
    </div>
</template>
<script>
    import { updateUserPwd } from '@api/account';
    import appUtils from '@/utils/appUtils';
    import dataUtils from '@/utils/dataUtils';
    import Setting from '@/setting';
    var md5 = require('js-md5');
    export default {
        data () {
            var Pass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请确认密码'));
                } else if (value !== this.user.newPass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                user: {
                    oldPass: '',
                    newPass: '',
                    Pass: ''
                },
                form: {// 验证
                    oldPass: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { min: 6, max: 18, message: '密码长度6-18位', trigger: 'blur' }
                    ],
                    newPass: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 6, max: 18, message: '密码长度6-18位', trigger: 'blur' }
                    ],
                    Pass: [
                        { required: true, message: '请确认密码', trigger: 'blur' },
                        { validator: Pass, trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            pwdData: function () {
                var pwd = JSON.parse(JSON.stringify(this.user));
                pwd.oldPwd = md5.hex(pwd.oldPass);
                pwd.password = md5.hex(pwd.newPass);
                pwd.id = dataUtils.getData(Setting.key.userInfo).id;
                return pwd;
            }
        },
        methods: {// 执行的方法
            updatePss () {
                var that = this;
                this.$refs.user.validate((valid) => {
                    if (valid) {
                        var loading = appUtils.showLoading()
                        updateUserPwd(that.pwdData).then(async res => {
                            if (res.state) {
                                dataUtils.setData(Setting.key.token, res.token);
                                appUtils.showSuccess(res.msg)
                            } else {
                                appUtils.showError(res.msg)
                            }
                            appUtils.hideLoading(loading)
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
<style lang="less">
    .setting-account-safety {
        .ivu-col {
            p {
                margin-top: 8px;
                color: #808695;
            }
        }
    }
</style>
