<template>
    <Grid :col="3" class="dashboard-workplace-apps" :border="false" padding="6px" hover>
        <GridItem v-for="item in dataList" :key="item.name">
            <div class="dashboard-workplace-apps-item"
                 :style="'background-image:url(' + getImg(item.image) + ')'">
                <div class="dashboard-workplace-apps-item-main">
                    <div class="dashboard-workplace-apps-name">{{ item.name }}</div>
                    <div class="dashboard-workplace-apps-desc">{{ item.industry.name }}</div>
                </div>
            </div>
        </GridItem>
    </Grid>
</template>
<script>

    import appUtils from '@/utils/appUtils'
    import Setting from '@/setting';

    export default {
        data() {
            return {
                data: [
                    {
                        name: 'iView',
                        desc: '基础组件库',
                        cover: 'https://dev-file.iviewui.com/p50TGdvvpXWVR06Vu2TAwkpRnpt8FURA/middle',
                        collect: 0
                    },
                    {
                        name: 'iView Pro',
                        desc: '高级组件库',
                        cover: 'https://dev-file.iviewui.com/WLXm7gp1EbLDtvVQgkeQeyq5OtDm00Jd/middle',
                        collect: 0
                    },
                    {
                        name: 'iView Admin Pro',
                        desc: '',
                        cover: 'https://dev-file.iviewui.com/p50TGdvvpXWVR06Vu2TAwkpRnpt8FURA/middle',
                        collect: 1
                    },
                    {
                        name: 'iView Developer',
                        desc: '社区',
                        cover: 'https://dev-file.iviewui.com/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg/middle',
                        collect: 1
                    },
                    {
                        name: 'iView Run',
                        desc: '',
                        cover: 'https://dev-file.iviewui.com/p50TGdvvpXWVR06Vu2TAwkpRnpt8FURA/middle',
                        collect: 0
                    },
                    {
                        name: 'iView Doc',
                        desc: '文档',
                        cover: 'https://dev-file.iviewui.com/fAenQ8nvRjL7x0i0jEfuDBZHvJfHf3v6/middle',
                        collect: 0
                    }
                ],
                dataList: []
            }
        },
        methods: {
            getImg(item) {
                return Setting.imgBaseURL + item
            },
            handleCollect(index) {
                this.data[index].collect = 1;
            },
            handleUnCollect(index) {
                this.data[index].collect = 0;
            },
            // 获取数据
            getData() {
                let loading = appUtils.showLoading();
                pageScreen({page: 1, limit: 6}).then(res => {
                    appUtils.hideLoading(loading)
                    if (res.state) {
                        this.dataList = res.data
                    } else {
                        appUtils.showError(res.msg)
                    }
                })
            },
        },
        mounted() {
            this.getData()
        }
    }
</script>
<style lang="less">
    .dashboard-workplace-apps {
        &-item {
            height: 100px;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            border-radius: 3px;
            text-shadow: 0 1px 1px rgba(0, 0, 0, .1);
            position: relative;

            &:after {
                content: '';
                display: block;
                position: absolute;
                border-radius: 3px;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, .1);
                z-index: 0;
            }

            &-main {
                position: relative;
                z-index: 1;
            }
        }

        &-name, &-desc {
            color: #fff;
            font-weight: bold;
            padding: 4px 0 0 8px;
            font-size: 16px;
            margin-right: 45px;
        }

        &-desc {
            font-weight: normal;
            font-size: 12px;
        }

        &-extra {
            position: absolute;
            top: 6px;
            right: 6px;
            color: #f8f8f9;

            i {
                margin-left: 4px;
                font-size: 16px;
            }

            i.dashboard-workplace-apps-extra-star {
                color: #ff9900;
            }

            i:not(.dashboard-workplace-apps-extra-star) {
                display: none;
            }
        }

        &-item:hover &-extra i {
            display: inline-block;
        }
    }
</style>
