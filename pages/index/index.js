//index.js
//获取应用实例
const app=getApp();
const url = "http://192.168.20.140";
Page({
  data: {
		//分类
		ulList:[{
			"text":"裙装",
			"imgurl":"/imgs/Home_icon_skirt@2x.png"
		}, {
			"text": "外套",
			"imgurl": "/imgs/Home_icon_coat@2x.png"
			}, {
				"text": "鞋靴",
				"imgurl": "/imgs/Home_icon_booties@2x.png"
		}, {
			"text": "箱包",
			"imgurl": "/imgs/Home_icon_luggage@2x.png"
			}, {
				"text": "内衣",
				"imgurl": "/imgs/Home_icon_neiyi@2x.png"
		}, {
			"text": "T恤",
			"imgurl": "/imgs/Home_icon_Tshirt@2x@2x.png"
		}],
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
	bindDetail(){
		wx.navigateTo({
			url: '/pages/detail/detail',
		})
	},
	contactPhone(){
		var phoneNumber = this.data.description.customer_service_mobile;
		wx.makePhoneCall({
			phoneNumber: phoneNumber,
		})
		// wx.scanCode({
		// 	scanType:"qrCode",
		// 	success:(res)=>{
		// 		console.log(res)
		// 	}
		// })
	},
	switchCate(e){
		//当前点击索引,保存到globalData
		var index = e.currentTarget.dataset.idx;
		app.globalData.classIdx = index;
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
			url: url + '/mpa/index/1',
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
		//获取推荐商品列表
		wx.request({
			url: url + '/mpa/recommend_goods/1?page=1&order_by=created_at&pre_page=7',
			method: 'GET',
			success(res){
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
			url: url + '/mpa/special_goods/1?page=1&order_by=price desc&pre_page=6',
			method: 'GET',
			success(res){
				that.setData({
					special_goods:res.data
				})
			}
		})
  }
})
