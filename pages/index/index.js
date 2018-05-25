//index.js
//获取应用实例
const app=getApp();
const requestUrl = app.globalData.url;
Page({
  data: {
		//分类
		categoryList:[],
		//店铺描述信息
		description: {},
		//推荐商品
		//不参与遍历的第一件推荐商品
		recommend_first:[],
		recommend_goods:[],
		//特价商品
		special_goods:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
	//跳转商品详情页
	bindDetail(e){
		console.log(e)
		wx.navigateTo({
			url: '/pages/detail/detail?goods_id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name,
		})
	},
	//跳转订单页
	bindOrder(e){
		console.log(e)
		// wx.navigateTo({
		// 	url: '/pages/orders/orders',
		// })
	},
	contactPhone(){
		var phoneNumber = this.data.description.customer_service_mobile;
		wx.makePhoneCall({
			phoneNumber: phoneNumber,
		})
	},
	switchCate(e){
		//当前点击索引,保存到globalData
		var index = e.currentTarget.dataset.idx;
		app.globalData.classIdx = index;
		console.log(app.globalData.classIdx);
		wx.switchTab({
			url: '/pages/category/category',
		})
	},
	//查看更多点击事件
	showMore(e){
		var path = e.target.dataset.type;
		wx.navigateTo({
			url: '/pages/'+path+"/"+path,
		})
	},
  onLoad: function () {
		let that = this;
		//获取店家描述数据
		wx.request({
			url: requestUrl + '/mpa/index',
			method: 'GET',
			success(res){
				that.setData({
					description: res.data
				},function(){
					//异步成功之后设置title
					wx.setNavigationBarTitle({
						title: that.data.description.name,
					})
				})
			},
		})
		//获取一级分类信息列表
		wx.request({
			url: requestUrl + '/mpa/category',
			success(res) {
				console.log("一级分类请求完成")
				console.log(res)
				that.setData({
					categoryList: res.data
				})
			}
		})
		//获取推荐商品列表
		wx.request({
			url: requestUrl + '/mpa/goods/recommend?page=1&order_by=created_at&pre_page=7',
			method: 'GET',
			success(res){
				console.log(res)
				//截取第一件商品
				let firstGood = res.data.splice(0,1);
				that.setData({
					recommend_first:firstGood,
					recommend_goods:res.data
				})
			}
		})
		//获取特价商品列表
		wx.request({
			url: requestUrl + '/mpa/goods/special?page=1&order_by=price desc&pre_page=6&merchant_id=1',
			method: 'GET',
			success(res){
				that.setData({
					special_goods:res.data
				})
			}
		})
  }
})
