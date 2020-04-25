<template>
  <div>
    <Row>
      <Col span="6">
      <Card style="width:273px;height: 600px" shadow>
        <p slot="title">
          图片分类
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

        <!--<Spin size="large" fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          加载中...
        </Spin>-->
        <p slot="title">
          {{typeTitle}}
          <el-checkbox v-model="isSelectAll" @change="selectAll" style="margin-left: 20px">全选</el-checkbox>
        </p>
        <a slot="extra">
          <div v-if="selectImageList!=null&&selectImageList.length>0">
            <Button type="text" @click="clearSelect">取消选择</Button>
            <Button icon="md-trash" type="error" shape="circle" @click="batchDelete">删除图片</Button>
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
              accept="image/*"
              multiple
              :on-success="handleAvatarSuccess" style="display: inline;">
              <Button icon="ios-cloud-upload-outline" type="primary" shape="circle">上传图片</Button>
            </el-upload>
          </div>
        </a>
        <div style="height: 510px;overflow: auto" :id="imageViewId">
          <el-checkbox-group v-model="selectImageList">
            <el-card v-for="(item,index) in fileList" v-if="index<maxLength" :key="item.id" class="imgCard"
                     style="width:120px;border: 0px;border-radius: 0px;position: relative"
                     :body-style="{ padding: '0px' }">
              <el-checkbox :label="item.id" style="position: absolute;left: 3px;top: 0px">&nbsp;</el-checkbox>
              <img width="120" height="120" :src="getImg(item.url)"
                   class="image">
              <div>
                <el-input :title="item.name" v-model="item.name" autofocus @focus="focusName(item)"
                          @blur="blurName(item)" placeholder="请输入内容"></el-input>
              </div>
            </el-card>
          </el-checkbox-group>
          <div style="clear: both"></div>
          <Button v-if="maxLength<fileList.length" type="primary" style="margin-left: 43%" @click="maxLength+=18">加载更多</Button>
        </div>
      </Card>
      </Col>
    </Row>

    <Button v-if="!hiedOk" @click="okSelect" type="primary" style="float: right;margin: 10px">确定</Button>
    <p v-if="selectImageList!=null&&selectImageList.length>0" style="float: right;margin: 10px;line-height: 30px">已选择
      <span style="color: #ed4014">{{selectImageList.length}}</span> 张图片</p>
    <div style="clear: both"></div>
  </div>
</template>
<style>
  .dosion-image .ivu-modal-body {
    padding: 0px !important;
  }

  .dosion-image .ivu-card-extra {
    top: 8px;
  }

  .dosion-image .imgCard {
    float: left;
    margin: 5px;
    margin-bottom: 10px;
  }

  .dosion-image .imgCard.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0);
  }

  .forder-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .imgCard .el-input__inner {
    border: 1px solid transparent;
    border-radius: 0px;
    padding: 0px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
    font-style: normal;
  }

  .imgCard.el-input__inner:hover {
    border-color: transparent;
  }

  .imgCard .el-input__inner:focus {
    border: 1px solid #409EFF;
    outline: 0;
  }
</style>
<script>
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
  import viewerjs from 'viewerjs/dist/viewer.js'
  import viewercss from 'viewerjs/dist/viewer.css'

  export default {
    name: 'content-image',
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
        selectFolder: 0, //选中的文件夹
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        fileList: [],//文件列表
        uploadData: {
          'type': '0',
          'app': config.appName,
        },
        uploadHeader: {'token': '' + dataUtils.getData(config.key.tokenKey) + ''},//文件上传请求头
        viewer: null,//图片预览
        selectImageList: [],//选中的图片
        isSelectAll: false,//是否全选
        tempName: null,//临时名称
        query: {
          'name': null,
          'type': '0'
        },
        maxLength:18//显示个数
      }
    },
    computed: {
      imageViewId () {
        return `imageView${this._uid}`
      }
    },
    watch: {
      selectImageList () {
        if (this.selectImageList == null || this.selectImageList.length <= 0) {
          this.isSelectAll = false;
          return
        }
        if (this.selectImageList.length == this.fileList.length) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
        }
      },
      show (val) {
        if (val) {
          this.selectImageList = [];
          this.getForder()
        }
      },
      deep: true
    },
    methods: {
      //获取图片
      getImg (url) {
        return config.fileUrl+'/file/' + url
      },
      uploadUrl () {
        return config.fileUrl + '/file/upload?type=0&folderId=' + this.selectFolder
      },
      //加载文件夹
      getForder () {
        this.loading = true;

        listFolder(0).then(res => {
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
      getFile () {
        this.loading = true;
        listFile(this.selectFolder , 0).then(res => {
          this.loading = false;
          if (res.state) {
            this.maxLength = 18;
            this.fileList = res.data;
            var imageDom = document.getElementById(this.imageViewId);
            this.initViewer(imageDom)
          } else {
            appUtils.showError(res.msg)
          }
        })
      },
      //添加文件夹
      addForder (forder) {
        var fordered = {
          pid: this.selectFolder,
          type: 0,
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
      delForder (forder) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定删除分类？</p><p style="color: red">（删除后该分类图片自动移动到全部分类下）</p>',
          loading: true,
          onOk: () => {
            delFolder(forder.id).then(res => {
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
      //上传之前
      beforeUpload (file) {
        this.loading = true
      },
      //上传失败
      errorUpload (err, file, fileList) {
        this.$Message.error(err);
        this.loading = false
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
      //预览插件
      initViewer (dom) {
        var that = this;
        this.$nextTick(() => {
          if (that.viewer != null) {
            that.viewer.destroy()
          }
          that.viewer = new viewerjs(dom, {
            //navbar:false,
            url: 'data-original',
            inline: false,
            viewed: function () {
              that.viewer.zoomTo(1)
            },
            show: function () {
              that.viewer.update()
            }
          })
        })
      },
      //树节点点击
      treeClick (data, node, el) {
        /*if (this.selectForder.id != data.id) {
          this.selectForder = data;
          this.typeTitle = data.name;
          this.getFile();
          this.selectImageList = []
        }*/
        this.selectFolder = data.id;
        this.getFile()
      },
      //取消图片选择
      clearSelect () {
        this.selectImageList = []
      },
      //批量删除
      batchDelete () {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除选择的图片？',
          loading: true,
          onOk: () => {
            delFile(this.selectImageList).then(res => {
              this.loading = false;
              if (res.state) {
                if (res.state) {
                  this.$Message.success(res.msg);
                  this.getFile();
                  this.selectImageList = []
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
      okSelect () {
        var selectImg = [];
        dataUtils.each(this.selectImageList, (k, o) => {
          var arr = this.fileList.filter(t => t.id == o);
          if (arr != null && arr.length > 0) {
            selectImg.push(arr[0])
          }
        });
        this.$emit('select', selectImg);
        this.selectImageList = []
      },
      //全选
      selectAll (val) {
        this.selectImageList = [];
        dataUtils.each(this.fileList, (key, obj) => {
          this.selectImageList.push(obj.id)
        })
      },
      //编辑名称失去焦点
      blurName (item) {
        if (this.tempName != item.name) {
          siteFile.file.save({'id': item.id, 'name': item.name}, res => {
            if (res.state) {
              this.$Message.success(res.msg)
            } else {
              this.$Message.error(res.msg);
              item.name = this.tempName
            }
          })
        }
      },
      //编辑名称获得焦点
      focusName (item) {
        this.tempName = item.name
      }
    },
    mounted () {
      this.getForder()
    }
  }
</script>
