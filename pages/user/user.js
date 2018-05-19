//index.js
//获取应用实例
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad: function () {
    wx.login({
      success(code){
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
				console.log(code)
				wx.getUserInfo({
					withCredentials: true,
					success:function(res){
						console.log(res);
						var userInfo = res.userInfo;
						wx.request({
							url: 'http://192.168.10.99/mpa/wechat/auth',
							method: 'POST',
							data: {
								code: code.code
							},
							success: function (res) {
								console.log(222222)
								console.log(res)
								var apiKey = res.header["Api-Key"],
									apiSecret = res.header["Api-Secret"];
									wx.request({
										url: 'http://192.168.10.99/mpa/wechat/'+res.data.id,
										method:"PUT",
										data:{
											"nick_name":userInfo.nickName,
											"avatar_url":userInfo.avatarUrl,
											"gender":userInfo.gender,
											"city":userInfo.city,
											"province":userInfo.province,
											"country":userInfo.country,
											"language":userInfo.language
										},
										header:{
											"Api-Key":apiKey,
											"Api-Secret":apiSecret
										},
										success(res){
											console.log("成功！！！")
											console.log(res)
										}
									})
							}
						})
					}
				})
				
      }
    });
    wx.getSetting({
      success:res=> {
				console.log(res)
          if(!res.authSetting['scope.userInfo']){
						console.log(1111)
          wx.authorize({
            scope: 'scope.userInfo',
            success:()=> {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success:res=>{
									console.log(res)
                    this.setData({
                      userInfo:res.userInfo
                    })
                } 
              })
            }
          })
        }else{
          wx.getUserInfo({
              success:res=>{
                this.setData({
                  userInfo: res.userInfo
                })
								console.log(this.data.userInfo)
              }
          })
        }
      }
    })
  }
})
