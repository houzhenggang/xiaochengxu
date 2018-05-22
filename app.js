//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
		//获取用户信息
		wx.login({
			success(code) {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				console.log(code)
				//获取用户信息，拿到userInfo
				wx.getUserInfo({
					withCredentials: true,
					success: function (res) {
						console.log(res);
						var userInfo = res.userInfo;
						//向后台发起请求，传code
						wx.request({
							url: 'http://192.168.10.99/mpa/wechat/auth',
							method: 'POST',
							data: {
								code: code.code
							},
							success: function (res) {
								console.log(222222)
								console.log(res)
								//保存响应头信息
								var apiKey = res.header["Api-Key"],
									apiSecret = res.header["Api-Secret"];
								//设置storage
								//获取时间戳保存storage
								let timestamp = Date.parse(new Date());
								wx.setStorage({
									key: 'Api-Key',
									data: apiKey
								})
								wx.setStorage({
									key: 'timestamp',
									data: timestamp,
								})
								wx.setStorage({
									key: 'Api-Secret',
									data: apiSecret
								})
								wx.setStorage({
									key: 'user-id',
									data: res.data.id,
								})
								wx.request({
									url: 'http://192.168.10.99/mpa/wechat/' + res.data.id,
									method: "PUT",
									data: {
										"nick_name": userInfo.nickName,
										"avatar_url": userInfo.avatarUrl,
										"gender": userInfo.gender,
										"city": userInfo.city,
										"province": userInfo.province,
										"country": userInfo.country,
										"language": userInfo.language
									},
									header: {
										"Api-Key": apiKey,
										"Api-Secret": apiSecret
									},
									success(res) {
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
			success: res => {
				if (!res.authSetting['scope.userInfo']) {
					console.log(1111)
					wx.authorize({
						scope: 'scope.userInfo',
						success: () => {
							// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
							wx.getUserInfo({
								success: res => {
									console.log(res)
									this.setData({
										userInfo: res.userInfo
									})
								}
							})
						}
					})
				} else {
					wx.getUserInfo({
						success: res => {
							this.setData({
								userInfo: res.userInfo
							})
							console.log(this.data.userInfo)
						}
					})
				}
			}
		})
  },
  globalData: {
    userInfo: null,
		url: "http://192.168.20.140",
		classIdx:0
  }
})