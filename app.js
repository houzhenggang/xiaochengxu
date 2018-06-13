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

  checkLogin:function(){
    var nowTimeStamp = Date.parse(new Date());
    let that = this;
    if (that.globalData.timeStamp + 24 * 60 * 60 * 1000 > that.globalData.nowTimeStamp && that.globalData.apiExt && that.globalData.apiSecret && that.globalData.apiKey && that.globalData.userId) {
      return true
    }
    else {
      wx.login({
        success(code) {
          //向后台发起请求，传code
          wx.request({
            url: 'https://develop.yiqixuan.com/mpa/wechat/auth',
            method: 'POST',
            data: {
              code: code.code
            },
            header: {
              'Api-Ext': that.globalData.apiExt
            },
            success: function (res) {
              //保存响应头信息
              var apiKey = res.header["Api-Key"],
                apiSecret = res.header["Api-Secret"];
              //设置storage
              //获取时间戳保存storage
              let timestamp = Date.parse(new Date());
              wx.setStorage({
                key: 'apiKey',
                data: apiKey,
              })
              wx.setStorage({
                key: 'timestamp',
                data: timestamp,
              })
              wx.setStorage({
                key: 'apiSecret',
                data: apiSecret,
              })
              if (!res.data.user_id) {
                wx.navigateTo({
                  url: "/pages/regMob/regMob"
                })
              } else {
                that.globalData.userId = res.data_id
              }
            }
          })
        }
      })
    }
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
    http:'https://develop.yiqixuan.com'
  }
})