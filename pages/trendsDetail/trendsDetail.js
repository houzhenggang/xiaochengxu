// pages/trends/trends.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: 'http://image.yiqixuan.com/',
    type: 1,
    messages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    comments: [1],
    trendsData: [],
    name: '',
    inputVisi: false,
    inputValue: '',
    voted: false,
    autoFocus: false,
    value: '',
    commentId: 0,
    comments:[],
    content: '',
    timestamp:''
  },
  // 动态点赞
  vote(e) {
    console.log(e)
    wx.request({
      url: app.globalData.http + '/mpa/feed/' + e.currentTarget.dataset.id + '/vote',
      method: 'POST',
      header: {
        'Api-Key': app.globalData.apiKey,
        'Api-Secret': app.globalData.apiSecret
      },
      success(res) {
        console.log(res)
      }
    })
  },
  // 动态取消点赞
  cancledVote(e) {
    console.log(e)
    // wx.request({
    //   url: app.globalData.http + '/feed/' + id + '/canceled',
    //   method: 'POST',
    //   success(res) {
    //     console.log(res)
    //   }
    // })
  },
  // input输入值改变
  userInput(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // input框失去焦点
  userBlur(e) {
    this.setData({
      inputVisi: false,
      autoFocus: false
    })
  },
  // 点击评论
  commentVisi(e) {
    this.setData({
      inputVisi: true,
      autoFocus: true,
      commentId: e.currentTarget.dataset.id
    })
  },
  // 动态评论
  comment(e) {
    console.log(e)
    this.setData({
      autoFocus: false
    })
    let that = this;
    wx.request({
      url: app.globalData.http + '/mpa/feed/' + that.data.commentId + '/comment',
      method: 'POST',
      header: {
        'Api-Key': app.globalData.apiKey,
        'Api-Secret': app.globalData.apiSecret
      },
      data: {
        content: that.data.value
      },
      success(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getTime: function (value)  {
    // var reg = getRegExp('/-/')
    var timestamp = value.replace(/-/gi, '/')
    timestamp = new Date(timestamp).getTime()
    var nowTime = new Date().getTime()
    var disTime = nowTime - timestamp;
    if (disTime < 60 * 60 * 1000) {
      var time = Math.floor(disTime / 60 / 1000)
      time = time + '分钟前'
    } else if (disTime < 24 * 60 * 60 * 1000) {
      var time = Math.floor(disTime / 60 / 1000 / 60)
      time = time + '小时前'
    } else if (disTime < 2 * 24 * 60 * 60 * 1000) {
      var time = '昨天' + value.substring(11,16)
    } else {
      var time = value
    }
    return time
  },
  time:function(value){
    var timestamp = value.replace(/-/gi, '/')
    timestamp = new Date(timestamp).getTime()
    var nowTime = new Date().getTime()
    var disTime = nowTime - timestamp;
    if (disTime < 24 * 60 * 60 * 1000) {
      time = value.substring(11,16)
    }else {
      var time = value.substring(5, 16)
    }
    return time
  },

  onLoad: function (options) {
    let that = this;
    // 动态列表数据
    wx.request({
      url: app.globalData.http + '/mpa/feed/97',
      method: 'GET',
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        var nodes = res.data.content.replace(/<img/gi, '<img style="width:100%;"')
          .replace(/<p/gi, '<p style="font-size:24rpx;"')
        // that.setData({
        //   trendsData: res.data,
        //   name: app.globalData.name,
        //   content:nodes
        // })
        var timestamp = that.getTime(res.data.created_at)
        that.setData({
          trendsData: res.data,
          name: '麻婆豆腐',
          content: nodes,
          timestamp: timestamp
        })
      }
    })
    // 评论列表数据
    wx.request({
      url: app.globalData.http + '/mpa/comment',
      method: 'GET',
      data:{
        feed_id:97
      },
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        var comment=res.data
        comment.forEach(function(v){
          var time = that.time(v.created_at)
          v.time = time
        })
        that.setData({
          comments: comment
        })
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