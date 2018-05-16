// pages/shoppingCar/shoppingCar.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: '1',
		selectAll:false,
    datalist:[
      {
        isSelect: true,
        price:'35.00',
        img:"/imgs/shoppingCar/Bitmap@2x(3).png",
				title:'大白兔白又白，2只耳朵跳起来啊跳起来',
        size:'颜色：深黑；尺码：M；',
        num: '1'
      },
      {
        isSelect: false,
        img:'/imgs/shoppingCar/Bitmap@2x(3).png',
        title: '大白兔白又白，2只耳朵跳起来啊跳起来',
        size:'颜色：绿色；尺码：L；',
        price:'139.00',
        num: '5'
			},
			{
				isSelect: false,
				img: '/imgs/shoppingCar/Bitmap@2x(3).png',
				title: '大白兔白又白，2只耳朵跳起来啊跳起来',
				size: '颜色：绿色；尺码：L；',
				price: '139.00',
				num: '5'
			},
			{
				isSelect: false,
				img: '/imgs/shoppingCar/Bitmap@2x(3).png',
				title: '大白兔白又白，2只耳朵跳起来啊跳起来',
				size: '颜色：绿色；尺码：L；',
				price: '139.00',
				num: '5'
			},
			{
				isSelect: false,
				img: '/imgs/shoppingCar/Bitmap@2x(3).png',
				title: '大白兔白又白，2只耳朵跳起来啊跳起来',
				size: '颜色：绿色；尺码：L；',
				price: '139.00',
				num: '5'
			},
			{
				isSelect: false,
				img: '/imgs/shoppingCar/Bitmap@2x(3).png',
				title: '大白兔白又白，2只耳朵跳起来啊跳起来',
				size: '颜色：绿色；尺码：L；',
				price: '139.00',
				num: '5'
			}
    ]
   
  },
  /*减少数量*/
  subtraction(e){  
    var _this=this;
    var index = e.target.dataset.id;
    var num = 'datalist['+index+'].num';
    if (parseInt(_this.data.datalist[index].num)>1){
      var newNum = parseInt(_this.data.datalist[index].num)-1;
      _this.setData({
        [num]: newNum
      })
    }
   
  },
  /*增加数量*/
  add(e) {
    var _this = this;
    var index = e.target.dataset.id;
    var num = 'datalist[' + index + '].num';
    var newNum = parseInt(_this.data.datalist[index].num)+1;
    _this.setData({
      [num]: newNum
    })
  },
	//每一项前的点击事件
  select(e){
    var _this = this;
    var index = e.target.dataset.id
    var num ='datalist[' + index + '].isSelect';
    var newNum = !_this.data.datalist[index].isSelect
    _this.setData({
      [num]: newNum
    })
		//遍历每一项，确定是否全选
		var selectAll = this.data.selectAll;
		var seleArr = this.data.datalist.map(function(item,index,arr){
			 return item.isSelect;
		})
		if(seleArr.indexOf(false)== -1){
			selectAll = true
		}else{
			selectAll = false
		}
		_this.setData({
			selectAll:selectAll
		})
  },
  touchStart(e){
  },
  touchEnd(e){
  },
	//点击全选
	selectAll(e){
		var selectAll = this.data.selectAll;
		console.log(selectAll)
		if(!selectAll){
			//将每一项的isSelect置为true
			var allArr = this.data.datalist.map(function (item) {
				item.isSelect = true;
				return item;
			});
			selectAll = true;
		}else{
			//将每一项的isSelect置为false
			var allArr = this.data.datalist.map(function (item) {
				item.isSelect = false;
				return item;
			});
			selectAll =false;
		}
		this.setData({
			selectAll:selectAll,
			datalist:allArr
		})	
	},
	//底部删除点击事件
	bottomDelete(){
		//未选中item数组数组
		var seleArr = [];
		var nowArr = this.data.datalist,len = nowArr.length;
		for(let i=0;i<len;i++){
			if(!nowArr[i].isSelect){
				seleArr.push(nowArr[i])
			}
		};
		this.setData({
			datalist:seleArr
		})

	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
  },
	getUserInfo: function (e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
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