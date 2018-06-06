// pages/address/address.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:[],
      // apiKey:'',
      // apiSecret:''
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var apiKey = wx.getStorageSync(apiKey)
    // var apiSecret = wx.getStorageSync(apiSecret)
      var that = this;
      // that.setData({
      //   apiKey: apiKey,
      //   apiSecret: apiSecret
      // })
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.http +'/mpa/address',
        method:'get',
        dataType:'json',
        // header: {
        //   "Api-Key":apiKey,
        //   "Api-Secret":apiSecret
        // },
        success:function(data){
         
          if(data.data.code==0){

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
    console.log(666)
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
                      // header: {
                      //   "Api-Key": that.data.apiKey,
                      //   "Api-Secret": that.data.apiSecret
                      // },
                      success: function (data) {
                      } 
                    })
                }
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
                // header: {
                //   "Api-Key": that.data.apiKey,
                //   "Api-Secret": that.data.apiSecret
                // },
                success: function (data) {
                }
              })
            }
          })
        }
      }
    })
  },

  deleteAddr:function(event){
    var that=this;
    var index= event.target.dataset.index;
    wx.request({
      url: app.globalData.http +'/mpa/address/' + that.data.address[index].id,
      method: 'delete',
      dataType: 'json',
      // header: {
      //   "Api-Key": that.data.apiKey,
      //   "Api-Secret": that.data.apiSecret
      // },
      success: function (data) {
        console.log(data)
        if (data.statusCode==200){
          that.data.address.splice(index,1)
          that.setData({
            address: that.data.address
          })
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000
          })
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
                    // header: {
                    //   "Api-Key": that.data.apiKey,
                    //   "Api-Secret": that.data.apiSecret
                    // },
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
                // header: {
                //   "Api-Key": that.data.apiKey,
                //   "Api-Secret": that.data.apiSecret
                // },
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
        // header: {
        //   "Api-Key": that.data.apiKey,
        //   "Api-Secret": that.data.apiSecret
        // },
        success: function (data) {
            if(key===1){
              that.data.address.forEach(function(v,i){
                  if(v.status===2){
                      nums = 'address[' + i + '].status'
                  }
              })
                that.setData({
                    [num]:2,
                    [nums]:1
                })

            }else{
              that.setData({
                [num]: 1
              })
            }
        }
      })
  }
})