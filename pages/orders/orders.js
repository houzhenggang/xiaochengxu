var app=getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    index:0,
    allOrder:1,
    image: 'http://image.yiqixuan.com/',
    apiSecret:'',
    apiKey:'',
    disabled:false
  },
  onLoad: function (options) {
    var that = this;
    var apiKey = wx.getStorageSync('apiKey')
    var apiSecret = wx.getStorageSync('apiSecret')
      that.setData({
        currentTab: options.curTab,
        apiKey:apiKey,
        apiSecret: apiSecret
      })
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.http +'/mpa/order',
        data:{
          page:this.data.index,
          per_page:15,
          status: this.data.currentTab
        },

        method:'get',
        dataType:'json',
        header: {
          "Api-Key": that.data.apiKey,
          "Api-Secret": that.data.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success:function(data){
            that.setData({
              allOrder: data.data
            })        
        },
        complete:function(){
          wx.hideLoading()
        }
      })
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /* 查询支付状态*/
  checkPay: function (id) {
    var that = this
    var t = 90;
    wx.showLoading({
      title: '加载中',
    })
    var time = setInterval(function () {
      t--
      if (t > 1) {
        wx.request({
          url: app.globalData.http + '/mpa/order/' + id + '/status',
          method: "get",
          dataType: 'json',
          header: {
            "Api-Key": that.data.apiKey,
            "Api-Secret": that.data.apiSecret,
            'Api-Ext': app.globalData.apiExt
          },
          success: function (data) {
            if (data.data.status == 205) {
              // console.log(666)             
              clearInterval(time)
              wx.hideLoading()
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000,
                complete: function () {
                  wx.navigateTo({
                    url: '/pages/orderDetail/orderDetail?id=' + id,
                  })
                }
              })

            }

          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({
              title: '支付失败',
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
  goDetail:function(e){
    console.log(e)
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + e.currentTarget.dataset.goods_id,
      })
  },
/*立即付款*/
  payMoney: function (event){
    var id = event.target.dataset.orderid
    var no = event.target.dataset.no
    var that=this
    wx.request({
      url: app.globalData.http + '/mpa/payment/payment',
      method: "post",
      dataType: 'json',
      data: {
        'order_id': id
      },
      header: {
        "Api-Key": that.data.apiKey,
        "Api-Secret": that.data.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success: function (res) {
        var time = res.data.timeStamp
        time = time.toString()
        wx.requestPayment({
          'timeStamp': time,
          'nonceStr': no,
          'package': 'prepay_id=' + res.data.result.prepay_id,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
            that.checkPay(id)
          },
          'fail': function () {
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

  },


/*查看物流*/
  checkLogistics:function(event){
    var id = event.target.dataset.orderid;
    wx.navigateTo({
      url: '/pages/logistics/logistics?id='+id
    })
  },

  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /*申请售后*/
  cancelOrder:function(event){
    var id = event.target.dataset.orderid;
    wx.navigateTo({
      url: '/pages/afterSale/afterSale?id='+id,
    })
  },
  /*取消订单 确认收货 */
  confirm: function(event){
    var that=this;
    var id = event.target.dataset.orderid;
    var idx = event.target.dataset.sure;
    var tips;
    if(idx==207){
        tips='确认要取消订单吗？'
    }else{
        tips='确认已经收到货了吗'
    }
    wx.showModal({
      title: '温馨提示',
      content: tips,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.http +'/mpa/order/' + id,
            data:{
              status:idx
            },
            method:'PUT',
            dataType:'json',
            header: {
              "Api-Key": that.data.apiKey,
              "Api-Secret": that.data.apiSecret,
              'Api-Ext': app.globalData.apiExt
            },
            success:function(data){
              if(data.statusCode==200){
                var newArr = that.data.allOrder
                for (var i = 0; i < newArr.length; i++) {
                  if (idx == 207) {
                    /*取消订单*/
                    if (newArr[i].id === id) {
                      newArr.splice(i, 1);
                      that.setData({
                        allOrder: newArr
                      })
                    }
                  } else {
                    /*确认收货*/
                    if (newArr[i].id === id) {
                      var num = 'allOrder[' + i + '].status'
                      that.setData({
                        [num]: idx
                      })
                    }
                  }
                }
              }else{
                  wx.showToast({
                    title: '网络错误',
                    icon:'icon'
                  })
              }
             
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },


  /*下拉加载*/
  getMore:function(){
    var that=this;
    var indexs=this.data.index;
    indexs++;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({ index: indexs});
    wx.request({
      url: app.globalData.http +'/mpa/order',
      data: {
        page: this.data.index,
        per_page: 15,
        status: this.data.currentTab
      },
      method: 'get',
      header: {
        "Api-Key": that.data.apiKey,
        "Api-Secret": that.data.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      dataType: 'json',
      success: function (data) {
        wx.hideLoading()
        var order = that.data.allOrder
        order=order.concat(data.data)
        that.setData({
          allOrder: order
        })
      }
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this
    console.log(e.target.dataset.current)
    that.setData({
      index: 0,
      currentTab: e.target.dataset.current
    })
    console.log(that.data.currentTab)    
    wx.request({
      url: app.globalData.http +'/mpa/order',
      data: {
        page: 0,
        per_page: 15,
        status: e.target.dataset.current
      },
      method: 'get',
      header: {
        "Api-Key": that.data.apiKey,
        "Api-Secret": that.data.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      dataType: 'json',
      success: function (data) {
          that.setData({
            allOrder: data.data
          })
      },
      fail:function(){
        that.setData({
          allOrder:''
        })
      }
    })
  }
})  