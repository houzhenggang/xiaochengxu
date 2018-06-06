// pages/detail/detail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
		//商品详情数据
		goods:{},
    image: 'http://image.yiqixuan.com/',
		//使用data数据控制类名
		chooseModal:false,
		//动态控制“-”号类名
		minusStatus:"disabled",
		//规格选择初始数量
		num: 1,
    name:'',
		//加入购物车/立即购买flag
		flag: 1,
		//定义动画
		animationData: {},
		//商品规格数据
		spec:{},
		//是否已选颜色规格
		seleIdxA:-1,
		seleIdxB:-1,
		//具体规格商品
		good:{},
		goodPrice:0,
		goodUrl:"",
		imgs: {}
  },
	/* 规格选择弹出事件 */
	modalShow(e){
		var that = this;
		//修改flag标识
		let flag = e.currentTarget.dataset.flag;

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
			flag:flag,
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
	//点击确认，关闭弹出框
	closeModal(e){
		var that = this;
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
              key: 'Api-Key',
              data: apiKey
            })
            wx.setStorage({
              key: 'timestamp',
              data: timestamp,
            })
            wx.setStorage({
              key: 'Api-Secret',
              data: apiSecret
            })
            wx.setStorage({
              key: 'huzan_avatarUrl',
              data: userInfo,
            })
            if (res.data.user_id) {
              wx.setStorage({
                key: 'userId',
                data: res.data.id,
              })
            } else {
              wx.navigateTo({
                url: "/pages/regMob/regMob"
              })
              return false
            }
          }
        })
      }
    })

		//动画效果
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


		//跳转页面,携带参数
		let clickId = e.currentTarget.dataset.id;

		//如果来源为加入购物车，即flag为1
		let flag = that.data.flag;
		
		if(clickId == 1 && flag == 1){
			wx.request({
        url: app.globalData.http +'/mpa/cart',
				method:"POST",
				data:{
					goods_sku_id:1,/////////////////////////////////固定商品ID，需改动
					count:that.data.num
				},
				success(res){
					wx.showToast({
						title: '加入购物车成功',
						icon: "success"
					})
				}
			})
		}else if(clickId == 1 && flag == 2){//来源为立即购买，即flag为2
			//将商品信息、数量保存到app
			let good = that.data.good;
			good.count = that.data.num;
      good.name=that.data.name;
      good.sku_description = good.spec_b + ':' + good.property_b + ',' + good.spec_a + ':' + good.property_a
			if(flag == false){
				gloGood.push(good)
			}
      app.globalData.good=[]
			app.globalData.good.push(good)
			wx.navigateTo({
				url: '/pages/surePay/surePay',
			})
		}
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
		let that = this;
		if (e.currentTarget.dataset.aIndex > -1){
			that.setData({
				seleIdxA: e.currentTarget.dataset.aIndex
			})
		}else{
			that.setData({
				seleIdxB: e.currentTarget.dataset.bIndex
			})
		}
		//已选择规格索引
		let aIndex = that.data.seleIdxA,
				bIndex = that.data.seleIdxB;
		//已选择规格数组
		let aArr = that.data.spec.spec_a.propertis,
				bArr = that.data.spec.spec_b.propertis;
		if (that.data.seleIdxA > -1 && that.data.seleIdxB > -1){
			console.log(222222222)
			wx.request({
        url: app.globalData.http + '/mpa/goods/1/skus',//////////////////////////////////////请求路径需改动
				method:"GET",
				success(res){
					let good;
					res.data.map(function(item){
						if (item.property_a == aArr[aIndex] && item.property_b == bArr[bIndex]){
							good = item;
						}
					})
					console.log(good)
					that.setData({
						good:good,
						goodUrl:good.cover_url,
						goodPrice:good.price
					})
				}
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
		wx.showLoading({
			title: '加载中',
		})
		let that = this;
		//获取商品详情
		wx.request({
      url: app.globalData.http + '/mpa/goods/' + options.id, /////////////////////////////////////////////////goods后的传参需为 options.id，测试参数
			success(res){
				that.setData({
					goods:res.data,
					goodUrl:res.data.cover_url,
					goodPrice:res.data.price,
					imgs:res.data.images,
          name: res.data.name
				})
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
				wx.hideLoading();
			}
		})
		//获取商品规格详情
		wx.request({
      url: app.globalData.http + '/mpa/goods/1/specs',///////////////////////////////测试路径，1需改为 that.data.goods.id
			success(res) {
				that.setData({
					spec: res.data
				})
			}
		})
		
  }
})