// pages/search/search.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },
	//input事件
	searchKey:function(e){
    var that=this
    wx.request({
      url: app.globalData.http +'/mpa/goods/search/suggest',
      data:{
        keywords: e.detail.value
      },
      header:{
        'Api-Ext': app.globalData.apiExt
      },
      dataType:'json',
      method:'GET',
      success:function(data){
        that.setData({
          dataList:data.data
        })
      } 
    })

	},
	//清除input输入
	clearKey(){
		this.setData({
			value:"",
      dataList:[]
		})
	},
	//处理点击完成按钮函数
	confirmEvent:(e)=>{
		wx.navigateTo({
      url: '/pages/result/result?keyword=' + e.detail.value,
		})
	}
})