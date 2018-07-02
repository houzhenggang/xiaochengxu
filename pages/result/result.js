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
    category_id: '',
    value:''
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
      data: {
        keywords: that.data.value,
        page:that.data.page
      },
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      dataType: 'json',
      method: 'GET',
      success: function (data) {
        var list = that.data.produList.concat(data.data)
          that.setData({
            produList: list
          })
      },
      complete:function(){
        wx.hideLoading()
      }
    })

  },
  // //排序方式点击
  bindRank(e) {
    //当前所点击排序方式
    var that = this
    var currIndex = e.currentTarget.dataset.id;
    var flag = this.data.flag;
    that.setData({
      produList: []
    })
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
  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1000
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
      value: options.keyword,
      inputValue: options.keyword
    })
    wx.setNavigationBarTitle({
      title: options.keyword,
    })
    wx.request({
      url: app.globalData.http + '/mpa/goods/search',
      data: {
        keywords: options.keyword
      },
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      dataType: 'json',
      method: 'GET',
      success: function (data) {
        console.log(data)
        if (data.data.length > 0) {
          that.setData({
            produList: data.data
          })
        } else {
          wx.showToast({
            title: '暂无商品',
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })
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