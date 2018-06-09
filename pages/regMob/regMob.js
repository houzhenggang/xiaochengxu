//index.js
//获取应用实例

const app = getApp()
Page({
  data: {
      check:0,
      mobile:'',
      text:'获取验证码',
      sms:'',
      disabled:false,
      apiKey:'',
      apiSecret:''
  },
  onLoad: function () {
    var apiKeys = wx.getStorageSync('Api-Key');
    var apiSecrets = wx.getStorageSync('Api-Secret')
    this.setData({
      apiKey: apiKeys,
      apiSecret: apiSecrets
    })
  },
  getSms:function(){
    var that=this;
    if (/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(this.data.mobile)){
        wx.request({
          url: app.globalData.http +'/mpa/common/send_sms',
          method:'post',
          data:{
            mobile: this.data.mobile
          },
          header: {
            "Api-Key": that.data.apiKey,
            "Api-Secret": that.data.apiSecret,
            'Api-Ext': app.globalData.apiExt
          },
          dataType:'json',
          success:function(data){
             var t=60;
             that.setData({
               disabled:true
             })
               
             var time=setInterval(function(){
               if(t>1){
                 t--;
                 that.setData({
                   text: '已发送(' + t + 's)'
                 })
               }else{
                 clearInterval(time)
                 that.setData({
                   disabled: false,
                   text:'获取验证码'
                 })  
               }
                
             },1000)
          }
        })
    }else{
      wx.showToast({
        title: '请输入11位数字',
        icon: 'none',
        duration: 2000
      })
    }
  },
  inputMob:function(event){
      var that=this;
      that.setData({
        mobile:event.detail.value
      })
  },
  inputSms:function(event){
    var that = this;
    if (event.detail.value.length > 0 && event.detail.value.length<7){
      that.setData({
        check: 1
      })
    }else{
      that.setData({
        check: 0
      })
    }
    that.setData({
      sms: event.detail.value,
    })
  },
  bindMob:function(){
      var that=this;
      if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(this.data.mobile))){
        wx.showToast({
          title: '请正确输入11位数字',
          icon: 'none',
          duration: 2000
        })
      } else if (this.data.sms.length!==6){
        wx.showToast({
          title: '请正确输入6位验证码',
          icon: 'none',
          duration: 2000
        })
      }else{
          wx.request({
            url: app.globalData.http +'/mpa/user/login',
            method:'post',
            data:{
              mobile: this.data.mobile,
              vcode : this.data.sms
            },
            dataType:'json',
            header: {
              "Api-Key": that.data.apiKey,
              "Api-Secret": that.data.apiSecret,
              'Api-Ext': app.globalData.apiExt
            },
            success:function(data){
              if(data.status==201){
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success',
                  duration: 1000,
                  success:function(){
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }else{
                wx.showToast({
                  title: '绑定失败',
                  icon: 'none',
                  duration: 1000,
                  success: function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
              
            }
          })
      }
  }

})
