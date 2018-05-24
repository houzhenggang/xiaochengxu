//app.js
App({
  onLaunch: function () {
		let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
		url: "http://192.168.20.140",
		classIdx:0,
		good:{}
  }
})