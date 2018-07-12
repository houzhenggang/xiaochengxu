//app.js
App({
  onLaunch: function () {
    var that=this
    this.globalData.apiExt = wx.getExtConfigSync().data
    wx.getStorage({
      key: 'apiKey',
      success: function (res) {
        that.globalData.apiKey = res.data
      }
    })
    wx.getStorage({
      key: 'apiSecret',
      success: function (res) {
        that.globalData.apiSecret = res.data
      }
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (res.data){
          that.globalData.userId = true
        }else{
          that.globalData.userId = false
        }
      }
    })
  },
  globalData: {
    userInfo: false,
		classIdx:0,
    mobile:'',
		good:[],
    address:1,
    info:'',
    keyword:'',
    userId:false,
    name:'',
    logo_url:'',
    apiExt:'',
    apiKey:'',
    apiSecret:'',
    login:false,
    http:'https://develop.yiqixuan.com'
  }
})