//index.js
//获取应用实例
const app=getApp();
Page({
  data: {
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
		produList:[{
			"imgurl":"/imgs/Rectangle 10@2x(1).png",
			"proName":"复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price":"123.00",
			"saleNum":"23万",
			"prePrice":"￥233.00"
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice":"￥233.00"
			}, {
				"imgurl": "/imgs/Rectangle 10@2x(1).png",
				"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
				"price": "123.00",
				"saleNum": "23万",
				"prePrice":"￥233.00"
		}, {
			"imgurl": "/imgs/Rectangle 10@2x(1).png",
			"proName": "复古宽松甜美韩版泡泡袖卫衣潮流学院风",
			"price": "123.00",
			"saleNum": "23万",
			"prePrice":"￥233.00"
		}],
		//banner及店铺信息
		description:{
			"banner":"/imgs/Home_img_banner@2x.png",
			"shop":{
				"id":1,
				"name":"我的小店",
				"description": "欢迎光临本店,我是店主巴拉巴拉巴拉安拉阿巴拉澳巴啦啦巴拉巴拉巴拉巴拉",
				"customer_service_mobile":"13547831113"
			}
		}
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
		var phoneNumber = this.data.description.shop.customer_service_mobile;
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
		//获取店家描述数据
		// wx.request({
		// 	url: 'http://192.168.10.99/mpa/index',
		// 	method: 'GET',
		// 	success(res){
		// 		console.log(res)
		// 	},
		// })
		var title = this.data.description.shop.name;
    wx.setNavigationBarTitle({
			title: title,
		})
  },
  
})
