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
      // apiSecret:'',
      // apiKey:'',
      disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var data =app.globalData.good
    // var apiKey = wx.getStorageSync(apiKey)
    // var apiSecret = wx.getStorageSync(apiSecret)
    var sku_id={}
    var sku_idss=[]
    var that=this
    var sum=0
    console.log(data)
    for(var i=0;i<data.length;i++){
      sum += parseFloat(data[i].price) * parseFloat(data[i].count)
      sku_id[[data[i].goods_sku_id]]=data[i].count
      sku_idss.push(data[i].goods_sku_id)
    }
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
      // apiKey:apiKey,
      // apiSecret:apiSecret
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
    wx.showLoading({
      title: '加载中',
    })
    var time = setInterval(function () {
      t--
      if (t > 1) {
        wx.request({
          url: app.globalData.http+'/mpa/order/' + id + '/status',
          method: "get",
          dataType: 'json',
          header: {
            "Api-Key": app.globalData.apiKey,
            "Api-Secret": app.globalData.apiSecret,
            'Api-Ext': app.globalData.apiExt
          },
          success: function (data) {
            if(data.data.status==205){
              // console.log(666)             
              clearInterval(time)
              wx.hideLoading()
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000,
                complete:function(){
                  wx.navigateTo({
                    url: '/pages/orderDetail/orderDetail?id=' + id,
                  })
                }
              })
             
            }
           
          },
          fail:function(){
            wx.hideLoading()
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 500
            },function(){
              clearInterval(time)
              that.setData({
                disabled: false
              })
              wx.navigateTo({
                url: '/pages/orderDetail/orderDetail?id=' + id,
              })
            })
            
          }
        })
      } else {
        wx.hideLoading() 
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 500
        }, function () {
          clearInterval(time)
          that.setData({
            disabled: false
          })
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
    console.log(Object.prototype.toString.call(that.data.address))
    if (Object.prototype.toString.call(that.data.address) =='[object Number]'){
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      })
      return  false
    }
    that.setData({
      disabled:true
    })
    wx.request({
      url: app.globalData.http +'/mpa/order',
      method: "post",
      dataType: 'json',
      data: {
        goods: this.data.sku_ids,
        address_id:that.data.address.id,
      },
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
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
              "Api-Key": app.globalData.apiKey,
              "Api-Secret": app.globalData.apiSecret,
              'Api-Ext': app.globalData.apiExt
            },
            success:function(res){
              var time = res.data.timeStamp
              time=time.toString()
              wx.requestPayment({
                'timeStamp': time,
                'nonceStr': data.data.no,
                'package': 'prepay_id=' + res.data.result.prepay_id,
                'signType': 'MD5',
                'paySign': res.data.paySign,
                'success':function(res){
                  that.checkPay(data.data.id)
                },
                'fail':function(){
                  that.setData({
                    disabled: false
                  })
                }
              })
            },
            fail: function () {
              that.setData({
                disabled: false
              })
            }
          })
        } else if (data.statusCode === 500){
          wx.showToast({
            title: '下单失败',
            icon: 'none',
            duration: 1000
          })
           that.setData({
                disabled: false
              })
        }
      },
      fail:function(){
        that.setData({
          disabled: false
        })
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
          "Api-Key": app.globalData.apiKey,
          "Api-Secret": app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
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