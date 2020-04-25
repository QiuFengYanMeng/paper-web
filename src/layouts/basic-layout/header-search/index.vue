<template>
    <span v-if="!isMobile" class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in i-layout-header-trigger-nohover">
        <input class="i-layout-header-search" type="text" placeholder="搜索...">
    </span>
    <span v-else class="i-layout-header-trigger i-layout-header-trigger-min">
        <Dropdown trigger="click" class="i-layout-header-search-drop" ref="dropdown">
            <Icon type="ios-search" />
            <DropdownMenu slot="list">
                <div class="i-layout-header-search-drop-main">
                    <Input size="large" prefix="ios-search" type="text" placeholder="搜索..." />
                    <span class="i-layout-header-search-drop-main-cancel" @click="handleCloseSearch">取消</span>
                </div>
            </DropdownMenu>
        </Dropdown>
    </span>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        name: 'iHeaderSearch',
        computed: {
            ...mapState('admin/layout', [
                'isMobile',
                'headerMenu'
            ])
        },
        methods: {
            handleCloseSearch () {
                this.$refs.dropdown.handleClick();
            }
        }
    }
</script>
