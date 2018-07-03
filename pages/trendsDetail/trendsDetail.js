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
    commentId: 0
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
    console.log(111111)
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
  onLoad: function (options) {
    let that = this;
    // 动态列表数据
    wx.request({
      url: app.globalData.http + '/mpa/feed/'+options.id,
      method: 'GET',
      success(res) {
        that.setData({
          trendsData: res.data,
          name: app.globalData.name
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