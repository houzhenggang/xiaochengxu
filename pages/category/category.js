// pages/category/category.js
const app = getApp();
let requestUrl = app.globalData.url;


Page({

  /**
   * 页面的初始数据
   */
  data: {
		select:0,
		leftTapArray:[],
		//是否存在二级分类
		second:1,
		//不存在二级分类的商品详情
		goods:[{
			"name": "学院风显瘦宽松纯色短袖纯棉T恤夏季",
			"saleNum":"23",
			"prevPrice":"123.00",
			"newPrice":"233.00"
		}, {
			"name": "学院风显瘦宽松纯色短袖纯棉T恤夏季",
			"saleNum": "23",
			"prevPrice": "123.00",
			"newPrice": "233.00"
			}, {
				"name": "学院风显瘦宽松纯色短袖纯棉T恤夏季",
				"saleNum": "23",
				"prevPrice": "123.00",
				"newPrice": "233.00"
		}, {
			"name": "学院风显瘦宽松纯色短袖纯棉T恤夏季",
			"saleNum": "23",
			"prevPrice": "123.00",
			"newPrice": "233.00"
		}],
		//存在二级分类
		category: []
  },
	//点击二级分类
	goList(){
		wx.navigateTo({
			url: '/pages/categoryList/categoryList',
		})
	},
	//处理左侧楼层点击事件
	leftCellTap(e){
		let that = this,
				select = e.currentTarget.dataset.idx,
				tempArr = that.data.leftTapArray,
				second = tempArr[select].code,
				category = tempArr[select].children;
		if(second == 1){
			that.setData({
				category:category,
				select: select
			});
		}
		//请求二级分类，设置data数据
		// wx.request({
		// 	url: requestUrl + '/mpa/category/1/1',
		// 	success(res) {
		// 		console.log("二级分类请求完成")
		// 		console.log(res)
		// 		let category = res.data.category,
		// 			goods = res.data.goods,
		// 			second;
		// 		if (res.data.code == 1) {
		// 			second = true;
		// 		} else if (res.data.code == 2) {
		// 			second = false;
		// 		}
		// 		that.setData({
		// 			second: second,
		// 			goods: goods,
		// 			category: category
		// 		})
		// 		console.log(that.data)
		// 	}
		// })
	},
	//点击商品跳转商品详情
	goDetail(e){
		wx.navigateTo({
			url: '/pages/detail/detail',
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;
		wx.setNavigationBarTitle({
			title: '搜索',
		})
		//请求一级分类，设置data数据
		wx.request({
			url: requestUrl + '/mpa/category?merchant_id=1',
			success(res){
				let leftSelectedIdx = app.globalData.classIdx;
				console.log("一级分类请求完成")
				console.log(res)
				res.data[leftSelectedIdx].selected = true;
				that.setData({
					category:res.data[leftSelectedIdx].children,
					leftTapArray:res.data
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
		let that = this;
		let select = app.globalData.classIdx;
		that.setData({
			select: select
		})
		// //请求二级分类，设置data数据
		// wx.request({
		// 	url: requestUrl + '/mpa/category/1/1',
		// 	success(res) {
		// 		console.log("二级分类请求完成")
		// 		console.log(res)
		// 		let category = res.data.category,
		// 			goods = res.data.goods,
		// 			second;
		// 		if (res.data.code == 1) {
		// 			second = true;
		// 		} else if (res.data.code == 2) {
		// 			second = false;
		// 		}
		// 		that.setData({
		// 			second: second,
		// 			goods: goods,
		// 			category: category
		// 		})
		// 		console.log(that.data)
		// 	}
		// })
		app.globalData.classIdx = 0;
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