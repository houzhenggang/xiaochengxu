// pages/shoppingCar/shoppingCar.js
const app = getApp()
const requestUrl = "http://192.168.10.158";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: 2,
		selectAll:false,
    datalist:[],
   	totalPrice:0
  },
	//订单详情
	goDetail(){
		wx.navigateTo({
			url: '/pages/detail/detail',
		})
	},
	//跳转首页
	goIndex(){
		wx.switchTab({
			url: '/pages/index/index',
		})
	},
  /*减少数量*/
  subtraction(e){  
    var _this=this;
    var index = e.target.dataset.index;
		var id = e.target.dataset.id;
    var num = 'datalist['+index+'].count';
    if (parseInt(_this.data.datalist[index].count)>0){
      var newNum = parseInt(_this.data.datalist[index].count)-1;
			//PUT，用户修改购物车数量
			wx.request({
				url: requestUrl + '/mpa/cart/' + id,
				method: "PUT",
				data: {
					count: newNum
				},
				success(res) {
					console.log(res)
					if (res.statusCode == 200) {
						var num = 'datalist[' + index + '].count';
						_this.setData({
							[num]: newNum
						})
					}
				}
			})
    }
   
  },
  /*增加数量*/
  add(e) {
    var _this = this;
    var index = e.target.dataset.index;
		var id = e.target.dataset.id;
		var newNum = parseInt(_this.data.datalist[index].count) + 1;
		//PUT，用户修改购物车数量
		wx.request({
			url: requestUrl + '/mpa/cart/' + id,
			method:"PUT",
			data:{
				count:newNum
			},
			success(res){
				if(res.statusCode == 200){
					var num = 'datalist[' + index + '].count';
					_this.setData({
						[num]: newNum
					})
				}
			}
		})
  },
	//每一项前的点击事件
  select(e){
    var _this = this;
		var total = _this.data.totalPrice;
    var index = e.target.dataset.index
    var num ='datalist[' + index + '].isSelect';
		//改变选中状态
    var newNum = !_this.data.datalist[index].isSelect;
		_this.setData({
			[num]: newNum
		})
		//计算合计金额
		if (_this.data.datalist[index].isSelect) {
			total += (_this.data.datalist[index].price) * (_this.data.datalist[index].count)
		}else{
			total -= (_this.data.datalist[index].price) * (_this.data.datalist[index].count)
		}
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
			selectAll:selectAll,
			totalPrice: total
		})
  },
  touchStart(e){
  },
  touchEnd(e){
  },
	//点击全选
	selectAll(e){
		var selectAll = this.data.selectAll;
		let total = 0,
				tempArr = this.data.datalist;
		console.log(selectAll)
		if(!selectAll){
			//将每一项的isSelect置为true
			var allArr = this.data.datalist.map(function (item) {
				item.isSelect = true;
				return item;
			});
			selectAll = true;
			//计算合计金额
			for(let i=0;i < tempArr.length;i++){
				total += tempArr[i].price * tempArr[i].count
			}
		}else{
			//将每一项的isSelect置为false
			var allArr = this.data.datalist.map(function (item) {
				item.isSelect = false;
				return item;
			});
			selectAll =false;
			total = 0;
		}
		this.setData({
			selectAll:selectAll,
			datalist:allArr,
			totalPrice:total
		})	
	},
	//底部删除点击事件
	bottomDelete(){
		let that = this;
		let isShow = that.data.isShow;
		//未选中item数组数组
		var seleArr = [],deleArr=[];
		var nowArr = this.data.datalist,
				len = nowArr.length;
		for(let i=0;i<len;i++){
			if(!nowArr[i].isSelect){
				seleArr.push(nowArr[i])
			}else{
				deleArr.push(nowArr[i].id)
			}
		};
		//控制isShow值
		if(seleArr.length == 0){
			isShow = 2
		}else{
			isShow = 1
		}
		if(deleArr.length == 1){
			wx.request({
				url: requestUrl + '/mpa/cart/' + deleArr[0],
				method:"DELETE",
				success(res){
					console.log(res)
					that.setData({
						datalist: seleArr,
						isShow:isShow
					})
				}
			})
		}else{
			wx.request({
				url: requestUrl + '/mpa/cart/batch',
				method: "DELETE",
				data:{
					ids:deleArr
				},
				success(res){
					console.log(res)
					that.setData({
						datalist: seleArr,
						isShow: isShow
					})
				}
			})
		}

	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;
		let isShow = that.data.isShow;
		//获取用户购物车列表
		wx.request({
			url: requestUrl + '/mpa/cart',
			success(res){
				console.log(res)
				if(res.data != ""){
					let list = res.data.map(function (item, index, arr) {
						item.isSelect = false;
						return item
					})
					console.log(list)
					if (list.length == 0) {
						isShow = 2
					} else {
						isShow = 1
					}
					that.setData({
						datalist: list,
						isShow: isShow
					})
				}else{
					that.setData({
						isShow:2
					})
				}
			}
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