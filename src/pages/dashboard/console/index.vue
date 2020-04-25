<template>
    <div v-resize="handleResize">
        <!--<base-info ref="baseInfo" />
        <grid-menu />-->
        <Card :bordered="false" dis-hover class="dashboard-console-visit">
            <span>{{username}}</span>，您好
            <br/>
            <br/>
            <span>欢迎使用毕业论文管理系统</span>
        </Card>
        <!--<Row :gutter="24" class="ivu-mt">
            <Col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
                <Card :bordered="false" dis-hover v-height="480">
                    <div slot="title">
                        <Avatar icon="ios-search" size="small" v-color="'#722ed1'" v-bg-color="'#f9f0ff'" />
                        <span class="ivu-pl-8">热门搜索</span>
                    </div>
                    <div slot="extra">
                        <Dropdown>
                            <Icon type="md-more" />
                            <DropdownMenu slot="list">
                                <DropdownItem>操作一</DropdownItem>
                                <DropdownItem>操作二</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <hot-search ref="hotSearch" />
                </Card>
            </Col>
            <Col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" class="ivu-mb">
                <Card :bordered="false" dis-hover v-height="480">
                    <div slot="title">
                        <Avatar icon="ios-people" size="small" v-color="'#faad14'" v-bg-color="'#fffbe6'" />
                        <span class="ivu-pl-8">用户画像</span>
                    </div>
                    <div slot="extra">
                        <Tooltip placement="top" content="下载数据">
                            <Icon type="ios-download-outline" />
                        </Tooltip>
                    </div>
                    <user-preference />
                </Card>
            </Col>
        </Row>-->
    </div>
</template>
<script>
    import baseInfo from './base-info';
    import gridMenu from './grid-menu';
    import visitChart from './visit-chart';
    import hotSearch from './hot-search';
    import userPreference from './user-preference';
    import dataUtils from '@/utils/dataUtils';
    import Setting from '@/setting';

    export default {
        name: 'dashboard-console',
        components: { baseInfo, gridMenu, visitChart, hotSearch, userPreference },
        data () {
            return {
                username: '',
                visitType: 'day', // day, month, year
                visitDate: [(new Date()), (new Date())]
            }
        },
        methods: {
            handleChangeVisitType (val) {
                if (val === 'day') {
                    this.visitDate = [(new Date()), (new Date())];
                } else if (val === 'month') {
                    this.visitDate = [(new Date() - 86400000 * 30), (new Date())];
                } else if (val === 'year') {
                    this.visitDate = [(new Date() - 86400000 * 365), (new Date())];
                }
            },
            // 监听页面宽度变化，刷新表格
            handleResize () {
                this.$refs.baseInfo.handleResize();
                this.$refs.visitChart.handleResize();
                this.$refs.hotSearch.handleResize();
            }
        },
        mounted() {
            //this.userInfo
            this.username = dataUtils.getData(Setting.key.userInfo).nickname;
        }
    }
</script>
<style lang="less">
    .dashboard-console-visit{
        .ivu-radio-group-button .ivu-radio-wrapper{
            border: none !important;
            box-shadow: none !important;
            padding: 0 12px;
        }
        .ivu-radio-group-button .ivu-radio-wrapper:before, .ivu-radio-group-button .ivu-radio-wrapper:after{
            display: none;
        }
    }
</style>
