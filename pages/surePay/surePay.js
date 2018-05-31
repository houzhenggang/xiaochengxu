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
      sku_ids: {},
      sku_idd:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var data =app.globalData.good
    var sku_id={}
    var sku_idss=[]
    var that=this
    var sum=0
    data.forEach(function(v,i){
      sum += parseFloat(v.price) * parseFloat(v.count)
      var obj={
        [v.goods_sku_id]:v.count
      }
      Object.assign(sku_id,obj)
      sku_idss.push(v.goods_sku_id)
    })
    that.setData({
      sku_ids: sku_id,
      sku_idd: sku_idss
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

    that.setData({
      dataList: app.globalData.good,
      totalMoney: sum,
      totalOrder:sum,
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

  // 立即支付
  confirm:function(){
    wx.request({
      url: 'http://172.81.209.201:8303/mpa/order',
      method: "post",
      dataType: 'json',
      data: {
        goods: this.data.sku_ids,
        address_id:1,
        remarks:""
      },
      success: function (data) {
        console.log(data)
        if (data.statusCode===200){
          wx.request({
            url: 'http://172.81.209.201:8303/mpa/payment/' + data.data.order.id,
            method: "put",
            dataType: 'json',
            success:function(res){
              var time = res.data.timeStamp
              time=time.toString()
              wx.requestPayment({
                'timeStamp': time,
                'nonceStr': data.data.order.no,
                'package': 'prepay_id=' + res.data.result.prepay_id,
                'signType': 'MD5',
                'paySign': res.data.paySign,
                'success': function (data) {
                  console.log(data)
                }
              })
            } 
          })
        }
      }
    })
  },
/*获取运费*/
  getCarriage:function(){
    var that=this;
      wx.request({
        url: 'http://172.81.209.201:8303/mpa/order/express/fee',
        method:"post",
        dataType:'json',
        data:{
          address_id:this.data.address.id,
          sku_ids: this.data.sku_idd
        },
        success:function(data){
            that.setData({
              carriage: data.data.free_express_price,
              totalOrder: parseFloat(data.data.free_express_price) + parseFloat(that.data.totalMoney)
            })
        } 
      })
  }
})