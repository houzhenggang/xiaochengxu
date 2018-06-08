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
    allOrder:'',
    image: 'http://image.yiqixuan.com/',
    apiSecret:'',
    apiKey:''
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
          "Api-Secret": that.data.apiSecret
        },
        success:function(data){
          if(data.data){
            that.setData({
              allOrder: data.data
            })
          }else{
            that.setData({
              allOrder:''
            })
          }
         
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

/*查看物流*/
  checkLogistics:function(event){
    var id = event.target.dataset.OrderID;
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
              "Api-Secret": that.data.apiSecret
            },
            success:function(data){
              var newArr = that.data.allOrder
              for (var i = 0; i < newArr.length;i++){
                if (idx == 207) {
                  /*取消订单*/
                  if (newArr[i].id === id) {
                    newArr.splice(i,1);
                    that.setData({
                      allOrder: newArr
                    })
                  }  
                }else{
                  /*确认收货*/
                  if (newArr[i].id === id) {
                    var num = 'allOrder[' + i + '].status'
                    that.setData({
                      [num]: idx
                    })
                  }  
                }
              }

              // that.data.allOrder.forEach(function(v,i){
              //   if (idx==207){
              //     /*取消订单*/
              //     if (v.id === id) {
              //       var newArr =that.data.allOrder;
              //       newArr.splice(i,1);
              //       that.setData({
              //         allOrder: newArr
              //       })
              //     }  
              //   }else{
              //     /*确认收货*/
              //     if (v.id === id) {
              //       var num = 'allOrder[' + i + '].status'
              //       that.setData({
              //         [num]: idx
              //       })
              //     }  
              //   }
              // })
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
        "Api-Secret": that.data.apiSecret
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
    var that = this;
    that.setData({
      index: 0
    })
    if (this.data.currentTab === e.target.dataset.current) {
        return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    console.log(this.data.currentTab);
    wx.request({
      url: app.globalData.http +'/mpa/order',
      data: {
        page: this.data.index,
        per_page: 20,
        status: this.data.currentTab
      },
      method: 'get',
      header: {
        "Api-Key": that.data.apiKey,
        "Api-Secret": that.data.apiSecret
      },
      dataType: 'json',
      success: function (data) {
        if(data.data){
          that.setData({
            allOrder: data.data
          })
        }else{
          that.setData({
            allOrder: ''
          })
        } 
      }
    })
  }
})  