// pages/category/category.js
const app = getApp();
var leftSelectedIdx = app.globalData.classIdx;

Page({

  /**
   * 页面的初始数据
   */
  data: {
		leftTapArray:[],
		rightTapArray:[],
		//是否存在二级分类
		second:false,
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
		classify: [{
			"class": "衬衫",
			"url": "/imgs/category/Search_shirt_img@2x.png"
		}, {
			"class": "毛衣",
			"url": "/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
		}, {
			"class": "衬衫",
			"url": "/imgs/category/Search_shirt_img@2x.png"
		}, {
			"class": "毛衣",
			"url": "/imgs/category/Search_shirt_img@2x.png"
		}, {
			"class": "毛衣",
			"url": "/imgs/category/Search_shirt_img@2x.png"
		}],
		ulList: [{
			"text": "裙装",
			"imgurl": "/imgs/Home_icon_skirt@2x.png",
			"selected": 0,
			"classify":[{
				"class":"衬衫",
				"url":"/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
				}]
		}, {
			"text": "外套",
			"imgurl": "/imgs/Home_icon_coat@2x.png",
			"selected":0,
			"classify": [{
				"class": "衬衫",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}]
		}, {
			"text": "鞋靴",
			"imgurl": "/imgs/Home_icon_booties@2x.png",
			"selected": 0,
			"classify": [{
				"class": "衬衫",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}]
		}, {
			"text": "箱包",
			"imgurl": "/imgs/Home_icon_luggage@2x.png",
			"selected": 0,
			"classify": [{
				"class": "衬衫",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}]
		}, {
			"text": "内衣",
			"imgurl": "/imgs/Home_icon_neiyi@2x.png",
			"selected": 0,
			"classify": [{
				"class": "衬衫",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}]
		}, {
			"text": "T恤",
			"imgurl": "/imgs/Home_icon_Tshirt@2x@2x.png",
			"selected": 0,
			"classify": [{
				"class": "衬衫",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}, {
				"class": "毛衣",
				"url": "/imgs/category/Search_shirt_img@2x.png"
			}]
		}]
  },
	//处理左侧楼层点击事件
	leftCellTap(e){
		//当前选中行数组
		var tempArray = this.data.ulList;
		//当前选中行
		var selectIdx = e.currentTarget.dataset.idx;
		 tempArray.forEach(function (val, index, arr) {
			arr[index].selected = false
		});
		//赋值当前选中行
		tempArray[selectIdx].selected=true;
		this.setData({
			leftTapArray:tempArray,
			ulList:tempArray
		});
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
		var leftSelectedIdx = app.globalData.classIdx;
		var tempArray = this.data.ulList;
		tempArray.forEach(function(val,index,arr){
			arr[index].selected = false
		});
		tempArray[leftSelectedIdx].selected = true;
		this.setData({
			leftTapArray: tempArray
		})
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