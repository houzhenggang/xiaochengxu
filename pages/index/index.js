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
		}]
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
	contactPhone:()=>{
		wx.makePhoneCall({
			phoneNumber: '13882054964',
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
	showMore(event){
		var path = event.target.dataset.type;
		wx.navigateTo({
			url: '/pages/'+path+"/"+path,
		})
	},
  onLoad: function () {
    
  },
  
})
