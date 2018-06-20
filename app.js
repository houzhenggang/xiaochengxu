//app.js
App({
  onLaunch: function () {
    this.globalData.apiExt= wx.getExtConfigSync().data
  },
  checkLogin:function(callback){
    let that = this;
      wx.login({
        success(code) {
          //向后台发起请求，传code
          wx.request({
            url: 'https://api.yiqixuan.com/mpa/wechat/auth',
            method: 'POST',
            data: {
              code: code.code
            },
            header: {
              'Api-Ext': that.globalData.apiExt
            },
            success: function (res) {
              //保存响应头信息
              console.log(res.header)
              var code = res.statusCode.toString()
              if (code.indexOf('40') > -1 || code == 500){
                var tip=res.data.message.toString()
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000
                })
              }
              else{
                if (res.header["api-key"] && res.header["api-secret"] ){
                  var apiKey = res.header["api-key"],
                    apiSecret = res.header["api-secret"];
                } else if (res.header["Api-Key"] && res.header["Api-Secret"]){
                  var apiKey = res.header["Api-Key"],
                    apiSecret = res.header["Api-Secret"];
                }
                //设置storage
                //获取时间戳保存storage
                // let timestamp = Date.parse(new Date());
                that.globalData.apiKey = apiKey
                that.globalData.apiSecret = apiSecret
                that.globalData.info = wx.getStorageSync('huzan_avatarUrl')
                if (!res.data.user_id) {
                  wx.navigateTo({
                    url: "/pages/regMob/regMob"
                  })
                } else {
                  that.globalData.login = true
                  callback
                }
              }
            },
            fail:function(res){
              console.log('接口报错')
              console.log(res)
              console.log(that.globalData.apiKey)
              console.log(that.globalData.apiSecret)
              console.log(that.globalData.apiExt)
            }
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
    // }
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
    login:false,
    timeStamp:'',
    http:'https://api.yiqixuan.com'
  }
})