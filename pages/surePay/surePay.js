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
      image: 'http://image.yiqixuan.com/',
      sku_idd:[],
      apiSecret:'',
      apiKey:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var data =app.globalData.good
    console.log(app.globalData.good)
    var apiKey = wx.getStorageSync(apiKey)
    var apiSecret = wx.getStorageSync(apiSecret)
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
    console.log(sku_id)
    that.setData({
      sku_ids: sku_id,
      sku_idd: sku_idss
    })

    wx.request({
      url: app.globalData.http +'/mpa/address',
      method: 'get',
      dataType: 'json',
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret
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
      apiKey:apiKey,
      apiSecret:apiSecret
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
  /* 查询支付状态*/
  checkPay: function (id) {
    var that=this
    var t = 90;
    var time = setInterval(function () {
      t--
      if (t > 1) {
        wx.request({
          url: app.globalData.http+'/mpa/order/' + id + '/status',
          method: "get",
          dataType: 'json',
          header: {
            "Api-Key": that.data.apiKey,
            "Api-Secret": that.data.apiSecret
          },
          success: function (data) {
            if(data.data.status==205){
              clearInterval(time)
              wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 500
              },function(){
                wx.navigateTo({
                  url: '/pages/orderDetail/orderDetail?id=' + id,
                })
              })
             
            }
           
          },
          fail:function(){
            
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 500
            },function(){
              clearInterval(time)
              wx.navigateTo({
                url: '/pages/orderDetail/orderDetail?id=' + id,
              })
            })
            
          }
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 500
        }, function () {
          clearInterval(time)
          wx.navigateTo({
            url: '/pages/orderDetail/orderDetail?id=' + id,
          })
        })
      }
    }, 1000)
  },
  // 立即支付
  confirm:function(){
    var that=this
    wx.request({
      url: app.globalData.http +'/mpa/order',
      method: "post",
      dataType: 'json',
      data: {
        goods: this.data.sku_ids,
        address_id:1,
        remarks:""
      },
      header: {
        "Api-Key": that.data.apiKey,
        "Api-Secret": that.data.apiSecret
      },
      success: function (data) {
        if (data.statusCode===200){
          wx.request({
            url: app.globalData.http +'/mpa/payment/payment',
            method: "post",
            dataType: 'json',
            data:{
              order_id: data.data.id
            },
            header: {
              "Api-Key": that.data.apiKey,
              "Api-Secret": that.data.apiSecret
            },
            success:function(res){
              var time = res.data.timeStamp
              time=time.toString()
              console.log(res)
              wx.requestPayment({
                'timeStamp': time,
                'nonceStr': data.data.no,
                'package': 'prepay_id=' + res.data.result.prepay_id,
                'signType': 'MD5',
                'paySign': res.data.paySign,
                'complete':function(res){
                  console.log(res)
                  wx.showLoading({
                    title: '加载中',
                  })
                  that.checkPay(data.data.id)
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
        url: app.globalData.http +'/mpa/order/express/fee',
        method:"post",
        dataType:'json',
        data:{
          address_id:this.data.address.id,
          sku_ids: this.data.sku_idd
        },
        header: {
          "Api-Key": that.data.apiKey,
          "Api-Secret": that.data.apiSecret
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