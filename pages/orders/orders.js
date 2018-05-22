Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    allOrder:[
      {
        time:'2018-21-12 23:12:12',
        preprice: '35.00',
        img: "/imgs/tupian.png",
        title: '2018春夏秋冬女高腰物探耳扣我和覅说的话覅u',
        size: '颜色：深黑；尺码：M；',
        num: '1',
        price:'234.00'
      },
      {
        time: '2018-21-12 23:12:12',
        preprice: '35.00',
        img: "/imgs/tupian.png",
        title: '2018春夏秋冬女高腰物探耳扣我和覅说的话覅u',
        size: '颜色：深黑；尺码：M；',
        num: '1',
        price: '234.00'
      },
       {
        time: '2018-21-12 23:12:12',
        preprice: '35.00',
        img: "/imgs/tupian.png",
        title: '2018春夏秋冬女高腰物探耳扣我和覅说的话覅u',
        size: '颜色：深黑；尺码：M；',
        num: '1',
        price: '234.00'
      }, 
      {
        time: '2018-21-12 23:12:12',
        preprice: '35.00',
        img: "/imgs/tupian.png",
        title: '2018春夏秋冬女高腰物探耳扣我和覅说的话覅u',
        size: '颜色：深黑；尺码：M；',
        num: '1',
        price: '234.00'
      },
       {
        time: '2018-21-12 23:12:12',
        preprice: '35.00',
        img: "/imgs/tupian.png",
        title: '2018春夏秋冬女高腰物探耳扣我和覅说的话覅u',
        size: '颜色：深黑；尺码：M；',
        num: '1',
        price: '234.00'
      }, 
      {
        time: '2018-21-12 23:12:12',
        preprice: '35.00',
        img: "/imgs/tupian.png",
        title: '2018春夏秋冬女高腰物探耳扣我和覅说的话覅u',
        size: '颜色：深黑；尺码：M；',
        num: '1',
        price: '234.00'
      }
    ],
    daifukuan:[],
    daifahuo:[],
    daishouhuo:[],
    yishouhuo:[],
    shouhou:[]
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      currentTab:options.type
    })
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onReachBottom:()=>{
      console.log(666);
      
  },
  onPullDownRefresh:()=>{
    console.log(111);
  }
})  