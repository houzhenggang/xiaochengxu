var app=getApp()
//获取应用实例
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    count1:'',
    count2: '',
    count3:'',
    count4:'',
    apiExt: '',
    // apiKey: "",
    // apiSecret: "",
    // apiExt:''
  },
  onLoad: function () {
    var that=this;
    // var timeStamp = wx.getStorageSync('timeStamp')
    // var nowTimeStamp = Date.parse(new Date());
    // var apiKey = wx.getStorageSync('apiKey')
    // var apiSecret = wx.getStorageSync('apiSecret')
    // var apiExt = wx.getStorageSync('apiExt')
    // var info = wx.getStorageSync('huzan_avatarUrl')
    // var userId = wx.getStorageSync('userId')
    // that.setData({
    //   apiExt: apiExt
    // })

    if (app.globalData.timeStamp + 24 * 60 * 60 * 1000 > nowTimeStamp && app.globalData.apiSecret && app.globalData.apiKey){
      that.setData({
        userInfo: app.globalData.info,
        hasUserInfo: true
      })
      wx.request({
        url: app.globalData.http+'/mpa/order/status/count',
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
  toOrder:function(e){
    // wx.navigateTo({
    //   url: '/pages/orders/orders?curTab=' + e.currentTarget.dataset.curTab
    // })
    var login = util.checkLogin()
    if(login){
      wx.navigateTo({
        url: '/pages/orders/orders?curTab=' + e.currentTarget.dataset.curTab
      })
    }
  },
  getInfo:function(e){
    var that=this;
    wx.login({
      success(code) {
        //获取用户信息，拿到userInfo
        var userInfo = e.detail.userInfo;
        that.setData({
          userInfo: userInfo,
          hasUserInfo:true
        })
        wx.setStorage({
          key: 'huzan_avatarUrl',
          data: userInfo,
        })     
        //向后台发起请求，传code
        wx.request({
          url: app.globalData.http +'/mpa/wechat/auth',
          method: 'POST',
          header:{
            'Api-Ext': app.globalData.apiExt
          },
          data: {
            code: code.code
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
              key: 'timeStamp',
              data: timestamp,
            })
            
            wx.setStorage({
              key: 'apiSecret',
              data: apiSecret,
            })
          

            if (!res.data.user_id) {
              wx.setStorage({
                key: 'userId',
                data: res.data.user_id,
              })

              wx.request({
                url: app.globalData.http +'/mpa/wechat/' + res.data.id,
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
                success(res) {
                  wx.navigateTo({
                    url: "/pages/regMob/regMob"
                  })
                },
                fail(res) {
                }
              })
            }
          }
        })
      },
      fail:function(res){
          console.log(res)
      }
    })
  }
})
