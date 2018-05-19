// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		//使用data数据控制类名
		chooseModal:false,
		//动态控制“-”号类名
		minusStatus:"disabled",
		//是否已选颜色规格
		selectedArr:[],
		isSelected:true,
		imgs: ["/imgs/detail/ product details@2x(3).png", "/imgs/detail/product details@2x.png"],
		//颜色、规格数据
		color:[{
			"color":"四季版-橘黄色",
			"isSelected":true
		}, {
			"color": "四季版-橘黄色",
			"isSelected": false
			}, {
				"color": "四季版-橘黄色",
				"isSelected": false
		}, {
			"color": "四季版-青灰色推荐",
			"isSelected": false
			}, {
				"color": "四季版-橘黄色",
				"isSelected": false
		}, {
			"color": "四季版-橘黄色",
			"isSelected": false
		}],
		size:[{
			"size":"38【真牛皮】",
			"isSelected":true
		}, {
			"size": "38【真牛皮】",
			"isSelected": false
			}, {
				"size": "38【真牛皮】",
				"isSelected": false
		}, {
			"size": "38【真牛皮】",
			"isSelected": false
			}, {
				"size": "38【真牛皮】",
				"isSelected": false
		}, {
			"size": "38【真牛皮】",
			"isSelected": false
			}, {
				"size": "38【真牛皮】",
				"isSelected": false
		}, {
			"size": "38【真牛皮】",
			"isSelected": false
		}],
		//初始数量
		num:1,
		//定义动画
		animationData:{}
  },
	/* 规格选择弹出事件 */
	modalShow(e){
		var that = this;
		//创建一个动画实例
		var animation = wx.createAnimation({
			//动画持续事件
			duration: 400,
			//定义动画效果
			timingFunction:'linear'
		})
		//将该变量赋值给当前动画
		that.animation = animation;
		//现在Y轴偏移，然后用step()完成一个动画
		animation.translateY(450).step();
		that.setData({
			animationData:animation.export(),
			chooseModal: true
		})
		//设置setTimeout改变Y轴偏移量
		setTimeout(function(){
			animation.translateY(0).step();
			that.setData({
				animationData:animation.export()
			})
		}, 100)
	},
	closeModal(){
		var that = this;
		var animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'linear'
		})
		that.animation = animation
		animation.translateY(450).step()
		that.setData({
			animationData: animation.export()

		})
		setTimeout(function () {
			animation.translateY(0).step()
			that.setData({
				animationData: animation.export(),
				chooseModal: false
			})
		}, 500)
	},
	/* 点击减号 */
	bindMinus(){
		var num = this.data.num;
		//num大于1时才做自减
		if(num>1){
			num--
		}
		//大于1件时为normal状态，否则为disabled状态
		var minusStatus = num <= 1 ? "disabled" : "normal";
		this.setData({
			num:num,
			minusStatus
		})
	},
	bindPlus(){
		var num = this.data.num;
		num++;
		var minusStatus = num <= 1 ? "disabled" : "normal";
		this.setData({
			num:num,
			minusStatus:minusStatus
		})
	},
	//选择规格事件
	chooseSpec(e){
		var currIndex = e.currentTarget.dataset.attrIndex;
		var type = e.currentTarget.dataset.type;
		if(type == "color"){
			//选择颜色规格
			var newArray = this.data.color.map(function (item, index, arr) {
				arr[index].isSelected = false;
				return arr[index];
			});
			newArray[currIndex].isSelected = true;
			//重新设置data值
			this.setData({
				color: newArray
			})
		}else{
			//选择尺寸规格
			var newArray = this.data.size.map(function (item, index, arr) {
				arr[index].isSelected = false;
				return arr[index];
			});
			newArray[currIndex].isSelected = true;
			//重设data
			this.setData({
				size: newArray
			})
		}
	},
	//定义分享转发
	onShareAppMessage:function(res){
		if(res.from === "button"){
			console.log(res.target)
		}
		return{
			title:"我的第一个分享",
			path:"/pages/detail/detail?id=2",
			success(res){
				console.log(1111)
			}
		}
	},
	//点击购物车
	goCart(){
		wx.navigateTo({
			url: '/pages/cart/cart',
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '商品详情',
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