<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min">
        <Dropdown :trigger="isMobile ? 'click' : 'hover'" class="i-layout-header-user"
                  :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
            <Avatar size="small" :src="getImg(info.avatar)" v-if="info.avatar"/>
            <span class="i-layout-header-user-name">{{ info.nickname }}</span>
            <DropdownMenu  slot="list">
                <i-link to="/setting/user" v-if="false">
                    <DropdownItem>
                        <Icon type="ios-contact-outline"/>
                        <span>个人中心</span>
                    </DropdownItem>
                </i-link>
                <!--<i-link to="/setting/account">
                    <DropdownItem>
                        <Icon type="ios-settings-outline"/>
                        <span>设置</span>
                    </DropdownItem>
                </i-link>-->
                <DropdownItem divided name="logout">
                    <Icon type="ios-log-out"/>
                    <span>退出登录</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </span>
</template>
<script>
    import { mapState, mapActions } from 'vuex';
    import dataUtils from '@/utils/dataUtils';
    export default {
        name: 'iHeaderUser',
        computed: {
            ...mapState('admin/user', [
                'info'
            ]),
            ...mapState('admin/layout', [
                'isMobile',
                'logoutConfirm'
            ])
        },
        methods: {
            ...mapActions('admin/account', [
                'logout'
            ]),
            handleClick (name) {
                if (name === 'logout') {
                    this.logout({
                        confirm: this.logoutConfirm
                    });
                }
            },
            // 获取图片
            getImg (url) {
                return dataUtils.getImg(url)
            }
        }
    }
</script>
