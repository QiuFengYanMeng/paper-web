<template>
    <div>
        <h2>基本设置</h2>
        <Form ref="form" v-if="user!=null" :model="user" :rules="rules" label-position="top" class="ivu-mt">
            <Row type="flex" :gutter="48">
                <Col v-bind="grid1">
                    <FormItem label="头像" prop="avatar">
                        <Avatar :src="getImg(user.avatar)" class="setting-account-info-avatar" shape="square" />
                        <Upload :action="uploadUrl" class="ivu-mt ivu-mb" :on-success="uploadSuccess" :show-upload-list="false">
                            <Button icon="md-camera">修改头像</Button>
                        </Upload>
                    </FormItem>
                </Col>
                <Col v-bind="grid2">
                    <FormItem label="用户名">
                        <Input v-model="user.userName" :disabled="true" />
                    </FormItem>
                    <FormItem label="角色">
                        <Input v-model="user.role.name" :disabled="true"/>
                    </FormItem>
                    <FormItem label="姓名" prop="name">
                        <Input v-model="user.name" placeholder="请输入昵称" />
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input v-model="user.email" placeholder="请输入邮箱" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit" :loading="saveLoading">更新基本信息</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>
<script>
    import dataUtils from '@/utils/dataUtils';
    import Setting from '@/setting';
    import { saveUser } from '@api/account';
    import appUtils from '@/utils/appUtils';
    export default {
        data () {
            return {
                grid1: {
                    xl: {
                        span: 12,
                        order: 2
                    },
                    lg: {
                        span: 24,
                        order: 1
                    },
                    md: {
                        span: 24,
                        order: 1
                    },
                    sm: {
                        span: 24,
                        order: 1
                    },
                    xs: {
                        span: 24,
                        order: 1
                    }
                },
                grid2: {
                    xl: {
                        span: 12,
                        order: 1
                    },
                    lg: {
                        span: 24,
                        order: 2
                    },
                    md: {
                        span: 24,
                        order: 2
                    },
                    sm: {
                        span: 24,
                        order: 2
                    },
                    xs: {
                        span: 24,
                        order: 2
                    }
                },
                rules: {
                    name: [
                        { required: true, message: '请输入昵称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ]
                },
                user: null,
                saveLoading: false,
                uploadUrl: null
            }
        },
        methods: {
            handleSubmit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let that = this
                        let model = {
                            id: that.user.id,
                            email: that.user.email,
                            name: that.user.name,
                            avatar: that.user.avatar,
                            role: {
                                id: that.user.role.id
                            }
                        }
                        that.saveLoading = true
                        saveUser(model).then(async res => {
                            if (res.state) {
                                appUtils.showSuccess(res.msg)
                                dataUtils.setData(Setting.key.userInfo, this.user)
                                this.$store.dispatch('admin/user/set', {
                                    name: this.user.name,
                                    avatar: this.user.avatar,
                                    access: ['admin']
                                });
                            } else {
                                appUtils.showError(res.msg)
                            }
                            that.saveLoading = false
                        })
                    }
                });
            },
            // 上传成功
            uploadSuccess (response, file, fileList) {
                this.user.avatar = response.data.bucketName + '-' + response.data.fileName
            },
            // 获取图片
            getImg (url) {
                return dataUtils.getImg(url)
            }
        },
        mounted () {
            this.uploadUrl = Setting.apiBaseURL + '/system/file/upload'
            this.user = dataUtils.getData(Setting.key.userInfo)
        }
    }
</script>
<style lang="less">
    .setting-account-info{
        &-avatar{
            width: 90px;
            height: 90px;
        }
    }
</style>
