// pages/shoppingCar/shoppingCar.js
var  app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:'',
		selectAll:false,
    datalist:[],
    image: 'http://image.yiqixuan.com/',
   	totalPrice:0,
    page:0,
    startX: 0, //开始坐标
    startY: 0,
    apiKey:'',
    apiSecret:''
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
      app.globalData.good = seleArr;
      wx.navigateTo({
        url: '/pages/surePay/surePay',
      })
      wx.login({ 
        success(code) {       
        //向后台发起请求，传code
          wx.request({
            url: app.globalData.http +'/mpa/wechat/auth',
            method: 'POST',
            data: {
              code: code.code
            },
            success: function (res) { 
              //保存响应头信息
              var apiKey = res.header["Api-Key"],
                apiSecret = res.header["Api-Secret"];
              //设置storage
              //获取时间戳保存storage
              let timestamp = Date.parse(new Date());
              wx.setStorage({
                key: 'apiKey',
                data: apiKey,
              })
              wx.setStorage({
                key: 'timestamp',
                data: timestamp,
              })

              wx.setStorage({
                key: 'apiSecret',
                data: apiSecret,
              })
              if (!res.data.user_id) {
                wx.navigateTo({
                    url: "/pages/regMob/regMob"
                })
              }else{
                app.globalData.good = seleArr;
                wx.navigateTo({
                  url: '/pages/surePay/surePay',
                })
              }
            }
          })
        }
      })
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
        url: app.globalData.http +'/mpa/cart/' + id,
				method: "PUT",
				data: {
					count: newNum
				},
        header: {
          "Api-Key": _this.data.apiKey,
          "Api-Secret": _this.data.apiSecret
        },
				success(res) {

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
				// title: '删除',
				content: '确定删除该商品？',
				success(res) {
					// 当用户点击确定按钮
					if(res.confirm){
						wx.request({
              url: app.globalData.http + '/mpa/cart/' + _this.data.datalist[index].id,
							method:"DELETE",
              header: {
                "Api-Key": _this.data.apiKey,
                "Api-Secret": _this.data.apiSecret
              },
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
      url: app.globalData.http + '/mpa/cart/' + id,
			method:"PUT",
			data:{
				count:newNum
			},
      header: {
        "Api-Key": _this.data.apiKey,
        "Api-Secret": _this.data.apiSecret
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
    var index = e.currentTarget.dataset.index
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
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var dataList=this.data.datalist
    dataList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      datalist: dataList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      dataList = that.data.datalist,
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      dataList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      datalist: dataList
    })
  },
/**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var _this=this  
    wx.showModal({
      // title: '删除',
      content: '确定删除该商品？',
      success(res) {
        // 当用户点击确定按钮
        if (res.confirm) {
          wx.request({
            url: app.globalData.http + '/mpa/cart/' + _this.data.datalist[index].id,
            method: "DELETE",
            header: {
              "Api-Key": _this.data.apiKey,
              "Api-Secret": _this.data.apiSecret
            },
            success(res) {
              console.log(res)
              //如果删除成功
              if (res.statusCode == 200) {
                _this.data.datalist.splice(e.currentTarget.dataset.index, 1)
                var total=0
                for (let i = 0; i < _this.data.datalist.length; i++) {
                  total += _this.data.datalist[i].price * _this.data.datalist[i].count
                }
                _this.setData({
                  datalist: _this.data.datalist,
                  totalPrice: total
                })

              } else {
                wx.showToast({
                  title: '请重新尝试',
                  icon: "none"
                })
              }
            }
          })
        }
      }
    })

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
			// title: '删除',
			content: '确定删除？',
			success(res){
				if(res.confirm){
					//单个商品删除请求
					if (deleArr.length == 1) {
						wx.request({
              url: app.globalData.http + '/mpa/cart/' + deleArr[0],
							method: "DELETE",
              header: {
                "Api-Key": that.data.apiKey,
                "Api-Secret": that.data.apiSecret
              },
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
              url: app.globalData.http + '/mpa/cart/batch',
							method: "DELETE",
							data: {
								ids: deleArr
							},
              header: {
                "Api-Key": that.data.apiKey,
                "Api-Secret": that.data.apiSecret
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
  getData:function(){
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    let isShow = that.data.isShow;
    //获取用户购物车列表
    wx.request({
      url: app.globalData.http + '/mpa/cart',
      data: {
        page: that.data.page
      },
      // header: {
      //   "Api-Key": that.data.apiKey,
      //   "Api-Secret": that.data.apiSecret
      // },
      success(res) {
        if (res.data != "") {
          var list=[]
          res.data.forEach(function (item, index) {
            item.isSelect = false;
            item.isTouchMove = false 
            list.push(item)
          })
          if (list.length == 0 && that.data.page==0) {
            isShow = 2
          } else {
            isShow = 1
          }
          var datalists = that.data.datalist.concat(list)
          that.setData({
            datalist: datalists,
            isShow: isShow
          })
        } else if (!res.data&&that.data.page == 0){
          that.setData({
            isShow: 2
          })
        }
        wx.hideLoading();
      },
      fail:function(){
        that.setData({
          isShow: 2
        })
        wx.hideLoading();
      }
    })
  },
  onLoad: function (options) {
    // var apiKey = wx.getStorageSync('apiKey')
    // var apiSecret = wx.getStorageSync('apiSecret')
    // console.log(apiKey)
    // console.log(apiSecret)
    // this.setData({
    //   apiKey: apiKey,
    //   apiSecret: apiSecret
    // })
    this.getData()
  },
  /*
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
      var pages=this.data.page;
      pages=pages+1
      this.setData({
        page:pages
      })
      this.getData()
  }
})