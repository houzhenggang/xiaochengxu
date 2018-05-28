// pages/shoppingCar/shoppingCar.js
const app = getApp()

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
	//点击结算
	balance(){
		let that = this;
		//如果没有选择商品,总价格为0，提示
		if(that.data.totalPrice == 0){
			wx.showToast({
				title: '请选择商品',
				icon:"none"
			})
		}else{
			//购物车商品信息
			let good = that.data.datalist;
			//已选择商品数组
			let seleArr = [];
			for(let i=0; i<good.length; i++){
				if(good[i].isSelect){
					seleArr.push(good[i])
				}
			}
			//读取app.globalData.good
			let gloGood = app.globalData.good;
			let newArr = [];
			console.log(gloGood)
			//标记是否存在该商品
			let flag = false;
			for (let i = 0; i < gloGood.length; i++) {
				for(let j=0; j < seleArr.length; j++){
					if (gloGood[i].id == seleArr[j].id) {
						gloGood[i] = seleArr[j]
						flag = true
					}
				}
			}
			if(!flag){
				newArr = gloGood.concat(seleArr);
			}
			app.globalData.good = newArr;
			console.log(app.globalData.good);
			/////////////////////////////////////////////////////////////////////////////////执行跳转
			// wx.navigateTo({
			// 	url: '',
			// })
		}
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
		var total = _this.data.totalPrice;		
		var id = e.target.dataset.id;
    var num = 'datalist['+index+'].count';
		//当删除数量不小于1时，调用PUT接口减少数量
    if(parseInt(_this.data.datalist[index].count)>1){
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
						//计算合计金额，单选情况
						if (_this.data.datalist[index].isSelect) {
							total -= _this.data.datalist[index].price
						}
						_this.setData({
							totalPrice: total
						})
					}
				}
			})
		}else if(parseInt(_this.data.datalist[index].count) == 1){//当删除数量等于1时，调用DELETE接口删除所选
			wx.showModal({
				title: '删除',
				content: '确定删除该商品？',
				success(res) {
					// 当用户点击确定按钮
					if(res.confirm){
						wx.request({
							url: requestUrl + '/mpa/cart/' + _this.data.datalist[index].id,
							method:"DELETE",
							success(res){
								console.log(res)
								//如果删除成功
								if(res.statusCode == 200){
									_this.data.datalist.splice(index,1);
									_this.setData({
										datalist:_this.data.datalist
									})
								}else{
									wx.showToast({
										title: '请重新尝试',
										icon:"none"
									})
								}
							}
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
		var total = _this.data.totalPrice;		
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
					//计算合计金额
					if (_this.data.datalist[index].isSelect) {
						total += _this.data.datalist[index].price
					}
					_this.setData({
						totalPrice:total
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
		//未选中item数组
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
		//点击删除提示信息
		wx.showModal({
			title: '删除',
			content: '确定删除？',
			success(res){
				if(res.confirm){
					//单个商品删除请求
					if (deleArr.length == 1) {
						wx.request({
							url: requestUrl + '/mpa/cart/' + deleArr[0],
							method: "DELETE",
							success(res) {
								console.log(res)
								that.setData({
									datalist: seleArr,
									isShow: isShow
								})
							}
						})
					} else {
						//批量删除请求
						wx.request({
							url: requestUrl + '/mpa/cart/batch',
							method: "DELETE",
							data: {
								ids: deleArr
							},
							success(res) {
								console.log(res)
								that.setData({
									datalist: seleArr,
									isShow: isShow
								})
							}
						})
					}
				}
			}
		})
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