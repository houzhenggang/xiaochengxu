var app=getApp()
//获取应用实例
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    count1:'',
    count2:'',
    count3:'',
    count4:'',
    apiExt:'',
    image: 'http://image.yiqixuan.com/'
  },
  onShow: function () {
    var that=this;
    var uerinfo = wx.getStorageSync("huzan_avatarUrl")
    if (uerinfo){
      that.setData({
        userInfo: uerinfo,
        hasUserInfo: true
      })
    }else{
      that.setData({
        hasUserInfo: false
      })
    }
    if (app.globalData.userId){
      wx.request({
        url: app.globalData.http + '/mpa/order/status/count',
        method: 'GET',
        dataType: 'json',
        header: {
          "Api-Key": app.globalData.apiKey,
          "Api-Secret": app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success: function (data) {
          var datas = data.data
          that.setData({
            count1: datas[0].count,
            count2: datas[1].count,
            count3: datas[2].count,
            count4: datas[3].count,
          })
        }
      })
    }
  },
  goAddress:function(){
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  // order: function (curTab){
  //   wx.navigateTo({
  //     url: '/pages/orders/orders?curTab=' + curTab
  //   })
  // },
  toOrder:function(e){
    wx.navigateTo({
      url: '/pages/orders/orders?curTab=' + e.currentTarget.dataset.curtab
    })
  },
  // getPhoneNumber:function(e){
  //     console.log(e)
  // },
  getInfo:function(e){
    console.log(e)
    var that=this;
    if (e.detail.userInfo){
      wx.login({
        success(code) {
          //获取用户信息，拿到userInfo
          var userInfo = e.detail.userInfo;
          //向后台发起请求，传code
          wx.request({
            url: app.globalData.http + '/mpa/wechat/auth',
            method: 'POST',
            header: {
              'Api-Ext': app.globalData.apiExt
            },
            data: {
              code: code.code
            },
            success: function (res) {
              var code = res.statusCode.toString()
              if (code == 500) {
                wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                  duration: 1000
                })
              } else if (code.indexOf('40') > -1) {
                var tip = res.data.message.toString()
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000
                })
              }
              else {
                //保存响应头信息
                if (res.header["api-key"] && res.header["api-secret"]) {
                  var apiKey = res.header["api-key"],
                    apiSecret = res.header["api-secret"];
                } else if (res.header["Api-Key"] && res.header["Api-Secret"]) {
                  var apiKey = res.header["Api-Key"],
                    apiSecret = res.header["Api-Secret"];
                }
                //设置storage
                //获取时间戳保存storage
                // let timestamp = Date.parse(new Date());
                app.globalData.apiKey = apiKey
                app.globalData.apiSecret = apiSecret
                that.setData({
                  userInfo: userInfo,
                  hasUserInfo: true
                })
                wx.setStorage({
                  key: 'huzan_avatarUrl',
                  data: userInfo,
                })
                wx.request({
                  url: app.globalData.http + '/mpa/wechat/' + res.data.id,
                  method: "PUT",
                  data: {
                    "nick_name": userInfo.nickName,
                    "avatar_url": userInfo.avatarUrl,
                    "gender": userInfo.gender,
                    "city": userInfo.city,
                    "province": userInfo.province,
                    "country": userInfo.country,
                    "language": userInfo.language
                  },
                  header: {
                    "Api-Key": app.globalData.apiKey,
                    "Api-Secret": app.globalData.apiSecret,
                    'Api-Ext': app.globalData.apiExt
                  },
                  complete(res) {
                  }
                })
                if (res.data.user_id) {
                  app.globalData.userId = true
                  // wx.setStorage({
                  //   key: 'userId',
                  //   data: true,
                  // })
                }
              }
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  }
})
