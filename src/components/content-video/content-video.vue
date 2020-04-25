<template>
    <div>
        <Row>
            <Col span="6">
                <Card style="width:273px;height: 600px" shadow>
                    <p slot="title">
                        视频分类
                    </p>
                    <Button @click="addForder(null)" slot="extra" icon="md-add" type="primary" shape="circle">新增
                    </Button>
                    <el-tree :data="forderList" :props="defaultProps" default-expand-all highlight-current
                             :expand-on-click-node="false" @node-click="treeClick">
           <span class="forder-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.id!=0">
              <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-edit"
                      @click.stop="addForder(data)">
              </el-button>
              <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click.stop="delForder(data)">
              </el-button>
            </span>
           </span>
                    </el-tree>
                </Card>
            </Col>
            <Col span="18">
                <Card style="width:825px;height: 600px;" shadow>

                    <Spin size="large" fix v-if="loading">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        加载中...
                    </Spin>
                    <p slot="title">
                        {{typeTitle}}
                        <el-checkbox v-model="isSelectAll" @change="selectAll" style="margin-left: 20px">全选
                        </el-checkbox>
                    </p>
                    <a slot="extra">
                        <div v-if="selectVideoList!=null&&selectVideoList.length>0">
                            <Button type="text" @click="clearSelect">取消选择</Button>
                            <Button icon="md-trash" type="error" shape="circle" @click="batchDelete">删除视频</Button>
                        </div>
                        <div v-else>
                            <Input v-model="query.name" type="text" suffix="ios-search" search @on-search="getFile"
                                   placeholder="请输入名称搜索" style="width: auto"/>
                            <el-upload
                                    :action="uploadUrl()"
                                    :show-file-list="false"
                                    :data="uploadData"
                                    :before-upload="beforeUpload"
                                    :on-error="errorUpload"
                                    :headers="uploadHeader"
                                    accept="video/*"
                                    multiple
                                    :on-success="handleAvatarSuccess" style="display: inline;">
                                <Button icon="ios-cloud-upload-outline" type="primary" shape="circle">上传视频</Button>
                            </el-upload>
                        </div>
                    </a>

                    <div style="height: 510px;overflow: auto">
                        <el-checkbox-group v-model="selectVideoList">
                            <el-table
                                    :data="videoList"
                                    size="mini"
                                    style="width: 100%">
                                <el-table-column
                                        label="视频名称" prop="title">
                                    <template slot-scope="scope">
                                        <el-checkbox :label="scope.row.id">
                                            <span v-text="scope.row.name"></span>
                                        </el-checkbox>
                                    </template>

                                </el-table-column>

                                <el-table-column label="操作" width="200" align="center">
                                    <template slot-scope="scope">
                                        <Icon type="md-play" style="font-size: 16px;cursor: pointer;margin-right: 5px"
                                              @click="payer(scope.row)"/>
                                        <Icon type="md-download"
                                              style="font-size: 16px;cursor: pointer;margin-right: 5px"
                                              @click="download(scope.row)"/>
                                        <Icon type="md-create" style="font-size: 16px;cursor: pointer;margin-right: 5px"
                                              @click="editName(scope.row)"/>
                                        <Icon type="md-trash" style="font-size: 16px;cursor: pointer"
                                              @click="delVideo(scope.row)"/>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-checkbox-group>
                    </div>
                </Card>
            </Col>
        </Row>


        <Button v-if="!hiedOk" @click="okSelect" type="primary" style="float: right;margin: 10px">确定</Button>
        <p v-if="selectVideoList!=null&&selectVideoList.length>0" style="float: right;margin: 10px;line-height: 30px">
            已选择
            <span style="color: #ed4014">{{selectVideoList.length}}</span> 个视频</p>
        <div style="clear: both"></div>

        <Modal v-model="showPlayerVideo" footer-hide width="1100">
            <video-player v-if="playerOptions.sources[0].src!=null" class="video-player vjs-custom-skin"
                          ref="videoPlayer"
                          :playsinline="true"
                          :options="playerOptions"
            ></video-player>
        </Modal>
    </div>
