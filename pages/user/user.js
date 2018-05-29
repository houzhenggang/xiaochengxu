
//获取应用实例
// var utils = require("../../utils/util");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    count1:'',
    count2: '',
    count3:'',
    count4:''
  },
  onLoad: function () {
    var that=this;
    
    var timestamp = wx.getStorageSync('timestamp')
    var nowTimeStamp = Date.parse(new Date());
    if (timestamp + 24 * 60 * 60 * 1000 > nowTimeStamp){
      var apiKeys = wx.getStorageSync('Api-Key')
      var apiSecrets = wx.getStorageSync('Api-Secret')
      var huzan_avatarUrl = wx.getStorageSync('huzan_avatarUrl')
      that.setData({
        userInfo: huzan_avatarUrl,
        hasUserInfo:true
      })
      wx.request({
        url: 'http://192.168.10.99/mpa/order/status/count',
        method: 'GET',
        dataType: 'json',
        // header: {
        //   "Api-Key": apiKeys,
        //   "Api-Secret": apiSecrets
        // },
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
  getInfo:function(){
    var that=this;
    wx.login({
      success(code) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //获取用户信息，拿到userInfo
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            var userInfo = res.userInfo;
            that.setData({
              userInfo: res.userInfo,
              hasUserInfo:true
            })
            
            //向后台发起请求，传code
            wx.request({
              url: 'http://192.168.10.99/mpa/wechat/auth',
              method: 'POST',
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
                  key: 'Api-Key',
                  data: apiKey
                })
                wx.setStorage({
                  key: 'timestamp',
                  data: timestamp,
                })
                wx.setStorage({
                  key: 'Api-Secret',
                  data: apiSecret
                })
                wx.setStorage({
                  key: 'huzan_avatarUrl',
                  data: userInfo,
                })
                if (res.data.user_id) {
                  wx.setStorage({
                    key: 'userId',
                    data: res.data.id,
                  })
                  wx.request({
                    url: 'http://192.168.10.99/mpa/wechat/' + res.data.id,
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
                      "Api-Key": apiKey,
                      "Api-Secret": apiSecret
                    },
                    success(res) {
                    },
                    fail(res) {
                    }
                  })
                } else {
                  wx.navigateTo({
                    url: "/pages/regMob/regMob"
                  })
                }
              }
            })
          }
        })

      }
    });
  }
})
