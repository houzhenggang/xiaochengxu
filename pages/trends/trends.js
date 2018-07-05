 // pages/trends/trends.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: 'http://image.yiqixuan.com/',
    type: 1,
    messages: [1,2,3,4,5,6,7,8,9],
    comments: [1],
    trendsData:[],
    name: '',
    logo_url:'',
    inputVisi: false,
    inputValue: '',
    voted: false,
    autoFocus: false,
    hasUserInfo:true,
    value: '',
    commentId: 0
  },
  // 动态点赞
  vote (e) {
    let that = this;
    // 判断是否已进行微信授权和绑定手机号
    let userInfo = wx.getStorageSync('huzan_avatarUrl');
    if (userInfo && app.globalData.userId) {
      wx.request({
        url: app.globalData.http + '/mpa/feed/' + e.currentTarget.dataset.id + '/vote',
        method: 'POST',
        header: {
          'Api-Key': app.globalData.apiKey,
          'Api-Secret': app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success(res) {
          // 修改本地数据
          let tempArr = that.data.trendsData,
              i = e.currentTarget.dataset.index;
          tempArr[i].vote = true;
          tempArr[i].pv_vote += 1;
          that.setData({
            trendsData:tempArr
          })
          wx.showToast({
            title: '点赞成功',
          })
        }
      })
    } else {
      wx.showToast({
        title: '请完成微信和手机号授权',
        icon: 'none',
        complete() {
          wx.switchTab({
            url: '/pages/user/user',
          })
        }
      })
    }
  },
  // 动态取消点赞
  cancledVote (e) {
    let that = this;
    // 判断是否已进行微信授权和绑定手机号
    let userInfo = wx.getStorageSync('huzan_avatarUrl');
    if (userInfo && app.globalData.userId) {
      wx.request({
        url: app.globalData.http + '/mpa/feed/' + e.currentTarget.dataset.id + '/unvote',
        method: 'POST',
        header: {
          'Api-Key': app.globalData.apiKey,
          'Api-Secret': app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success(res) {
          // 修改本地数据
          let tempArr = that.data.trendsData,
            i = e.currentTarget.dataset.index;
          tempArr[i].vote = false;
          tempArr[i].pv_vote -= 1;
          that.setData({
            trendsData: tempArr
          })
          wx.showToast({
            title: '取消点赞成功',
          })
        }
      })
    } else {
      wx.showToast({
        title: '请完成微信和手机号授权',
        icon: 'none',
        complete() {
          wx.switchTab({
            url: '/pages/user/user',
          })
        }
      })
    }
  },
  // input输入值改变
  userInput (e) {
    this.setData({
      value: e.detail.value
    })
  },
  // input框失去焦点
  userBlur (e) {
    this.setData({
      inputVisi: false,
      autoFocus:false
    })
  },
  // 点击评论
  commentVisi (e) {
    // 判断是否已进行微信授权和绑定手机号
    let userInfo = wx.getStorageSync('huzan_avatarUrl');
    if (userInfo && app.globalData.userId) {
      this.setData({
        inputVisi: true,
        autoFocus: true,
        commentId: e.currentTarget.dataset.id
      })
    } else {
      wx.showToast({
        title: '请完成微信和手机号授权',
        icon: 'none',
        duration:2000,
        complete () {
          wx.switchTab({
            url: '/pages/user/user',
          })
        }
      })
    }
  },
  // 动态评论
  comment(e) {
    console.log(e)
    this.setData({
      autoFocus:false
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
  // 跳转动态详情
  commentDetail (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/trendsDetail/trendsDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 时间格式化
  getTime: function (value) {
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
      var time = '昨天' + value.substring(11, 16)
    } else {
      var time = value
    }
    return time
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 动态列表数据
    wx.request({
      url: app.globalData.http + '/mpa/feed',
      method: 'GET',
      success (res) {
        // 对评论进行截取，只保留前十条评论
        for (let i = 0; i < res.data.length; i++ ) {
          // 当数组长度大于10时截取
          if (res.data[i].comments.length > 10) {
            res.data[i].comments.splice(10, res.data[i].comments.length - 10);
          }
        }
        that.setData({
          trendsData: res.data,
          name: app.globalData.name,
          logo_url: app.globalData.logo_url
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log(111)
    wx.startPullDownRefresh()
    this.onLoad()
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