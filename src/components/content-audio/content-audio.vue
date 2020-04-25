<template>
  <div>
    <Row>
      <Col span="6">
      <Card style="width:273px;height: 600px" shadow>
        <p slot="title">
          音频分类
        </p>
        <Button @click="addForder(null)" slot="extra" icon="md-add" type="primary" shape="circle">新增</Button>
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
          <el-checkbox v-model="isSelectAll" @change="selectAll" style="margin-left: 20px">全选</el-checkbox>
        </p>
        <a slot="extra">
          <div v-if="selectMusicList!=null&&selectMusicList.length>0">
            <Button type="text" @click="clearSelect">取消选择</Button>
            <Button icon="md-trash" type="error" shape="circle" @click="batchDelete">删除音频</Button>
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
              accept="audio/*"
              multiple
              :on-success="handleAvatarSuccess" style="display: inline;">
              <Button icon="ios-cloud-upload-outline" type="primary" shape="circle">上传音频</Button>
            </el-upload>
          </div>
        </a>
        <div style="height: 510px;overflow: auto">
          <el-checkbox-group v-model="selectMusicList">
            <el-table
              :data="musicList"
              size="mini"
              style="width: 100%">
              <el-table-column
                label="音频名称" prop="title">
                <template slot-scope="scope">
                  <el-checkbox :label="scope.row.id">
                    <span v-if="music==null||scope.row.id != music.id" v-text="scope.row.title"></span>
                    <span v-else style="color:  rgb(65, 184, 131)" v-text="scope.row.title"></span>
                  </el-checkbox>
                </template>

              </el-table-column>

              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <Icon type="md-play" v-if="music==null||scope.row.id != music.id"
                        style="font-size: 16px;cursor: pointer;margin-right: 5px" @click="payer(scope.row)"/>
                  <Icon type="md-pause" v-else style="font-size: 16px;cursor: pointer;margin-right: 5px"
                        @click="pause(scope.row)"/>
                  <Icon type="md-download" style="font-size: 16px;cursor: pointer;margin-right: 5px"
                        @click="download(scope.row)"/>
                  <Icon type="md-create" style="font-size: 16px;cursor: pointer;margin-right: 5px"
                        @click="editName(scope.row)"/>
                  <Icon type="md-trash" style="font-size: 16px;cursor: pointer" @click="delMusic(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-checkbox-group>

          <div style="clear: both"></div>
        </div>
      </Card>
      </Col>
    </Row>

    <aplayer v-if="music!=null" style="float: left;width: 500px" preload="auto" :music="music">
    </aplayer>
    <Button  v-if="!hiedOk" @click="okSelect" type="primary" style="float: right;margin: 22px">确定</Button>
    <p v-if="selectMusicList!=null&&selectMusicList.length>0" style="float: right;margin: 10px;line-height: 56px">已选择
      <span style="color: #ed4014">{{selectMusicList.length}}</span> 个音频</p>
    <div style="clear: both"></div>
  </div>
