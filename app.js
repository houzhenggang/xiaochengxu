//app.js
App({
  onLaunch: function () {
    var that=this
    this.globalData.apiExt = wx.getExtConfigSync().data
    wx.login({
      success(code) {
        //向后台发起请求，传code
        wx.request({
          url: that.globalData.http + '/mpa/wechat/auth',
          method: 'POST',
          data: {
            code: code.code
          },
          header: {
            'Api-Ext': that.globalData.apiExt
          },
          success: function (res) {
            //保存响应头信息
            var code = res.statusCode.toString()
            if (code>=200&& code<300) {
              if (res.header["api-key"] && res.header["api-secret"]) {
                var apiKey = res.header["api-key"],
                  apiSecret = res.header["api-secret"];
              } else if (res.header["Api-Key"] && res.header["Api-Secret"]) {
                var apiKey = res.header["Api-Key"],
                  apiSecret = res.header["Api-Secret"];
              }
              that.globalData.apiKey = apiKey
              that.globalData.apiSecret = apiSecret
              if (res.data.user_id){
                that.globalData.userId=true
              }
            }
          },
          fail: function (res) {
            console.log(res)
            console.log(that.globalData.apiKey)
            console.log(that.globalData.apiSecret)
            console.log(that.globalData.apiExt)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  globalData: {
    userInfo: null,
		classIdx:0,
    mobile:'',
		good:[],
    address:1,
    info:'',
    keyword:'',
    userId:false,
    apiExt:'',
    apiKey:'',
    apiSecret:'',
    login:false,
    timeStamp:'',
    http:'https://develop.yiqixuan.com'
  }
})