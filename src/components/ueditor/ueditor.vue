<template>
  <div class="ueditor">
    <script :id="editorId" name="content" type="text/plain">
    </script>

    <!-- 选择图片 start -->
    <Modal
      class="dosion-image"
      v-model="selectImgModal"
      title="图片管理"
      :loading="true"
      width="1100"
      height="600" footer-hide>
      <content-image @select="backData" :show="selectImgModal"></content-image>
    </Modal>
    <!-- 选择图片 end -->

    <!-- 选择音频 start -->
    <Modal
      class="dosion-audio"
      v-model="selectAudioModal"
      title="音频管理"
      :loading="true"
      width="1100"
      height="600" footer-hide>
      <content-audio @select="backAudioData" :show="selectAudioModal"></content-audio>
    </Modal>
    <!-- 选择音频 end -->

    <!-- 选择视频 start -->
    <Modal
      class="dosion-video"
      v-model="selectVideoModal"
      title="视频管理"
      :loading="true"
      width="1100"
      height="600" footer-hide>
      <content-video @select="backVideoData" :show="selectVideoModal"></content-video>
    </Modal>
    <!-- 选择视频 end -->

    <!-- 选择附件 start -->
    <Modal
      class="dosion-accessory"
      v-model="selectAccessoryModal"
      title="附件管理"
      :loading="true"
      width="1100"
      height="600" footer-hide>
      <content-accessory @select="backAccessoryData" :show="selectAccessoryModal"></content-accessory>
    </Modal>
    <!-- 选择附件 end -->
  </div>
</template>

<script>
  import dataUtils from '@/utils/dataUtils'
  import config from '@/config'
  import contentImage from '@/components/content-image/content-image.vue'
  import contentAudio from '@/components/content-audio/content-audio.vue'
  import contentVideo from '@/components/content-video/content-video.vue'
  import contentAccessory from '@/components/content-accessory/content-accessory.vue'

  export default {
    components: {
      contentImage,
      contentAudio,
      contentVideo,
      contentAccessory
    },
    name: 'UEditor',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        ue: null,
        selectImgModal: false,
        selectAudioModal: false,
        selectVideoModal: false,
        selectAccessoryModal: false,
      }
    },
    computed: {
      editorId() {
        return `editor${this._uid}`
      }
    },
    methods: {
      //获取文件
      getFile (url, name, ext) {
        if (name.indexOf('.' + ext) != -1) {
          return config.fileUrl+'/file/' + url
        }
        return config.fileUrl+'/file/' + url
      },
      backData (list) {
        if (list != null && list.length > 0) {
          dataUtils.each(list, (key, obj) => {
            this.ue.execCommand('insertimage', {
              src: this.getFile(obj.url, obj.name, obj.ext)
            })
          })
        }
        this.selectImgModal = false
      },
      backAudioData (list) {
        dataUtils.each(list, (key, obj) => {
          this.ue.execCommand('music', {
            width: 400,
            height: 95,
            align: 'center',
            url: this.getFile(obj.url, obj.name, obj.ext)
          });
          this.selectAudioModal = false
        })
      },
      backVideoData (list) {
        dataUtils.each(list, (key, obj) => {
          this.ue.execCommand('insertvideo', {
            width: 300,
            height: 300,
            url: this.getFile(obj.url, obj.name, obj.ext)
          });
          this.selectVideoModal = false
        })
      },
      backAccessoryData (list) {
        dataUtils.each(list, (key, obj) => {
          this.ue.execCommand('insertfile', {
            name:obj.name,
            url: this.getFile(obj.url, obj.name, obj.ext)
          });
          this.selectAccessoryModal = false
        })
      },
    },
    mounted() {
      var that = this;
      this.$nextTick(() => {
        this.ue = UE.getEditor(this.editorId);
        this.ue.addListener('uploadImage', function (t, arg) {
          that.selectImgModal = true
        });
        this.ue.addListener('uploadAudio', function (t, arg) {
          that.selectAudioModal = true
        });
        this.ue.addListener('uploadVideo', function (t, arg) {
          that.selectVideoModal = true
        });
        this.ue.addListener('uploadAccessory', function (t, arg) {
          that.selectAccessoryModal = true
        });
        this.ue.addListener('selectionchange', function (editor) {
          //alert("1")
          that.$emit('endedit', that.ue.getContent())
        })
      });
    },
    watch: {
      value(val) {

        this.ue.setContent(val == null ? '' : val)
      }
    }
  }
</script>

<style>

</style>
