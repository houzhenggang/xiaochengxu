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
      local:[],
      cart_item_ids:[],
      // apiSecret:'',
      // apiKey:'',
      disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var data =app.globalData.good
    // var local = app.globalData.localArr
    // app.globalData.localArr=[]
    // var total = data.concat(local)

    var sku_id={}
    var sku_idss = [], cart_item_ids=[]
    var that=this
    var sum=0
    for(var i=0;i<data.length;i++){
      sum += parseFloat(data[i].price) * parseFloat(data[i].count)
      sku_id[[data[i].goods_sku_id]]=data[i].count
      sku_idss.push(data[i].goods_sku_id)
      cart_item_ids.push(data[i].id)
    }

    // for(var j=0;j<local.length;j++){
    //   sum += parseFloat(local[j].price) * parseFloat(local[j].count)
    //   sku_id[[local[j].goods_sku_id]] = local[j].count
    //   sku_idss.push(local[j].goods_sku_id)
    // }

    that.setData({
      sku_ids: sku_id,
      sku_idd: sku_idss,
      cart_item_ids: cart_item_ids
      // local: local
    })
    wx.request({
      url: app.globalData.http +'/mpa/address',
      method: 'get',
      dataType: 'json',
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success: function (data) {
        var code=data.statusCode.toString()
        if (code.indexOf('20') > -1){
          if (data.data.length > 0){
            if (data.data[0].status === 2 && data.data.length > 0) {
              that.setData({
                address: data.data[0]
              }, function () {
                that.getCarriage()
              })

            } 
          }
        } else{
            var tip=data.data.message.toString();
            wx.showToast({
              title: tip,
              icon:'none',
              duration:2000
            })
        }
      }
    })

    that.setData({
      dataList: data,
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
            var code=data.statusCode.toString()
            if(code==205){          
              clearInterval(time)
              wx.hideLoading()
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function(){
                  wx.navigateTo({
                    url: '/pages/orderDetail/orderDetail?id=' + id,
                  })
              },1000)
            }
          },
          fail:function(res){
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000
            })
            clearInterval(time)
            that.setData({
              disabled: false
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/orderDetail/orderDetail?id=' + id,
              })
            }, 1000)        
          }
        })
      } else {
        wx.hideLoading() 
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 1000
        })
        clearInterval(time)
        that.setData({
          disabled: false
        })
      }
    }, 1000)
  },
  // 立即支付
  confirm:function(){
    var that=this
    // console.log(Object.prototype.toString.call(that.data.address))
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
        goods: that.data.sku_ids,
        address_id:that.data.address.id,
        remarks:'',
        cart_item_ids: that.data.cart_item_ids
      },
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success: function (data) {
        var code = data.statusCode.toString()
        if (code >= 200 && code<300 ){
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
              var codes=res.statusCode.toString()
              if (codes >= 200 && codes <300 ){
                var time = res.data.timeStamp.toString()
                wx.requestPayment({
                  'timeStamp': time,
                  'nonceStr': data.data.no,
                  'package': 'prepay_id=' + res.data.result.prepay_id,
                  'signType': 'MD5',
                  'paySign': res.data.paySign,
                  'success': function (datas) {
                    that.checkPay(data.data.id)
                  },
                  'fail': function (datas) {
                    console.log(datas)
                    that.setData({
                      disabled: false
                    })
                  }
                })
              } 
              else{
                console.log('0000')
                var tip = res.data.message.toString()
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  disabled: false
                })
              }             
            },
            fail: function (res) {
              console.log(res)
              wx.showToast({
                title: '下单失败',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                disabled: false
              })
            }
          })
        }else{
          console.log('333')
          var tip = data.data.message.toString()
          wx.showToast({
            title: tip,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            disabled: false
          })
        }
      },
      fail:function(res){
        console.log(res)
        wx.showToast({
          title: '下单失败',
          icon: 'none',
          duration: 1000
        })
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