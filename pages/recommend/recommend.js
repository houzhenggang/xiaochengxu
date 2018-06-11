// pages/recommend/recommend.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
		produList: [],
    image: 'http://image.yiqixuan.com/'
  },
	//跳转商品详情
	goDetail(e){
		wx.navigateTo({
			url: '/pages/detail/detail?goods_id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name,
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;
		wx.request({
      url: app.globalData.http + '/mpa/goods/recommend',
			data:{
				page:0,
				pre_page:20,
        order_by:"created_at desc",
			},
      header: {
        'Api-Ext': app.globalData.apiExt
      },
			method:"GET",
			success(res){
				console.log(res)
				that.setData({
					produList:res.data
				})
			}
		})
		wx.setNavigationBarTitle({
			title: '推荐',
		})
  },
  //返回顶部
  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1000
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