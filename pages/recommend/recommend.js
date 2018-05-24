// pages/recommend/recommend.js
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
		}]
  },
	//跳转商品详情
	goDetail(e){
		wx.navigateTo({
			url: '/pages/detail/detail',
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.request({
			url: requestUrl + '/mpa/goods/recommend',
			data:{
				page:1,
				pre_page:5,
				order_by:"creat_at",
			},
			success(res){
				console.log(res)
			}
		})
		wx.setNavigationBarTitle({
			title: '推荐',
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