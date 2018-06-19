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
      image: 'http://image.yiqixuan.com/'
      // apiKey:'',
      // apiSecret:''
  },
  getSms:function(){
    var that=this;
    console.log('-------')
    console.log(app.globalData.apiKey)
    console.log(app.globalData.apiSecret)
    console.log(app.globalData.apiExt)
    if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.data.mobile)){
        console.log("send mobile to: " + this.data.mobile)
        wx.request({
          url: app.globalData.http +'/mpa/common/send_sms',
          method:'post',
          data:{
            mobile: this.data.mobile
          },
          header: {
            "Api-Key": app.globalData.apiKey,
            "Api-Secret": app.globalData.apiSecret,
            'Api-Ext': app.globalData.apiExt
          },
          dataType:'json',
          success:function(data){
            console.log('*****')            
            console.log(app.globalData.apiKey)
            console.log(app.globalData.apiSecret)
            console.log(app.globalData.apiExt)
            console.log('%%%%%')                       
            console.log(data)
            var code=parseInt(data.statusCode.toString());
            console.log(code)   
            if(code >= 200 && code < 300){
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
            else{
              var tip=data.data.message.toString()
              wx.showToast({
                title:tip,
                icon:'none',
                duration:1000
              })
            }
          },
          fail:function(res){
            console.log('接口报错：'+ res)
            console.log(app.globalData.apiKey)
            console.log(app.globalData.apiSecret)
            console.log(app.globalData.apiExt)
            // wx.showToast({
            //   title: '网络错误',
            //   icon: 'none',
            //   duration: 1000
            // })
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
      if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.data.mobile))){
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
              "Api-Key": app.globalData.apiKey,
              "Api-Secret": app.globalData.apiSecret,
              'Api-Ext': app.globalData.apiExt
            },
            success:function(data){
              console.log(data)
              var code = data.statusCode.toString()
              if(code==500){
                wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                  duration: 1000,
                })
              }
              else if (code.indexOf('40')>-1){
                var tip=data.data.message
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000,
                })
              }else{
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success',
                  duration: 1000, 
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            }
          })
      }
  }

})