</template>
<style>
    .dosion-video .ivu-modal-body {
        padding: 0px !important;
    }

    .dosion-video .ivu-card-extra {
        top: 8px;
    }

    .forder-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
<script>
    import Vue from 'vue'
    import config from '@/config'
    import dataUtils from '@/utils/dataUtils'
    import {
        listFolder,
        saveFolder,
        delFolder,
        listFile,
        delFile
    } from '@/api/index'
    import appUtils from '@/utils/appUtils'
    import VideoPlayer from 'vue-video-player'

    require('video.js/dist/video-js.css');
    require('vue-video-player/src/custom-theme.css');
    Vue.use(VideoPlayer);
    export default {
        components: {},
        name: 'content-video',
        props: {
            value: {
                type: String
            },
            show: {
                type: Boolean
            },
            hiedOk: {
                type: Boolean
            }
        },
        data() {
            return {
                loading: false,//加载中
                site: {},//站点信息
                typeTitle: '全部分类',//分类标题
                fileList: [],//文件列表
                forderList: [],//文件夹列表
                selectForder: {},//选择的文件夹
                selectFolder: 0, //选中的文件夹
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                uploadData: {
                    'type': '2',
                    'app': config.appName,
                },
                uploadHeader: {'token': '' + dataUtils.getData(config.key.tokenKey) + ''},//文件上传请求头
                selectVideoList: [],//选中的视频
                isSelectAll: false,//是否全选
                query: {
                    'forderId': null,
                    'name': null,
                    'type': '2'
                },
                videoList: [],
                showPlayerVideo: false,//是否显示视频播放
                playerOptions: {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "",
                        src: null //url地址
                    }],
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true  //全屏按钮
                    }
                }
            }
        },
        computed: {},
        watch: {
            selectVideoList() {
                if (this.selectVideoList == null || this.selectVideoList.length <= 0) {
                    this.isSelectAll = false;
                    return
                }
                if (this.selectVideoList.length == this.fileList.length) {
                    this.isSelectAll = true
                } else {
                    this.isSelectAll = false
                }
            },
            show(val) {
                if (val) {
                    this.selectVideoList = [];
                    this.getForder()
                }
            },
            deep: true
        },
        methods: {
            //获取视频
            getVideo(url, name, ext) {
                if (name.indexOf('.' + ext) != -1) {
                    return config.fileUrl + '/file/' + url /*+ '?name=' + name + '.' + ext*/
                }
                return config.fileUrl + '/file/' + url
            },
            //上传地址
            uploadUrl() {
                return config.fileUrl + '/file/upload?type=2&folderId=' + this.selectFolder
            },
            //加载文件夹
            getForder() {
                this.loading = true;

                listFolder(2).then(res => {
                    this.loading = false;
                    if (res.state) {
                        this.forderList = [{
                            id: 0,
                            name: '全部分类',
                            children: dataUtils.getALLMenuTree(res.data, "0")
                        }];
                        this.selectForder = this.forderList[0];
                    } else {
                        appUtils.showError(res.msg)
                    }
                })
            },
            //获取文件
            getFile() {
                this.loading = true;
                listFile(this.selectFolder , 2).then(res => {
                    this.loading = false;
                    if (res.state) {
                        this.fileList = res.data;
                        this.videoList = res.data
                    } else {
                        appUtils.showError(res.msg)
                    }
                })
            },
            //添加文件夹
            addForder(forder) {
                var fordered = {
                    pid: this.selectFolder,
                    type: 2,
                    name: null
                };
                if (forder != null) {
                    var model = JSON.parse(JSON.stringify(forder));
                    fordered.id = model.id;
                    fordered.name = model.name
                }
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: fordered.name,
                                autofocus: true,
                                placeholder: '请输入分类名称'
                            },
                            on: {
                                input: (val) => {
                                    fordered.name = val
                                }
                            }
                        })
                    },
                    loading: true,
                    onOk: () => {
                        saveFolder(fordered).then(res => {
                            this.loading = false;
                            if (res.state) {
                                if (res.state) {
                                    this.getForder();
                                    this.$Message.success(res.msg)
                                } else {
                                    this.$Message.error(res.msg)
                                }
                                this.$Modal.remove()
                            }
                        })
                    }
                })
            },
            //删除文件夹
            delForder(forder) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定删除分类？</p><p style="color: red">（删除后该分类视频自动移动到全部分类下）</p>',
                    loading: true,
                    onOk: () => {
                        delFolder(forder.id).then(res => {
                            this.loading = false;
                            if (res.state) {
                                if (res.state) {
                                    this.getForder();
                                    this.$Message.success(res.msg);
                                    this.selectVideoList = []
                                } else {
                                    this.$Message.error(res.msg)
                                }
                                this.$Modal.remove()
                            }
                        })
                    }
                })
            },
            //上传之前
            beforeUpload(file) {
                this.loading = true
            },
            //上传失败
            errorUpload(err, file, fileList) {
                this.$Message.error(err);
                this.loading = false
            },
            //上传成功
            handleAvatarSuccess(res, file) {
                if (res.state) {
                    this.$Message.success(res.msg);
                    this.getFile()
                } else {
                    if (res.code == 1001) {
                        dataUtils.removeAllData();
                        location.reload()
                    } else {
                        this.$Message.error(res.msg)
                    }
                }
            },
            //树节点点击
            treeClick(data, node, el) {
                /*if (this.selectForder.id != data.id) {
                    this.selectForder = data;
                    this.typeTitle = data.name;
                    this.getFile();
                    this.selectVideoList = []
                }*/
                this.selectFolder = data.id;
                this.getFile()
            },
            //取消视频选择
            clearSelect() {
                this.selectVideoList = []
            },
            //批量删除
            batchDelete() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除选择的视频？',
                    loading: true,
                    onOk: () => {
                        delFile(this.selectVideoList).then(res => {
                            this.loading = false;
                            if (res.state) {
                                if (res.state) {
                                    this.$Message.success(res.msg);
                                    this.getFile();
                                    this.selectVideoList = []
                                } else {
                                    this.$Message.error(res.msg)
                                }
                                this.$Modal.remove()
                            }
                        })
                    }
                })
            },
            //确认选择
            okSelect() {
                var selectImg = [];
                dataUtils.each(this.selectVideoList, (k, o) => {
                    var arr = this.fileList.filter(t => t.id == o);
                    if (arr != null && arr.length > 0) {
                        selectImg.push(arr[0])
                    }
                });
                this.$emit('select', selectImg);
                this.selectVideoList = []
            },
            //全选
            selectAll(val) {
                this.selectVideoList = [];
                dataUtils.each(this.fileList, (key, obj) => {
                    this.selectVideoList.push(obj.id)
                })
            },
            editName(row) {
                let video = JSON.parse(JSON.stringify(row));
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: video.name,
                                autofocus: true,
                                placeholder: '请输入视频名称'
                            },
                            on: {
                                input: (val) => {
                                    video.name = val
                                }
                            }
                        })
                    },
                    loading: true,
                    onOk: () => {
                        siteFile.file.save({'id': video.id, 'name': video.name}, res => {
                            if (res.state) {
                                this.$Message.success(res.msg);
                                this.getFile()
                            } else {
                                this.$Message.error(res.msg)
                            }
                            this.$Modal.remove()
                        })
                    }
                })
            },
            //删除视频
            delVideo(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除视频？',
                    loading: true,
                    onOk: () => {
                        siteFile.file.batchDelete({'ids': row.id}, res => {
                            if (res.state) {
                                this.$Message.success(res.msg);
                                this.getFile();
                                this.selectVideoList = []
                            } else {
                                this.$Message.error(res.msg)
                            }
                            this.$Modal.remove()
                        })
                    }
                })
            },
            download(row) {
                window.open(row.url)
            },
            //播放视频
            payer(row) {
                this.showPlayerVideo = true;
                this.playerOptions.sources[0].src = this.getVideo(row.url, row.name, row.ext)
            }
        },
        mounted() {
            this.getForder()
        }
    }
</script>
