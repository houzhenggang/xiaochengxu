// pages/search/search.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		value:"",
    dataList:[]
  },
	//input事件
	searchKey:function(e){
    var that=this
		this.setData({
			value:e.detail.value
		})
    wx.request({
      url: app.globalData.http +'/mpa/goods/search/suggest',
      data:{
        keywords: e.detail.value
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
		console.log(e.detail.value)
		wx.navigateTo({
			url: '/pages/result/result',
		})
	}
})