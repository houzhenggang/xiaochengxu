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
    commentId: '',
    comments:[],
    content: '',
    timestamp:''
  },
  // 动态点赞
  vote(e) {
    if (app.globalData.userId && app.globalData.userInfo){
      var that = this
      wx.request({
        url: app.globalData.http + '/mpa/feed/' + that.data.commentId + '/vote',
        method: 'POST',
        header: {
          'Api-Key': app.globalData.apiKey,
          'Api-Secret': app.globalData.apiSecret,
          'Api-Ext': app.globalData.apiExt
        },
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            var voteCount = that.data.trendsData.pv_vote;
            console.log(voteCount)
            voteCount++
            var vote = 'trendsData.pv_vote'
            that.setData({
              voted: true,
              [vote]: voteCount
            })
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请完成微信和手机号授权',
        icon:'none',
        duration:2000
      })
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/user/user'
        })
      },2000)
    }
    
  },
  // 动态取消点赞
  cancledVote(e) {
    var that=this
    wx.request({
      url: app.globalData.http + '/mpa/feed/' + that.data.commentId+ '/unvote',
      method: 'POST',
      header: {
        'Api-Key': app.globalData.apiKey,
        'Api-Secret': app.globalData.apiSecret,
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          var voteCount = that.data.trendsData.pv_vote;
          console.log(voteCount)
          voteCount--
          var vote ='trendsData.pv_vote'
          that.setData({
            voted: false,
            [vote]: voteCount
          })
          wx.showToast({
            title: '取消点赞',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
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
    if (app.globalData.userId && app.globalData.userInfo){
      this.setData({
        inputVisi: true,
        autoFocus: true
      })
    }else{
      wx.showToast({
        title: '请完成微信和手机号授权',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/user/user'
        })
      }, 2000)
    } 
    
  },
  // 动态评论
  comment(e) {
    this.setData({
      autoFocus: false
    })
    let that = this;
    wx.request({
      url: app.globalData.http + '/mpa/feed/' + that.data.commentId + '/comment',
      method: 'POST',
      header: {
        'Api-Key': app.globalData.apiKey,
        'Api-Secret': app.globalData.apiSecret,
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
      url: app.globalData.http + '/mpa/feed/'+options.id,
      method: 'GET',
      success(res) {
        var nodes = res.data.content.replace(/<img/gi, '<img style="width:100%;"')
          .replace(/<p/gi, '<p style="font-size:24rpx;"');
        var timestamp = that.getTime(res.data.created_at);

        if (!res.data.vote){
          that.setData({
            trendsData: res.data,
            name: app.globalData.name,
            content: nodes,
            timestamp: timestamp,
            commentId: options.id,
            voted:false
          })
        }else{
          that.setData({
            trendsData: res.data,
            name: app.globalData.name,
            content: nodes,
            timestamp: timestamp,
            commentId: options.id,
            voted: true
          })
        }
      }
    })
    // 评论列表数据
    wx.request({
      url: app.globalData.http + '/mpa/comment',
      method: 'GET',
      data:{
        feed_id: options.id
      },
      header: {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})