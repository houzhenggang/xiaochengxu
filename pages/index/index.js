//index.js
//获取应用实例
const app=getApp();
Page({
  data: {
		//分类
    image: 'http://image.yiqixuan.com/',
		categoryList:[],
		//店铺描述信息
		description: {},
    indicatorDots: false,
    newCate:'',
    touch: true,
    duration: 500,
    current:0,
		//推荐商品
		//不参与遍历的第一件推荐商品
		recommend_first:'',
    recommend:2,
		recommend_goods:'',
		//特价商品
		special_goods:'',
    special:''
  },
  onLoad: function () {
    let that = this;   
    //获取店家描述数据
    // console.log(app.globalData.apiExt)
    wx.request({
      url: app.globalData.http + '/mpa/index',
      method: 'GET',
      header:{
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        app.globalData.mobile = res.data.customer_service_mobile
        that.setData({
          description: res.data
        }, function () {
          //异步成功之后设置title
          wx.setNavigationBarTitle({
            title: that.data.description.name,
          })
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })


    wx.request({
      url: app.globalData.http + '/mpa/index/category?per_page=10',
      method:'get',
      success:function(res){
        that.setData({
          categoryList: res.data,
        })
      }
    })

    //获取推荐商品列表
    wx.request({
      url: app.globalData.http + '/mpa/goods/recommend?page=0&per_page=7',
      method: 'GET',
      header:{
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        var code = res.statusCode.toString()
        if (code.indexOf('20')>-1) {
          //截取第一件商品
          let firstGood = res.data.splice(0, 1);
          if (firstGood.length){
            that.setData({
              recommend_first: firstGood,
              recommend_goods: res.data,
              recommend: 1
            })
          }        
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //获取特价商品列表
    wx.request({
      url: app.globalData.http + '/mpa/goods/special?page=0&per_page=6',
      method: 'GET',
      header:{
        'Api-Ext':app.globalData.apiExt
      },
      success(res) {
        if (res.data.length>0) {
          that.setData({
            special_goods: res.data,
            special:1
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  changeCurrent:function(e){
    this.setData({
      current: e.detail.current
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() 
    let that = this;
    //获取店家描述数据
    // console.log(app.globalData.apiExt)
    wx.request({
      url: app.globalData.http + '/mpa/index',
      method: 'GET',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        app.globalData.mobile = res.data.customer_service_mobile
        that.setData({
          description: res.data
        }, function () {
          //异步成功之后设置title
          wx.setNavigationBarTitle({
            title: that.data.description.name,
          })
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //获取一级分类信息列表
    wx.request({
      url: app.globalData.http + '/mpa/category',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        that.setData({
          categoryList: res.data,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //获取推荐商品列表
    wx.request({
      url: app.globalData.http + '/mpa/goods/recommend?page=0&per_page=7',
      method: 'GET',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
         
        //截取第一件商品
        let firstGood = res.data.splice(0, 1);
        if (firstGood) {
          that.setData({
            recommend_first: firstGood,
            recommend_goods: res.data,
            recommend: 1
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //获取特价商品列表
    wx.request({
      url: app.globalData.http + '/mpa/goods/special?page=0&per_page=6',
      method: 'GET',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        if (res.data.length > 0) {
          that.setData({
            special_goods: res.data,
            special: 1
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
	//跳转商品详情页
	bindDetail(e){
		wx.navigateTo({
			url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
		})
	},
  //定义分享转发
  onShareAppMessage: function (res) {
    if (res.from === "button") {
    }
    return {
      title: this.data.description.description,
      path: "/pages/index/index",
      imageUrl: this.data.image +this.data.description.logo_url,
      success(res) {
      }
    }
  },
	contactPhone(){
		var phoneNumber = this.data.description.customer_service_mobile;
    app.globalData.mobile = phoneNumber
		wx.makePhoneCall({
			phoneNumber: phoneNumber,
		})
	},
	switchCate(e){
		//当前点击索引,保存到globalData
    var idx = e.currentTarget.dataset.idx;
    var name = e.currentTarget.dataset.name;
    // app.globalData.classIdx = idx;
		wx.navigateTo({
      url: '/pages/categoryList/categoryList?category_id=' + idx + '&name=' + name
    })
	},
	//查看更多点击事件
	showMore(e){
		var path = e.target.dataset.type;
    console.log(path)
		wx.navigateTo({
			url: '/pages/'+path+"/"+path,
		})
	}
})