</template>
<style>
  .dosion-audio .ivu-modal-body {
    padding: 0px !important;
  }

  .dosion-audio .ivu-card-extra {
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
  import config from '@/config'
  import dataUtils from '@/utils/dataUtils'
  import { siteFile } from '@/api/index'
  import appUtils from '@/utils/appUtils'
  import Aplayer from 'vue-aplayer'
  import $ from 'jquery'

  export default {
    components: {
      Aplayer
    },
    name: 'content-audio',
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
    data () {
      return {
        user:{},//当前用户
        loading: false,//加载中
        site: {},//站点信息
        typeTitle: '全部分类',//分类标题
        forderList: [],//文件夹列表
        selectForder: {},//选择的文件夹
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        fileList: [],//文件列表
        uploadData: {
          'type': '1',
          'app': config.appName,
        },
        uploadHeader: {'token': '' + dataUtils.getData(config.key.tokenKey) + ''},//文件上传请求头
        selectMusicList: [],//选中的音频
        isSelectAll: false,//是否全选
        query: {
          'name': null,
          'type': '1'
        },
        music: null,
        musicList: []
      }
    },
    computed: {},
    watch: {
      selectMusicList () {
        if (this.selectMusicList == null || this.selectMusicList.length <= 0) {
          this.isSelectAll = false;
          return
        }
        if (this.selectMusicList.length == this.fileList.length) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
        }
      },
      show (val) {
        if (val) {
          this.selectMusicList = [];
          this.getForder()
        }
      },
      deep: true
    },
    methods: {
      //获取音频
      getMusic (url, name, ext) {
        if (name.indexOf('.' + ext) != -1) {
          return config.fileUrl+'/file/get-media' + url+'?name='+name+'.' + ext
        }
        return config.fileUrl+'/file/get-media' + url+'?name='+name+'.' + ext
      },
      //上传地址
      uploadUrl () {
        return config.fileUrl + '/file/upload?folderId=' + this.selectForder.id
      },
      //加载文件夹
      getForder () {
        this.loading = true;
        siteFile.forder.list({'app': config.appName, 'type': '1'}, res => {
          this.loading = false;
          if (res.state) {
            this.forderList = [{
              id: 0,
              name: '全部分类',
              children: dataUtils.getALLMenuTree(res.data, "0")
            }];
            this.selectForder = this.forderList[0];
            this.getFile()
          } else {
            this.$Message.error(res.msg)
          }
        })
      },
      //获取文件
      getFile () {
        this.loading = true;
        this.query.app = config.appName;
        this.query['folderId'] = this.selectForder.id == 0 ? null : this.selectForder.id;
        siteFile.file.list(this.query, res => {
          this.loading = false;
          if (res.state) {
            this.fileList = res.data;
            this.musicList = [];
            dataUtils.each(res.data, (key, obj) => {
              this.musicList.push({
                id: obj.id,
                title: obj.name,
                artist: obj.createDate,
                ext: obj.ext,
                url: this.getMusic(obj.url, obj.name, obj.ext),
                preload: 'auto'
              })
            })
          } else {
            this.$Message.error(res.msg)
          }
        })
      },
      //添加文件夹
      addForder (forder) {
        var fordered = {
          'app': config.appName,
          'pid': this.forderList[0].id,
          'type': '1',
          'name': null
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
            siteFile.forder.save(fordered, res => {
              if (res.state) {
                this.getForder();
                this.$Message.success(res.msg)
              } else {
                this.$Message.error(res.msg)
              }
              this.$Modal.remove()
            })
          }
        })
      },
      //删除文件夹
      delForder (forder) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定删除分类？</p><p style="color: red">（删除后该分类音频自动移动到全部分类下）</p>',
          loading: true,
          onOk: () => {
            siteFile.forder.delete({'id': forder.id}, res => {
              if (res.state) {
                this.getForder();
                this.$Message.success(res.msg);
                this.selectMusicList = []
              } else {
                this.$Message.error(res.msg)
              }
              this.$Modal.remove()
            })
          }
        })
      },
      //上传之前
      beforeUpload (file) {
        this.loading = true
      },
      //上传失败
      errorUpload (err, file, fileList) {
        this.$Message.error(err)
      },
      //上传成功
      handleAvatarSuccess (res, file) {
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
      treeClick (data, node, el) {
        if (this.selectForder.id != data.id) {
          this.selectForder = data;
          this.typeTitle = data.name;
          this.getFile();
          this.selectMusicList = []
        }
      },
      //取消音频选择
      clearSelect () {
        this.selectMusicList = []
      },
      //批量删除
      batchDelete () {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除选择的音频？',
          loading: true,
          onOk: () => {
            siteFile.file.batchDelete({'ids': this.selectMusicList.toString()}, res => {
              if (res.state) {
                this.$Message.success(res.msg);
                this.getFile();
                this.selectMusicList = []
              } else {
                this.$Message.error(res.msg)
              }
              this.$Modal.remove()
            })
          }
        })
      },
      //确认选择
      okSelect () {
        var selectImg = [];
        dataUtils.each(this.selectMusicList, (k, o) => {
          var arr = this.fileList.filter(t => t.id == o);
          if (arr != null && arr.length > 0) {
            selectImg.push(arr[0])
          }
        });
        this.$emit('select', selectImg);
        this.selectMusicList = []
      },
      //全选
      selectAll (val) {
        this.selectMusicList = [];
        dataUtils.each(this.fileList, (key, obj) => {
          this.selectMusicList.push(obj.id)
        })
      },
      editName (row) {
        let music = JSON.parse(JSON.stringify(row));
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: music.title,
                autofocus: true,
                placeholder: '请输入音频名称'
              },
              on: {
                input: (val) => {
                  music.title = val
                }
              }
            })
          },
          loading: true,
          onOk: () => {
            siteFile.file.save({'id': music.id, 'name': music.title}, res => {
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
      //删除音频
      delMusic (row) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除音频？',
          loading: true,
          onOk: () => {
            siteFile.file.batchDelete({'ids': row.id}, res => {
              if (res.state) {
                this.$Message.success(res.msg);
                this.getFile();
                this.selectMusicList = []
              } else {
                this.$Message.error(res.msg)
              }
              this.$Modal.remove()
            })
          }
        })
      },
      download (row) {
        window.open(row.url)
      },
      //播放音频
      payer (row) {
        this.music = row;
        this.$nextTick(() => {
          if ($('.aplayer-button').find('.aplayer-icon-play').length <= 0) {
            $('.aplayer-button').find('.aplayer-icon-pause').click()
          }
          $('.aplayer-button').find('.aplayer-icon-play').click()
        })
      },
      //停止播放
      pause (row) {
        this.music = null
      }
    },
    mounted () {
      //this.user = dataUtils.getData(config.key.userInfo);
    }
  }
</script>
