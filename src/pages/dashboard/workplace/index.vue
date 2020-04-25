<template>
    <div>
        <div class="i-layout-page-header">
            <PageHeader :title="info.tenant.name+',工作台'" hidden-breadcrumb>
                <div slot="content">
                    <Avatar class="dashboard-workplace-header-avatar" :src="getImg(info.avatar)" />
                    <div class="dashboard-workplace-header-tip">
                        <p class="dashboard-workplace-header-tip-title">{{ info.name }}</p>
                        <div id="weather-view-he"></div>
                    </div>
                </div>
                <div slot="extra" class="dashboard-workplace-header-extra">
                    <Row type="flex" justify="center" align="middle" :gutter="12">
                        <Col span="8">
                            <p>
                                <Avatar icon="md-apps" size="small" v-color="'#40a9ff'" v-bg-color="'#e6f7ff'" />
                                <span>项目数</span>
                            </p>
                            <p>12</p>
                        </Col>
                        <Col span="8">
                            <p>
                                <Avatar icon="md-checkbox-outline" size="small" v-color="'#ffa940'" v-bg-color="'#fff7e6'" />
                                <span>待办项</span>
                            </p>
                            <p>
                                <Tooltip placement="top" content="待办：3 / 总计：24">
                                    3 / 24
                                </Tooltip>
                            </p>
                        </Col>
                        <Col span="8">
                            <p>
                                <Avatar icon="logo-usd" size="small" v-color="'#73d13d'" v-bg-color="'#f6ffed'" />
                                <span>积分</span>
                            </p>
                            <p>
                                <Numeral :value="1689" format="'0,'" />
                            </p>
                        </Col>
                    </Row>
                </div>
            </PageHeader>
        </div>
        <Row :gutter="24" class="ivu-mt">
            <Col :xl="16" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
                <Card :bordered="false" dis-hover :padding="6" class="ivu-mb">
                    <div slot="title">
                        <Avatar icon="md-apps" size="small" v-color="'#1890ff'" v-bg-color="'#e6f7ff'" />
                        <span class="ivu-pl-8">大屏</span>
                    </div>
                    <div slot="extra">
                        <a href="/screen/screen">全部大屏</a>
                    </div>
                    <my-apps />
                </Card>
                <Card :bordered="false" dis-hover class="ivu-mb">
                    <div slot="title">
                        <Avatar icon="ios-people" size="small" v-color="'#52c41a'" v-bg-color="'#f6ffed'" />
                        <span class="ivu-pl-8">小组成员</span>
                    </div>
                    <member />
                </Card>
            </Col>
            <Col :xl="8" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
                <Card :bordered="false" dis-hover class="ivu-mb">
                    <div slot="title">
                        <Avatar icon="md-heart" size="small" v-color="'#ff4d4f'" v-bg-color="'#fff1f0'" />
                        <span class="ivu-pl-8">快捷操作</span>
                    </div>
                    <shortcut />
                </Card>

            </Col>
        </Row>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import myApps from './my-apps';
    import shortcut from './shortcut';
    import feeds from './feeds';
    import todo from './todo';
    import member from './member';
    import Setting from '@/setting';
    import { tianqi } from '@api/account';
    export default {
        name: 'dashboard-workplace',
        components: { myApps, shortcut, feeds, todo, member },
        data () {
            return {

            }
        },
        methods:{
            getImg(url) {
                if (url != null && url.length > 0) {
                    return Setting.imgBaseURL + url
                }
            }
        },
        computed: {
            ...mapState('admin/user', [
                'info'
            ])
        },
        mounted() {
        }
    }
</script>
<style lang="less">
    .dashboard-workplace{
        &-header{
            &-avatar{
                width: 64px;
                height: 64px;
                border-radius: 50%;
                margin-right: 16px;
            }
            &-tip{
                display: inline-block;
                vertical-align: middle;
                &-title{
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 12px;
                }
                &-desc{
                    color: #808695;
                }
            }
            &-extra{
                .ivu-col{
                    p{
                        text-align: right;
                    }
                    p:first-child{
                        span:first-child{
                            margin-right: 4px;
                        }
                        span:last-child{
                            color: #808695;
                        }
                    }
                    p:last-child{
                        font-size: 22px;
                    }
                }
            }
        }
    }
</style>
