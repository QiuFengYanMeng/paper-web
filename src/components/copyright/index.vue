<template>
    <GlobalFooter class="i-copyright" :copyright="copyright"/>
</template>
<script>
    export default {
        name: 'i-copyright',
        data () {
            return {
                copyright: 'Copyright © 2020 毕业论文管理系统'
            }
        }
    }
</script>
<style lang="less">
    .i-copyright {
        flex: 0 0 auto;
    }
</style>
