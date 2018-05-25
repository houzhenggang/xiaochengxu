// pages/search/search.js
const app = getApp();
const requestUrl = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
		produList: [{
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00"
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00"
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00"
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00"
		}],
		//排序方式
		rank: 0,
		//flag控制上下箭头类名
		flag: 0
  },
	//商品点击
	goDetail(e){
		wx.navigateTo({
			url: '/pages/detail/detail',
		})
	},
	//排序方式点击
	bindRank(e){
		//当前所点击排序方式
		var currIndex = e.currentTarget.dataset.id;
		var flag = this.data.flag;
		//判断价格排序方式
		if(currIndex == 2){
			if(flag == 0 || flag == 2){
				flag = 1
				//按价格降序
				wx.request({
					url: requestUrl + '/mpa/goods/search',
					data: {///////////////////////////////////////////////////////id需改动
						category_id: 9,
						order_by: "price desc"
					},
					success(res) {
						console.log(44444444)
						console.log(res)
						that.setData({
							produList: res.data
						})
					}
				})
			}else if(flag == 1){
				flag = 2
				//按价格升序
				wx.request({
					url: requestUrl + '/mpa/goods/search',
					data: {///////////////////////////////////////////////////////id需改动
						category_id: 9,
						order_by: "price asc"
					},
					success(res) {
						console.log(44444444)
						console.log(res)
						that.setData({
							produList: res.data
						})
					}
				})
			}
		}else if(currIndex == 1){
			//按销量排序
			wx.request({
				url: requestUrl + '/mpa/goods/search',
				data: {///////////////////////////////////////////////////////id需改动
					category_id: 9,
					order_by:"sales_count"
				},
				success(res) {
					console.log(2222222222)
					console.log(res)
					that.setData({
						produList: res.data
					})
				}
			})
			flag = 0
		}else{
			//按新品排序
			wx.request({
				url: requestUrl + '/mpa/goods/search',
				data: {///////////////////////////////////////////////////////id需改动
					category_id: 9,
					order_by: "created_at"
				},
				success(res) {
					console.log(1111111)
					console.log(res)
					that.setData({
						produList: res.data
					})
				}
			})
			flag = 0
		}
		//存入data
		this.setData({
			rank:currIndex,
			flag:flag
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log(options)
		let taht = this;
		wx.setNavigationBarTitle({
			title: options.name,
		})
		wx.request({
			url: requestUrl + '/mpa/goods/search',
			data: {///////////////////////////////////////////////////////id需改动
				category_id:9,
			},
			success(res){
				console.log(1111111)
				console.log(res)
				that.setData({
					produList: res.data
				})
			}
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})