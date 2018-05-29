var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:1,
      dataList:[],
      totalMoney:'0.00',
      carriage:'0.00',
      totalOrder:'0.00',
      sku_ids:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var data =app.globalData.good
    var sku_id=[]
    var that=this
    var sum=0
    data.forEach(function(v,i){
      sum += parseFloat(v.price) * parseFloat(v.count)
      sku_id.push(v.id)
    })
    var apiKeys = wx.getStorageSync('Api-Key')
    var apiSecrets = wx.getStorageSync('Api-Secret')
    var address
    wx.request({
      url: 'http://192.168.10.99/mpa/address',
      method: 'get',
      dataType: 'json',
      header: {
        "Api-Key": apiKeys,
        "Api-Secret": apiSecrets
      },
      success: function (data) {
        if (data.data[0].status===2){
          that.setData({
            address: data.data[0]
          },function(){
            that.getCarriage()
          })

        } 
      }
    })

    this.setData({
      dataList: app.globalData.good,
      totalMoney: sum,
      totalOrder:sum,
      sku_ids: sku_id
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
    var that=this;
    if (app.globalData.address!==1){
      this.setData({
        address: app.globalData.address
      }, function () {
        that.getCarriage()
      })
    }   
  },
/*获取运费*/
  getCarriage:function(){
    var that=this;
      wx.request({
        url: 'http://192.168.10.158/mpa/order/express/free',
        method:"post",
        dataType:'json',
        data:{
          address_id:this.data.address.id,
          sku_ids: this.data.sku_ids
        },
        success:function(data){
            that.setData({
              carriage: data.data.free_express_price,
              totalOrder: parseFloat(data.data.free_express_price) + parseFloat(that.data.totalMoney)
            })
        } 
      })
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