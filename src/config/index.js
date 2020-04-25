/**
 * 配置文件
 */

var act = process.env.NODE_ENV

let base = ''
if (act == 'production') {
  //base = 'http://tianrenshijie.tasly.com'
  base = ''
} else {
  base = 'http://localhost:8080'
}

export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '毕业论文管理系统', //教学办公辅助
  /**
   * 应用名称
   */
  appName: 'cms',
  cookieExpires: 1,
  useI18n: false,
  baseUrl: base,
  fileUrl: base + '/paper',
  imgUrl: '',
  uploadUrl: base + '/ban-card/system/file',
  key: {
    tokenKey: 'TOKEN',
    accessToken: 'ACCESSTOKEN',
    userInfo: 'USERINFO'
  }
}
