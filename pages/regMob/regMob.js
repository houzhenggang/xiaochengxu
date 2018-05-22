//index.js
//获取应用实例
Page({
  data: {
      check:0
  },
  onLoad: function () {
    wx.login({
      success: res => {
      }
    }),
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success: () => {
                wx.getUserInfo({
                  success: res => {
                    this.setData({
                      userInfo: res.userInfo
                    })
                  }
                })
              }
            })
          } else {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  userInfo: res.userInfo
                })
              }
            })
          }
        }
      })
  }
})
