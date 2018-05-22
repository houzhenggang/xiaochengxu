// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		value:""
  },
	//input事件
	searchKey(e){
		this.setData({
			value:e.detail.value
		})
	},
	//清除input输入
	clearKey(){
		this.setData({
			value:""
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