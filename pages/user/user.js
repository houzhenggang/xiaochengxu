//index.js
//获取应用实例
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }),
    wx.getSetting({
      success:res=> {
          if(!res.authSetting['scope.userInfo']){
          wx.authorize({
            scope: 'scope.userInfo',
            success:()=> {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success:res=>{
                    this.setData({
                      userInfo:res.userInfo
                    })
                } 
              })
            }
          })
        }else{
          wx.getUserInfo({
              success:res=>{
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
