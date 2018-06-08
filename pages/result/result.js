// pages/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    produList: [],
    image: 'http://image.yiqixuan.com/',
    //排序方式
    rank: 0,
    //flag控制上下箭头类名
    flag: 0,
    page: 0,
    category_id: ''
  },
  //商品点击
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name,
    })
  },

  getList: function (order_by) {
    var that = this
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.http + '/mpa/goods/search',
      data: {///////////////////////////////////////////////////////id需改动
        category_id: that.data.category_id,
        order_by: that.data.order_by,
        page: that.data.page
      },
      success(res) {
        that.setData({
          produList: res.data
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })

  },
  //排序方式点击
  bindRank(e) {
    //当前所点击排序方式
    var that = this
    var currIndex = e.currentTarget.dataset.id;
    var flag = this.data.flag;
    //判断价格排序方式
    if (currIndex == 2) {
      if (flag == 0 || flag == 2) {
        flag = 1
        //按价格降序
        that.setData({
          order_by: 'price desc',
          page: 0
        })
        this.getList()

      } else if (flag == 1) {
        flag = 2
        //按价格升序
        that.setData({
          order_by: 'price asc',
          page: 0
        })
        this.getList()
      }
    } else if (currIndex == 1) {
      //按销量排序
      that.setData({
        order_by: 'sales_count desc',
        page: 0
      })
      this.getList()
      flag = 0
    } else {
      that.setData({
        order_by: 'created_at desc',
        page: 0
      })
      this.getList()
      flag = 0
    }
    //存入data
    this.setData({
      rank: currIndex,
      flag: flag
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    that.setData({
      category_id: options.id
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    wx.request({
      url: app.globalData.http + '/mpa/goods/search',
      data: {///////////////////////////////////////////////////////id需改动
        category_id: options.id,
        page: that.data.page
      },
      success(res) {
        that.setData({
          produList: res.data
        })
        wx.hideLoading();
      }
    })
  },
  onPullDownRefresh: function () {
    var pages = that.data.page
    pages++
    that.setData({
      page: pages
    })
    this.getList()
  },
  onReachBottom: function () {
    var pages = that.data.page
    pages++
    that.setData({
      page: pages
    })
    this.getList()
  }
})