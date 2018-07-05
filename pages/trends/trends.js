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
    let that = this;
    setTimeout(function(){
      that.setData({
        inputVisi: false,
        autoFocus: false
      })
    },200)
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
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/user/user',
            })
          },2000)
        }
      })
    }
  },
  // 图片预览
  viewImage (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    var arr = []
    arr.push(that.data.image + that.data.trendsData[index].cover_url)
    wx.previewImage({
      current: that.data.image + that.data.trendsData[index].cover_url, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  viewImages (e) {
    var that = this;
    let index = e.currentTarget.dataset.index,
      ind = e.currentTarget.dataset.ind,
      tempArr = [], temp = that.data.trendsData[index].images;
    for (let i = 0; i < temp.length; i++) {
      tempArr.push(that.data.image + temp[i].img_url)
    }
    wx.previewImage({
      current: that.data.image + that.data.trendsData[index].images[ind].img_url, // 当前显示图片的http链接
      urls: tempArr // 需要预览的图片http链接列表
    })
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
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
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
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    // 动态列表数据
    wx.request({
      url: app.globalData.http + '/mpa/feed',
      method: 'GET',
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success (res) {
        // 对评论进行截取，只保留前十条评论
        for (let i = 0; i < res.data.length; i++ ) {
          // 当数组长度大于10时截取
          if (res.data[i].comments.length > 10) {
            res.data[i].comments.splice(10, res.data[i].comments.length - 10);
          }
          res.data[i].time_stamp = that.getTime(res.data[i].created_at)
        }
        if (res.data.length) {
          wx.hideLoading();
        } else {
          wx.hideLoading();          
          wx.showToast({
            title: '暂无动态数据',
            icon:'none'
          })
          setTimeout(function(){
            wx.hideToast()
          },2000)
        }
        that.setData({
          trendsData: res.data,
          name: app.globalData.name,
          logo_url: app.globalData.logo_url
        })
      },
      fail () {
        wx.hideLoading();        
        wx.showToast({
          title: '获取动态数据失败，请重试',
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log(111)
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    // 动态列表数据
    wx.request({
      url: app.globalData.http + '/mpa/feed',
      method: 'GET',
      header: {
        "Api-Key": app.globalData.apiKey,
        "Api-Secret": app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        // 对评论进行截取，只保留前十条评论
        for (let i = 0; i < res.data.length; i++) {
          // 当数组长度大于10时截取
          if (res.data[i].comments.length > 10) {
            res.data[i].comments.splice(10, res.data[i].comments.length - 10);
          }
          res.data[i].time_stamp = that.getTime(res.data[i].created_at)
        }
        if (res.data.length) {
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '暂无动态数据',
            icon: 'none'
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        that.setData({
          trendsData: res.data,
          name: app.globalData.name,
          logo_url: app.globalData.logo_url
        })
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '获取动态数据失败，请重试',
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }
    })
    wx.stopPullDownRefresh()    
  }
})