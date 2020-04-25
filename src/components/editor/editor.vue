<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
  import Editor from 'wangeditor'
  import 'wangeditor/release/wangEditor.min.css'
  import { oneOf } from '@/libs/tools'
  import config from '@/config'

  export default {
    name: 'Editor',
    props: {
      value: {
        type: String,
        default: ''
      },
      html: {
        type: String,
        default: null
      },
      /**
       * 绑定的值的类型, enum: ['html', 'text']
       */
      valueType: {
        type: String,
        default: 'html',
        validator: (val) => {
          return oneOf(val, ['html', 'text'])
        }
      },
      /**
       * @description 设置change事件触发时间间隔
       */
      changeInterval: {
        type: Number,
        default: 200
      },
      /**
       * @description 是否开启本地存储
       */
      cache: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      editorId () {
        return `editor${this._uid}`
      }
    },
    mounted () {
      this.editor = new Editor(`#${this.editorId}`)
      this.editor.customConfig.onchange = (html) => {
        let text = this.editor.txt.text()
        this.$emit('input', this.valueType === 'html' ? html : text)
        this.$emit('on-change', html, text)
      }
      this.editor.customConfig.onchangeTimeout = this.changeInterval
      this.editor.customConfig.uploadImgServer = config.uploadUrl
      this.editor.customConfig.uploadVideoServer = config.uploadUrl
      this.editor.customConfig.uploadFileName = 'file'
      this.editor.customConfig.uploadImgTimeout = 6000

      this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          var url = null
          if (result.code == 0) {
            if (result.state) {
              url = config.imgUrl + result.data.url
            }else{
              this.$Message.error(result.msg)
            }
          } else {
            this.$Message.error(result.msg)
          }
          insertImg(url)
        }
      },
        // create这个方法一定要在所有配置项之后调用
        this.editor.create()
        this.editor.txt.html(this.html)
    },
    watch:{
      html(val){
        this.editor.txt.html(val==null?'':val)
      }
    }
  }
</script>

<style>

</style>
