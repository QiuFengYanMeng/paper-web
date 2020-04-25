<template>
    <i-link class="i-layout-header-logo" :class="{ 'i-layout-header-logo-stick': !isMobile }" to="/">
        <img src="@/assets/images/logo-small.png" style="margin-left: 17px;width: 45px;height: 45px" v-if="isMobile">
        <img src="@/assets/images/logo.png" v-else-if="headerTheme === 'light'">
        <img src="@/assets/images/logo-dark.png" v-else>
    </i-link>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        name: 'iHeaderLogo',
        computed: {
            ...mapState('admin/layout', [
                'isMobile',
                'headerTheme'
            ])
        }
    }
</script>
