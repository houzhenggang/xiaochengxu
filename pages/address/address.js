// pages/address/address.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:[],
      image: 'http://image.yiqixuan.com/'
      // apiKey:'',
      // apiSecret:''
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.http +'/mpa/address',
        method:'get',
        dataType:'json',
        header: {
          "Api-Key": app.globalData.apiKey,
          "Api-Secret": app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success:function(data){
          var code = data.statusCode.toString()
          if(code==500|| code.indexOf('40')>-1){

          }else{
            that.setData({
              address: data.data
            })
          }
            
        },
        complete:function(){
          wx.hideLoading()
        }
      })
  },
  address:function(){
    var that=this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              wx.chooseAddress({
                success: function (res) {
                    wx.request({
                      url: app.globalData.http +'/mpa/address',
                      method: 'post',
                      dataType: 'json',
                      data:{
                        name: res.userName,
                        mobile:res.telNumber,
                        post_code: res.postalCode,
                        province: res.provinceName,
                        city: res.cityName,
                        county: res.countyName,
                        detail: res.detailInfo
                      },
                      header: {
                        "Api-Key": app.globalData.apiKey,
                        "Api-Secret": app.globalData.apiSecret,
                        'Api-Ext': app.globalData.apiExt
                      },
                      success: function (data) {
                        console.log(data)
                        var code = data.statusCode.toString()
                        if (code.indexOf('20') > -1) {
                        }else{
                          var tip =data.data.message.toString()
                          wx.showToast({
                            title: tip,
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      } 
                    })
                }
              })
            },
            fail:function(res){
              wx.openSetting({
                success: (res) => {}
              })
            }
          })
        }else{
          wx.chooseAddress({
            success: function (res) {
              wx.request({
                url: app.globalData.http +'/mpa/address',
                method: 'post',
                dataType: 'json',
                data: {
                  name: res.userName,
                  mobile: res.telNumber,
                  post_code: res.postalCode,
                  province: res.provinceName,
                  city: res.cityName,
                  county: res.countyName,
                  detail: res.detailInfo
                },
                header: {
                  "Api-Key": app.globalData.apiKey,
                  "Api-Secret": app.globalData.apiSecret,
                  'Api-Ext': app.globalData.apiExt
                },
                success: function (data) {
                  console.log(data)                  
                  var code = data.statusCode.toString()
                  if (code.indexOf('20') > -1) {
                  } else {
                    var tip = data.data.message.toString()
                    wx.showToast({
                      title: tip,
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            },
            fail:function(res){
              console.log(res)
            }
          })
        }
      },
      fail:function(res){
        wx.openSetting({
          success: (res) => {}
        })
      }
    })
  },

  deleteAddr:function(event){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定删除地址?',
      success: function (res) {
        if (res.confirm) {
          var index = event.target.dataset.index;
          wx.request({
            url: app.globalData.http + '/mpa/address/' + that.data.address[index].id,
            method: 'delete',
            dataType: 'json',
            header: {
              "Api-Key": app.globalData.apiKey,
              "Api-Secret": app.globalData.apiSecret,
              'Api-Ext': app.globalData.apiExt
            },
            success: function (data) {
              var code=data.statusCode.toString()
              if (code.indexOf('20')>-1) { 
                if (app.globalData.address!=1){
                  //判断删除的地址是否是app.globalData.address的地址
                  if (that.data.address[index].id == app.globalData.address.id) {
                    app.globalData.address = 1
                  }
                }
                that.data.address.splice(index, 1)
                that.setData({
                  address: that.data.address
                })
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 1000
                })
              }else{
                var tip = data.data.message.toString();
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  updateAddr: function (event){
    var that = this
    var index = event.target.dataset.index;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              wx.chooseAddress({
                success: function (res) {
                  wx.request({
                    url: app.globalData.http +'/mpa/address/'+that.data.address[index].id,
                    method: 'PUT',
                    dataType: 'json',
                    data: {
                      name: res.userName,
                      mobile: res.telNumber,
                      post_code: res.postalCode,
                      province: res.provinceName,
                      city: res.cityName,
                      county: res.countyName,
                      detail: res.detailInfo
                    },
                    header: {
                      "Api-Key": app.globalData.apiKey,
                      "Api-Secret": app.globalData.apiSecret,
                      'Api-Ext': app.globalData.apiExt
                    },
                    success: function (data) {
                      
                    }
                  })
                }
              })
            }
          })
        } else {
          wx.chooseAddress({
            success: function (res) {
              wx.request({
                url: app.globalData.http +'/mpa/address/' + that.data.address[index].id,
                method: 'PUT',
                dataType: 'json',
                data: {
                  name: res.userName,
                  mobile: res.telNumber,
                  post_code: res.postalCode,
                  province: res.provinceName,
                  city: res.cityName,
                  county: res.countyName,
                  detail: res.detailInfo
                },
                header: {
                  "Api-Key": app.globalData.apiKey,
                  "Api-Secret": app.globalData.apiSecret,
                  'Api-Ext': app.globalData.apiExt
                },
                success: function (data) {
                }
              })
            }
          })
        }
      }
    })
  },
  chooseAddress:function(event){
    var index = event.currentTarget.dataset.index
      app.globalData.address = this.data.address[index];
      wx.navigateBack({
        url:'/pages/surePay/surePay'
      })
  },
  setDefault:function(event){
      var that=this 
      var key=event.target.dataset.key
      var keys
      if (key===1){
        keys=2
      }else{
        keys=1
      }
      var index = event.target.dataset.index
      var nums 
      var num = 'address[' + index + '].status'
      wx.request({
        url: app.globalData.http +'/mpa/address/' + that.data.address[index].id,
        method: 'PUT',
        dataType: 'json',
        data: {
          status:keys
        },
        header: {
          "Api-Key": app.globalData.apiKey,
          "Api-Secret": app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success: function (data) {
          var code=data.statusCode.toString()
          if(code.indexOf('20')>-1){
            if (key === 1) {
              for (var i = 0; i < that.data.address.length; i++) {
                if (that.data.address[i].status === 2) {
                  nums = 'address[' + i + '].status'
                }
              }
              that.setData({
                [num]: 2,
                [nums]: 1
              })

            } else {
              that.setData({
                [num]: 1
              })
            }
          }else{
            wx.showToast({
              title: '设置失败',
              icon: 'none',
              duration: 1000,
            })
          }
           
        }
      })
  }
})