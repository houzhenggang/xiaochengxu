var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id=options.id;
    // var apiKeys = wx.getStorageSync('Api-Key');
    // var apiSecrets = wx.getStorageSync('Api-Secret')
    wx.request({
      url: app.globalData.http +'/mpa/order/'+id+'/express',
      method:'GET',
      dataType:'json',
      header: {
        'Api-Key': app.globalData.apiKey,
        'Api-Secret': app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success:function(data){
        var datas=data.data;
        that.setData({
          list:datas
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})