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
		goods:[],
		//存在二级分类
		category: []
  },
	//处理左侧楼层点击事件
	leftCellTap(e){
		let that = this,
				select = e.currentTarget.dataset.idx,
				tempArr = that.data.leftTapArray,
				second = tempArr[select].code,
				category = tempArr[select].children;
				console.log(second);
		//存在二级分类
		if(second == 1){
			that.setData({
				second:second,
				category:category,
				select: select
			});
		}else{
			//不存在二级分类
			//判断是否goods是否已存在
			if(that.data.goods.length !== 0){
				that.setData({
					second: second,
					select: select
				})
			}else{
				wx.showLoading({
					title: '加载中',
				})
				wx.request({
					url: requestUrl + '/mpa/goods/search',
					data: {
						category_id: tempArr[select].id
					},
					success(res) {
						console.log(res)
						that.setData({
							second: second,
							select: select,
							goods: res.data
						})
						wx.hideLoading();
					}
				})
			}
		}
	},
	//点击二级分类
	goList(e) {
		console.log(e)
		wx.navigateTo({
			url: '/pages/categoryList/categoryList?category_id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name,
		})
	},
	//点击商品跳转商品详情
	goDetail(e){
		console.log(e)
		// wx.navigateTo({
		// 	url: '/pages/detail/detail',
		// })
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
			url: requestUrl + '/mpa/category',
			success(res){
				let leftSelectedIdx = app.globalData.classIdx;
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