<template>
    <div>
        <Row :gutter="24">
            <Col :xl="6" :lg="6" :md="0" :sm="0" :xs="0">
                <Card shadow title="个人设置" icon="md-options" :padding="0">
                    <CellGroup @on-click="handleChangeCell" class="ivu-pt-8 ivu-pb-8">
                        <Cell title="基本设置" name="info" label="个人账户信息设置" :selected="currentType === 'info'" />
                        <Cell title="安全设置" name="safety" label="修改密码" :selected="currentType === 'safety'" />
                    </CellGroup>
                </Card>
            </Col>
            <Col :xl="18" :lg="18" :md="24" :sm="24" :xs="24">
                <Card :bordered="false" dis-hover>
                    <Row>
                        <Col :xl="0" :lg="0" :md="24" :sm="24" :xs="24">
                            <Tabs :value="currentType" @on-click="handleChangeCell">
                                <TabPane label="基本设置" name="info" />
                                <TabPane label="安全设置" name="safety" />
                            </Tabs>
                        </Col>
                    </Row>
                    <info v-if="currentType === 'info'" />
                    <safety v-if="currentType === 'safety'" />
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import info from './info';
    import safety from './safety';

    export default {
        name: 'setting-account',
        components: { info, safety },
        data () {
            return {
                currentType: 'info' // info | safety | account | notification
            }
        },
        methods: {
            handleChangeCell (name) {
                this.currentType = name;
            }
        }
    }
</script>
