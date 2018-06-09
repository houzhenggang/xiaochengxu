// pages/special/special.js
const app = getApp();
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
			"prePrice": "￥233.00",
			"saleOut":true
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00",
			"saleOut": false
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00",
			"saleOut": false
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice": "￥233.00",
			"saleOut": false
		}]
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
    console.log(11111);
		let that = this;
		wx.request({
      url: app.globalData.http + '/mpa/goods/special',
			data: {
				page: 1,
				pre_page: 5,
				order_by: "created_at",
			},
      header:{
        'Api-Ext': app.globalData.apiExt
      },
			method: "GET",
			success(res) {
				console.log(res)
				that.setData({
					produList: res.data
				})
			}
		})
		wx.setNavigationBarTitle({
			title: '特价',
		})
  }
})