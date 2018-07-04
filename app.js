//app.js
App({
  onLaunch: function () {
    this.globalData.apiExt= wx.getExtConfigSync().data
  },
  globalData: {
    userInfo: null,
		classIdx:0,
    mobile:'',
    name:'',
    logo_url:'',
		good:[],
    address:1,
    info:'',
    userId:'',
    apiExt:'',
    apiKey:'',
    apiSecret:'',
    login:false,
    timeStamp:'',
    http:'https://wu-v11-develop.yiqixuan.com'
  }
})