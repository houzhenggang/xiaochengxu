//app.js
App({
  onLaunch: function () {
    var that=this
    wx.getExtConfig({
      success: function (res) {
        that.globalData.apiExt = res.extConfig.data
      }
    })
    that.globalData.apiKey = wx.getStorage('apiKey')
    that.globalData.apiSecret = wx.getStorage('apiSecret')
    that.globalData.timeStamp = wx.getStorage('timeStamp')
    that.globalData.info = wx.getStorage('huzan_avatarUrl')
    that.globalData.userId = wx.getStorage('userId')
  },
  globalData: {
    userInfo: null,
		classIdx:0,
    mobile:'',
		good:[],
    address:1,
    info:'',
    userId:'',
    apiExt:'',
    apiKey:'',
    apiSecret:'',
    timeStamp:'',
    http:'https://test.yiqixuan.com'
  }
})