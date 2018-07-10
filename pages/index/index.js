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
    newCate:'',
    remain:"",
    current:0,
    keyword:'',
    //屏幕宽度
    winWidth:'',
		//推荐商品
		//不参与遍历的第一件推荐商品
    good:[],
		recommend_first:'',
    recommend:2,
		recommend_goods:'',
		//特价商品
		special_goods:'',
    special:2,
  },
  onLoad: function () {
    let that = this;
    var nowtime=new Date().getTime()
    var timestamp = wx.getStorageSync('timestamp')
    if (nowtime > timestamp+23*60*60*1000){
      wx.login({
        success(code) {
          //向后台发起请求，传code
          wx.request({
            url: app.globalData.http + '/mpa/wechat/auth',
            method: 'POST',
            data: {
              code: code.code
            },
            header: {
              'Api-Ext': app.globalData.apiExt
            },
            success: function (res) {
              //保存响应头信息
              var code = res.statusCode.toString()
              if (code >= 200 && code < 300) {
                if (res.header["api-key"] && res.header["api-secret"]) {
                  var apiKey = res.header["api-key"],
                    apiSecret = res.header["api-secret"];
                } else if (res.header["Api-Key"] && res.header["Api-Secret"]) {
                  var apiKey = res.header["Api-Key"],
                    apiSecret = res.header["Api-Secret"];
                }
                app.globalData.apiKey = apiKey
                app.globalData.apiSecret = apiSecret
                var timestamp = new Date().getTime()
                wx.setStorage({
                  key: 'timestamp',
                  data: timestamp,
                })
                wx.setStorage({
                  key: 'apiKey',
                  data: apiKey,
                })
                wx.setStorage({
                  key: 'apiSecret',
                  data: apiSecret,
                })
                wx.setStorage({
                  key: 'userId',
                  data: res.data.user_id,
                })
                if (res.data.user_id) {
                  app.globalData.userId = true
                }else{
                  app.globalData.userId=false
                }
              }
            },
            fail: function (res) {
            }
          })
        },
        fail: function (res) {
        }
      }) 
    }  
    //获取店家描述数据
    wx.request({
      url: app.globalData.http + '/mpa/index',
      method: 'GET',
      header:{
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        app.globalData.mobile = res.data.customer_service_mobile
        app.globalData.logo_url = res.data.logo_url
        app.globalData.name = res.data.name   
        that.setData({
          description: res.data
        })
        app.globalData.keyword = res.data.search_default_text
       //设置title
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //设备宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth
        });
      }
    });
    //所有商品
    wx.request({
      url: app.globalData.http + '/mpa/goods/search?per_page=10',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      dataType: 'json',
      method: 'GET',
      success: function (data) {
        that.setData({
          good:data.data
        })
      }
    })

    //商品分类
    wx.request({
      url: app.globalData.http + '/mpa/category',
      method:'get',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success:function(res){
        var cateNum = Math.ceil(res.data.length / 5)
        var remain = res.data.length % 5
        var cateArr=[]
        for(var i=0;i<cateNum;i++){
           cateArr.push(1)
        }
        that.setData({
          categoryList: res.data,
          newCate: cateArr,
          remain: remain
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
          if (firstGood.length>0){
            that.setData({
              recommend_first: firstGood,
              recommend_goods: res.data,
              recommend: 1
            })
          }else{
            that.setData({
              recommend_first: [],
              recommend_goods:[],
              recommend: 2
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
        }else{
          that.setData({
            special_goods:[],
            special: 2
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
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
        wx.stopPullDownRefresh() 
        app.globalData.mobile = res.data.customer_service_mobile
        app.globalData.logo_url = res.data.logo_url
        app.globalData.name = res.data.name   
        that.setData({
          description: res.data
        })
        app.globalData.keyword = res.data.search_default_text
        //异步成功之后设置title
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
    //所有商品
    wx.request({
      url: app.globalData.http + '/mpa/goods/search?per_page=10',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      dataType: 'json',
      method: 'GET',
      success: function (data) {
        if (data.data.length>0){
          that.setData({
            good: data.data
          })
        }else{
          that.setData({
            good:[]
          })
        }
       
      }
    })
    //商品分类
    wx.request({
      url: app.globalData.http + '/mpa/category',
      method: 'get',
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success: function (res) {
        var cateNum = Math.ceil(res.data.length / 5)
        var remain = res.data.length % 5
        var cateArr = []
        for (var i = 0; i < cateNum; i++) {
          cateArr.push(1)
        }
        that.setData({
          categoryList: res.data,
          newCate: cateArr,
          remain: remain
        })
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
        var code = res.statusCode.toString()
        if (code.indexOf('20') > -1) {
          //截取第一件商品
          let firstGood = res.data.splice(0, 1);
          if (firstGood.length>0) {
            that.setData({
              recommend_first: firstGood,
              recommend_goods: res.data,
              recommend: 1
            })
          }else{
            that.setData({
              recommend_first: [],
              recommend_goods: [],
              recommend: 2
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
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        if (res.data.length > 0) {
          that.setData({
            special_goods: res.data,
            special: 1
          })
        }else{
          that.setData({
            special_goods:[],
            special: 2
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //一级分类滚动
  scrollCategory:function(e){
    //宽度
    var scrollWidth = parseInt(e.detail.scrollWidth)
    //滚动的距离
    var scrollLeft = parseInt(e.detail.scrollLeft)
    //屏幕的宽度
    var width = parseInt(this.data.winWidth)
    //剩余的分类
    var remain = parseInt(this.data.remain)
    var cur = Math.floor(scrollLeft / width)
    var cateNum = Math.floor(scrollWidth / width)
    if (remain != 0 && scrollLeft >= (scrollWidth -width-(remain-1) * width/5)-20) {
      cur++
      this.setData({
        current: cur
      })
    }else{
      this.setData({
        current: cur
      })
    }
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
    if (this.data.description.share_logo_url){
      var url = this.data.image + this.data.description.share_logo_url
    }else{
      var url = this.data.image + this.data.description.logo_url
    }
    return {
      title: this.data.description.share_text,
      path: "/pages/index/index",
      imageUrl: url,
      success(res) {
      }
    }
  },
	switchCate(e){
		//当前点击索引,保存到globalData
    var idx = e.currentTarget.dataset.idx;
    app.globalData.classIdx =idx
    wx.switchTab({
      url: '/pages/category/category',
    })
	},
	//查看更多点击事件
	showMore(e){
		var path = e.currentTarget.dataset.type;
		wx.navigateTo({
			url: '/pages/'+path+"/"+path,
		})
	}
})
