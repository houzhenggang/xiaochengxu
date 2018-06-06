var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:'',
      id:'',
      show:true,
      apiKey:'',
      image: 'http://image.yiqixuan.com/',
      apiSecret:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      var id=options.id;
      var apiKey = wx.getStorageSync(apiKey)
      var apiSecret = wx.getStorageSync(apiSecret)
      that.setData({
        id:id,
        apiKey: apiKey,
        apiSecret: apiSecret
      })
      wx.request({
        url: app.globalData.http +'/mpa/order/' + id,
        method:'GET',
        dataType:'json',
        header: {
          "Api-Key": that.data.apiKey,
          "Api-Secret": that.data.apiSecret
        },
        success:function(data){
          that.setData({
            info:data.data
          })
        }
      })
  },
  /*关闭联系商家*/
  close:function(){
    this.setData({
      show: true
    })
  },
/*联系商家*/
  contacts:function(){

    this.setData({
      show:false
    })
  },
  /*查看物流*/
  checkLogistics: function () {
    var that=this;
    wx.navigateTo({
      url: '/pages/logistics/logistics?id=' + that.data.id
    })
  },
  /*申请售后*/
  cancelOrder: function () {
    var that=this;
    wx.navigateTo({
      url: '/pages/afterSale/afterSale?id=' + that.data.id
    })
  },
  /*取消订单 确认收货 */
  confirm: function (event) {
    var that = this;
    var idx = event.target.dataset.sure;
    var tips;
    if (idx == 207) {
      tips = '确认要取消订单吗？'
    } else {
      tips = '确认已经收到货了吗'
    }
    wx.showModal({
      title: '温馨提示',
      content: tips,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.http +'/mpa/order/' + id,
            data: {
              status: idx
            },
            header: {
              "Api-Key": that.data.apiKey,
              "Api-Secret": that.data.apiSecret
            },
            method: 'PUT',
            dataType: 'json',
            success: function (data) {
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  callPhone:function(){
    this.setData({
      show:true
    })
    wx.makePhoneCall({
      phoneNumber: app.globalData.mobile
    })
  }
})