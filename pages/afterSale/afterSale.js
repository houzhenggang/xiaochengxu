// pages/afterSale/afterSale.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    reasonID:5,
    saleArr:[],
    orderId:'',
    info:'',
    num:0,
    reasonText:'其它 >',
    reason:[
      '物流太慢/收货太迟',
      '发错货',
      '尺码偏小',
      '尺码偏大',
      '脏污/色差',
      '其他'
    ],
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id=options.id;
    this.setData({
      orderId:id
    })
    wx.request({
      url: 'http://homestead.yqx.com/mpa/order/' + id,
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        var newArr=[]
        var item = data.data.items
        var sale=[]
        item.forEach(function(v,i){ 
          Object.assign(v,{isSelect:true})
          newArr.push(v)
          sale.push(v.id)
        })
        that.setData({
          info:newArr,
          num: newArr.length,
          saleArr:sale
        })
      }
    })

  },
  callPhone: () => {
    wx.makePhoneCall({
      phoneNumber: '13547831113'
    })
  },
  select:function(event){
    var that=this
    var index=event.target.dataset.index
    var num = 'info[' + index + '].isSelect'
    var s=that.data.info[index].isSelect
    var n=that.data.num
    var sale = that.data.saleArr
    var newSale=[]
    if (that.data.info[index].isSelect){
      n--
    }else{
      n++
    }


    if (sale.indexOf(that.data.info[index].id)>-1){
        sale.forEach(function(v,i){
          if (v !== that.data.info[index].id){
              newSale.push(v)
          }
        })
        sale=newSale
    }else{
        sale.push(that.data.info[index].id)
    }
    that.setData({
      [num]:!s,
      num:n,
      saleArr:sale
    })
  },
  /*提交申请*/
  submit:function(){
    var that=this;
    var apiKeys = wx.getStorageSync('Api-Key')
    var apiSecrets = wx.getStorageSync('Api-Secret')
    wx.request({
      url: 'http://192.168.10.158/mpa/after_sale',
      method:"POST",
      dataType:'json',
      data:{
        order_id: that.data.orderId,
        reason: that.data.reasonID,
        remark: that.data.value,
        order_item_ids:that.data.saleArr
      },
      header: {
        "Api-Key": apiKeys,
        "Api-Secret": apiSecrets
      },
      success:function(data){
        console.log(data)
        wx.navigateTo({
          url: '/pages/refundDetail/refundDetail?id=' + that.data.orderId
        })
      }
    })
  },
  /*选择原因*/
  selectReason:function(){
      var that=this;
      that.setData({
        isShow:false
      })
  },
  /*关闭选择原因*/
  closeReason:function(){
      this.setData({
        isShow:true
      })
  },

  remark:function(event){
    var value = event.detail.value
    this.setData({
        value:value
    })
  },
  /*选择退货原因*/
  chooseReason:function(event){
      var that=this;
      var id=event.target.dataset.reasonid;
      console.log(id);
      this.setData({
        reasonID:id,
        reasonText: that.data.reason[id]+' >',
        isShow: true
      })
  }
})