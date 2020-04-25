<template>
  <div>
    <Row>
      <Col span="6">
      <Card style="width:273px;height: 600px" shadow>
        <p slot="title">
          附件分类
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
          <div v-if="selectAccessoryList!=null&&selectAccessoryList.length>0">
            <Button type="text" @click="clearSelect">取消选择</Button>
            <Button icon="md-trash" type="error" shape="circle" @click="batchDelete">删除附件</Button>
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
              multiple
              :on-success="handleAvatarSuccess" style="display: inline;">
              <Button icon="ios-cloud-upload-outline" type="primary" shape="circle">上传附件</Button>
            </el-upload>
          </div>
        </a>
        <div style="height: 510px;overflow: auto">
          <el-checkbox-group v-model="selectAccessoryList">
            <el-table
              :data="fileList"
              size="mini"
              style="width: 100%">
              <el-table-column
                label="附件名称" prop="title">
                <template slot-scope="scope">
                  <el-checkbox :label="scope.row.id">
                    <span v-text="scope.row.name"></span>
                  </el-checkbox>
                </template>

              </el-table-column>

              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <Icon type="md-download" style="font-size: 16px;cursor: pointer;margin-right: 5px"
                        @click="download(scope.row)"/>
                  <Icon type="md-create" style="font-size: 16px;cursor: pointer;margin-right: 5px"
                        @click="editName(scope.row)"/>
                  <Icon type="md-trash" style="font-size: 16px;cursor: pointer" @click="delAccessory(scope.row)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-checkbox-group>

          <div style="clear: both"></div>
        </div>
      </Card>
      </Col>
    </Row>
    <Button  v-if="!hiedOk" @click="okSelect" type="primary" style="float: right;margin: 10px">确定</Button>
    <p v-if="selectAccessoryList!=null&&selectAccessoryList.length>0" style="float: right;margin: 10px;line-height: 30px">已选择
      <span style="color: #ed4014">{{selectAccessoryList.length}}</span> 个附件</p>
    <div style="clear: both"></div>
  </div>
</template>
<style>
  .dosion-accessory .ivu-modal-body {
    padding: 0px !important;
  }

  .dosion-accessory .ivu-card-extra {
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
  import {
    listFolder,
    saveFolder,
    delFolder,
    listFile,
    delFile
  } from '@/api/index'
  import appUtils from '@/utils/appUtils'

  export default {
    components: {
    },
    name: 'content-accessory',
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
          'type': '3',
          'app': config.appName,
        },
        uploadHeader: {'token': '' + dataUtils.getData(config.key.tokenKey) + ''},//文件上传请求头
        selectAccessoryList: [],//选中的附件
        isSelectAll: false,//是否全选
        query: {
          'name': null,
          'type': '3'
        }
      }
    },
    computed: {},
    watch: {
      selectAccessoryList () {
        if (this.selectAccessoryList == null || this.selectAccessoryList.length <= 0) {
          this.isSelectAll = false;
          return
        }
        if (this.selectAccessoryList.length == this.fileList.length) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
        }
      },
      show (val) {
        if (val) {
          this.selectAccessoryList = [];
          this.getForder()
        }
      },
      deep: true
    },
    methods: {
      //获取附件
      getAccessory (url, name, ext) {
        if (name.indexOf('.' + ext) != -1) {
          return config.fileUrl+'/file/' + url /*+'?name='+name+'.' + ext*/
        }
        return config.fileUrl+'/file/' + url
      },
      //上传地址
      uploadUrl () {
        return config.fileUrl + '/file/upload?type=3&folderId=' + this.selectFolder
      },
      //加载文件夹
      getForder () {
        this.loading = true;

        listFolder(3).then(res => {
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
            appUtils.showError(res.msg)
          }
        })
      },
      //获取文件
      getFile () {
        this.loading = true;

        /*siteFile.file.list(this.query, res => {
          this.loading = false;
          if (res.state) {
            this.fileList = res.data
          } else {
            this.$Message.error(res.msg)
          }
        })*/

        listFile(this.selectFolder , 3).then(res => {
          this.loading = false;
          if (res.state) {
            this.fileList = res.data
          } else {
            appUtils.showError(res.msg)
          }
        })
      },
      //添加文件夹
      addForder (forder) {
        var fordered = {
          pid: this.selectFolder,
          type: 3,
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
          content: '<p>确定删除分类？</p><p style="color: red">（删除后该分类附件自动移动到全部分类下）</p>',
          loading: true,
          onOk: () => {
            delFolder(forder.id).then(res => {
              this.loading = false;
              if (res.state) {
                if (res.state) {
                  this.getForder();
                  this.$Message.success(res.msg);
                  this.selectAccessoryList = []
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
            this.$Message.error(res.msg);
            this.loading = false
          }
        }
      },
      //树节点点击
      treeClick (data, node, el) {
        this.selectFolder = data.id;
        this.getFile()
      },
      //取消附件选择
      clearSelect () {
        this.selectAccessoryList = []
      },
      //批量删除
      batchDelete () {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除选择的附件？',
          loading: true,
          onOk: () => {
            delFile(this.selectAccessoryList).then(res => {
              this.loading = false;
              if (res.state) {
                if (res.state) {
                  this.$Message.success(res.msg);
                  this.getFile();
                  this.selectAccessoryList = []
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
        dataUtils.each(this.selectAccessoryList, (k, o) => {
          var arr = this.fileList.filter(t => t.id == o);
          if (arr != null && arr.length > 0) {
            selectImg.push(arr[0])
          }
        });
        this.$emit('select', selectImg);
        this.selectAccessoryList = []
      },
      //全选
      selectAll (val) {
        this.selectAccessoryList = [];
        dataUtils.each(this.fileList, (key, obj) => {
          this.selectAccessoryList.push(obj.id)
        })
      },
      editName (row) {
        let accessory = JSON.parse(JSON.stringify(row));
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: accessory.name,
                autofocus: true,
                placeholder: '请输入附件名称'
              },
              on: {
                input: (val) => {
                  accessory.name = val
                }
              }
            })
          },
          loading: true,
          onOk: () => {
            siteFile.file.save({'id': accessory.id, 'name': accessory.name}, res => {
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
      //删除附件
      delAccessory (row) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除附件？',
          loading: true,
          onOk: () => {
            siteFile.file.batchDelete({'ids': row.id}, res => {
              if (res.state) {
                this.$Message.success(res.msg);
                this.getFile();
                this.selectAccessoryList = []
              } else {
                this.$Message.error(res.msg)
              }
              this.$Modal.remove()
            })
          }
        })
      },
      download (row) {
        window.open(this.getAccessory(row.url,row.name,row.ext))
      }
    },
    mounted () {
      this.getForder()
    }
  }
</script>
