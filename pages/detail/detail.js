  // pages/detail/detail.js
const app = getApp();
// var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //商品详情数据
    goods: {},
    image: 'http://image.yiqixuan.com/',
    //使用data数据控制类名
    chooseModal: false,
    //动态控制“-”号类名
    minusStatus: "disabled",
    minusStatuss: "normal",
    //上下架
    status:"",
    //规格选择初始数量
    num: 1,
    name: '',
    //加入购物车/立即购买flag
    flag: 1,
    //定义动画
    animationData: {},
    //商品规格数据
    spec: {},
    specType: '',
    chooseSpec: [],
    //是否已选颜色规格
    seleIdxA: -1,
    seleIdxB: -1,
    //具体规格商品
    good:{},
    goodPrice: 0,
    goodUrl: "",
    imgs: {},
    description: '',
    content:'',
    //是否又规格
    isSpec: '',
    current: 0,
    cartNum: 0,
    show: 2,
    //有规格的时候点击确定
    userId:false,
  },
  changeCurrent: function (e) {
    var cur = e.detail.current
    this.setData({
      current: cur
    })
  },
  getPhoneNumber:function(e){
    console.log(e)
    var that=this
    if (e.detail.encryptedData && e.detail.iv){
      wx.login({
        success(code) {
          wx.request({
            url: app.globalData.http + '/mpa/wechat/auth',
            method: 'POST',
            header: {
              'Api-Ext': app.globalData.apiExt
            },
            data: {
              code: code.code
            },
            success: function (res) {
              var codes = res.statusCode.toString()
              if(codes>=200 && codes<300){
                //保存响应头信息
                if (res.header["api-key"] && res.header["api-secret"]) {
                  var apiKey = res.header["api-key"],
                    apiSecret = res.header["api-secret"];
                } else if (res.header["Api-Key"] && res.header["Api-Secret"]) {
                  var apiKey = res.header["Api-Key"],
                    apiSecret = res.header["Api-Secret"];
                }
                app.globalData.apiKey = apiKey
                app.globalData.apiSecret = apiSecret
                wx.request({
                  url: app.globalData.http + '/mpa/user/login',
                  method: 'post',
                  data: {
                    encrypted: e.detail.encryptedData,
                    iv: e.detail.iv
                  },
                  dataType: 'json',
                  header: {
                    "Api-Key": app.globalData.apiKey,
                    "Api-Secret": app.globalData.apiSecret,
                    'Api-Ext': app.globalData.apiExt
                  },
                  success: function (data) {
                     var datas = data.statusCode.toString()
                     if (datas >= 200 && datas < 300) {  
                       if (data.header["api-key"] && data.header["api-secret"]) {
                         var apiKey = data.header["api-key"],
                           apiSecret = data.header["api-secret"];
                       } else if (data.header["Api-Key"] && data.header["Api-Secret"]) {
                         var apiKey = data.header["Api-Key"],
                           apiSecret = data.header["Api-Secret"];
                       }
                       app.globalData.apiKey = apiKey
                       app.globalData.apiSecret = apiSecret
                       app.globalData.userId=true
                       that.setData({
                         userId:true
                       })
                     }else{
                       var tip = data.data.message.toString()
                       wx.showToast({
                         title: tip,
                         icon: 'none',
                         duration: 2000
                       })
                     }
                  }
                })
              } else{
                var tip = res.data.message.toString()
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      })
    }
  },
  /* 规格选择弹出事件 */
  modalShow(e) {
    var that = this;
    let flag = e.currentTarget.dataset.flag;
    // 有规格
    if (that.data.isSpec) {
      //创建一个动画实例
      var animation = wx.createAnimation({
        //动画持续事件
        duration: 500,
        //定义动画效果
        timingFunction: 'linear'
      })
      //将该变量赋值给当前动画
      that.animation = animation;
      //现在Y轴偏移，然后用step()完成一个动画
      animation.translateY(400).step();
      that.setData({
        animationData: animation.export(),
        flag: flag,
        chooseModal: true
      })
      //设置setTimeout改变Y轴偏移量
      setTimeout(function () {
        animation.translateY(0).step();
        that.setData({
          animationData: animation.export()
        })
      }, 100)
    }
    else {
      wx.request({
        url: app.globalData.http + '/mpa/goods/' + that.data.goods.id + '/skus',//////////////////////////////////////请求路径需改动
        method: "GET",
        header: {
          'Api-Ext': app.globalData.apiExt
        },
        success(res) {
          var good = res.data[0]
          that.setData({
            good: good,
            goodUrl: good.cover_url,
            goodPrice: good.price
          }, function () {
            //加入购物车
            if (flag == 1) {
              //绑定手机号
              if (app.globalData.userId){
                wx.request({
                  url: app.globalData.http + '/mpa/cart',
                  method: "POST",
                  data: {
                    goods_sku_id: that.data.good.id,
                    count: 1
                  },
                  header: {
                    'Api-Ext': app.globalData.apiExt,
                    "Api-Key": app.globalData.apiKey,
                    "Api-Secret": app.globalData.apiSecret
                  },
                  success(res) {
                    var code = res.statusCode.toString()
                    if (code == 500) {
                      wx.showToast({
                        title: '网络错误',
                        icon: 'none',
                        duration: 1000
                      })
                    } else if (code.indexOf('40') > -1) {
                      var tip = res.data.message.toString()
                      wx.showToast({
                        title: tip,
                        icon: 'none',
                        duration: 1000
                      })
                    }
                    else {
                      wx.showToast({
                        title: '加入购物车成功',
                        icon: "success"
                      })
                      wx.request({
                        url: app.globalData.http + '/mpa/cart/count',
                        header: {
                          'Api-Ext': app.globalData.apiExt,
                          "Api-Key": app.globalData.apiKey,
                          "Api-Secret": app.globalData.apiSecret,
                        },
                        method: 'get',
                        success(res) {
                          that.setData({
                            cartNum: res.data
                          })
                        }
                      })
                    }
                  }
                })
              }else{
                var local=wx.getStorageSync('good')
                var good = that.data.good
                var cartNum = that.data.cartNum
                good.count = 1;
                good.goods_sku_id = that.data.good.id;
                good.name = that.data.name;
                good.sku_description = '';
                //本地购物车不为空
                if (local.length>0){
                  var ishava = local.every(function (v, i) {
                    return v.id != that.data.good.id
                  })
                  if (ishava) {
                    local.push(good)
                    cartNum++
                  } 
                  else {
                    for(var i=0;i<local.length;i++){
                      if (local[i].id == good.goods_sku_id) {
                        local[i].count = parseInt(local[i].count) + 1
                      }
                    }
                  }
                  wx.setStorage({
                    key: 'good',  
                    data: local,
                  })
                  that.setData({
                    cartNum: cartNum
                  })
                }else{
                  var goods=[]
                  goods.push(good)
                  wx.setStorage({
                    key: 'good',
                    data: goods,
                  })
                  that.setData({
                    cartNum:1
                  })
                }
                wx.showToast({
                  title: '加入购物车成功',
                  icon: "success"
                })
              }  
            } else {
              var good = that.data.good
              good.count = 1;
              good.goods_sku_id = that.data.good.id;
              good.name = that.data.name;
              good.sku_description = 0;
              if (flag == false) {
                gloGood.push(good)
              }
              app.globalData.good = []
              app.globalData.good.push(good)
              wx.navigateTo({
                url: '/pages/surePay/surePay',
              })
            }
          })
        }
      })
    }
  },
  closeTips: function () {
    var that = this
    //动画效果
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(450).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseModal: false
      })
    }, 500)
  },


  //点击确认，关闭弹出框
  closeModal(e) {
    var that = this
    var chooseAll = that.data.chooseSpec.every(function (val) {
      return val !== -1
    })
    if (!chooseAll) {
      wx.showToast({
        title: '请选择规格',
        icon: "none"
      })
      return false
    }
    //动画效果
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(450).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseModal: false
      })
    }, 500)
    //跳转页面,携带参数
    let clickId = e.currentTarget.dataset.id;

    if(JSON.stringify(that.data.good)!='{}'){
      //如果来源为加入购物车，即flag为1
      let flag = that.data.flag;
      if (clickId == 1 && flag == 1) {
        //绑定手机号
        if (that.data.userId) {
          wx.request({
            url: app.globalData.http + '/mpa/cart',
            method: "POST",
            header: {
              'Api-Ext': app.globalData.apiExt,
              "Api-Key": app.globalData.apiKey,
              "Api-Secret": app.globalData.apiSecret,
            },
            data: {
              goods_sku_id: that.data.good.id,
              count: that.data.num
            },
            success(res) {
              var code = res.statusCode.toString()
              if (code >= 200 && code < 300) {
                wx.showToast({
                  title: '加入购物车成功',
                  icon: "success"
                })
                wx.request({
                  url: app.globalData.http + '/mpa/cart/count', /////////////////////////////////////////////////goods后的传参需为 options.id，测试参数
                  header: {
                    'Api-Ext': app.globalData.apiExt,
                    "Api-Key": app.globalData.apiKey,
                    "Api-Secret": app.globalData.apiSecret,
                  },
                  method: 'get',
                  success(res) {
                    that.setData({
                      cartNum: res.data
                    })
                  }
                })
              } else {
                var tip = res.data.message.toString()
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else {
          var goods = that.data.good
          var local = wx.getStorageSync('good')
          var cartNum = that.data.cartNum
          goods.count = that.data.num
          goods.goods_sku_id = goods.id
          goods.name = that.data.goods.name
          goods.isSelect = false
          if (that.data.chooseSpec.length == 1) {
            goods.sku_description = goods.spec_a + ':' + goods.property_a
          } else if (that.data.chooseSpec.length == 2) {
            goods.sku_description = goods.spec_b + ':' + goods.property_b + ',' + goods.spec_a + ':' + goods.property_a
          } else if (that.data.chooseSpec.length == 3) {
            goods.sku_description = goods.spec_b + ':' + goods.property_b + ',' + goods.spec_a + ':' + goods.property_a + ',' + goods.spec_c + ':' + goods.property_c
          }

          if (local.length > 0) {
            var ishava = local.every(function (v, i) {
              return v.id != that.data.good.id
            })
            if (ishava) {
              local.push(goods)
              cartNum++
            }
            else {
              for (var i = 0; i < local.length; i++) {
                if (local[i].id == goods.goods_sku_id) {
                  local[i].count = parseInt(local[i].count) + goods.count
                }
              }
            }
            wx.setStorage({
              key: 'good',
              data: local,
            })
            that.setData({
              cartNum: cartNum
            })
          } else {
            var goodlist = []
            goodlist.push(goods)
            wx.setStorage({
              key: 'good',
              data: goodlist,
            })
            that.setData({
              cartNum: 1
            })
          }
          wx.showToast({
            title: '加入购物车成功',
            icon: "success"
          })
        }
      } else if (clickId == 1 && flag == 2) {//来源为立即购买，即flag为2
        //将商品信息、数量保存到app
        let good = that.data.good;
        good.count = that.data.num;
        good.goods_sku_id = that.data.good.id;
        good.name = that.data.name;
        if (that.data.chooseSpec.length == 1) {
          good.sku_description = good.spec_a + ':' + good.property_a
        } else if (that.data.chooseSpec.length == 2) {
          good.sku_description = good.spec_b + ':' + good.property_b + ',' + good.spec_a + ':' + good.property_a
        } else if (that.data.chooseSpec.length == 3) {
          good.sku_description = good.spec_b + ':' + good.property_b + ',' + good.spec_a + ':' + good.property_a + ',' + good.spec_c + ':' + good.property_c
        }
        if (flag == false) {
          gloGood.push(good)
        }
        app.globalData.good = []
        app.globalData.good.push(good)
        wx.navigateTo({
          url: '/pages/surePay/surePay',
        })
      }
    }
  },
  /* 点击减号 */
  bindMinus() {
    var num = this.data.num;
    //num大于1时才做自减
    if (num > 1) {
      num--
    }
    //大于1件时为normal状态，否则为disabled状态
    var minusStatus = num <= 1 ? "disabled" : "normal";
    this.setData({
      num: num,
      minusStatus: minusStatus,
      minusStatuss: 'normal'
    })
  },
  bindPlus() {
    var num = this.data.num;
    if (num >= this.data.good.stock_count) {
      var minusStatus = 'disabled'
    } else {
      num++
      var minusStatus = 'normal'

    }
    this.setData({
      num: num,
      minusStatus: 'normal',
      minusStatuss: minusStatus
    })
  },

  //选择规格事件
  chooseSpecs(e) {
    let that = this;
    var chooseAll;
    //已选择规格索引
    var aIndex = e.target.dataset.id,
      bIndex = e.target.dataset.index;
    var aArr = that.data.specType,
      bArr = that.data.spec;
    //已选择规格种类
    var textSpec = 'chooseSpec[' + aIndex + ']'
    that.setData({
      [textSpec]: bIndex,
      good:{},
      num: 1
    }, function () {
      var chooseAll = that.data.chooseSpec.every(function (v) {
        return v > -1
      })
      if(chooseAll){
        wx.request({
          url: app.globalData.http + '/mpa/goods/' + that.data.goods.id + '/skus',//////////////////////////////////////请求路径需改动
          method: "GET",
          header: {
            'Api-Ext': app.globalData.apiExt
          },
          success(res) {
            //判断是否所有规格都选择了
            var good;
            var ress = res.data
            for (var i = 0; i < that.data.chooseSpec.length; i++) {
              for (var j = 0; j < ress.length; j++) {
                if (that.data.chooseSpec.length == 1) {
                  if (ress[j].property_a == bArr[0]['propertis'][that.data.chooseSpec[0]]) {
                    good = ress[j];
                  }
                } else if (that.data.chooseSpec.length == 2) {
                  if (ress[j].property_a == bArr[0]['propertis'][that.data.chooseSpec[0]] && ress[j].property_b == bArr[1]['propertis'][that.data.chooseSpec[1]]) {
                    good = ress[j];
                  }
                } else if (that.data.chooseSpec.length == 3) {
                  if (ress[j].property_a == bArr[0]['propertis'][that.data.chooseSpec[0]] && ress[j].property_b == bArr[1]['propertis'][that.data.chooseSpec[1]] && ress[j].property_c == bArr[2]['propertis'][that.data.chooseSpec[2]]) {
                    good = ress[j];
                  }
                }
              }
            }
            if (good.stock_count>0) {
              that.setData({
                good: good,
                goodUrl: good.cover_url,
                goodPrice: good.price
              })
            }else{
              wx.showToast({
                title: '该规格库存不足',
                icon:'none',
                duration:2000
              })
            }
          }
        })
      }
    })
  },

  //定义分享转发
  onShareAppMessage: function (res) {
    if (res.from === "button") {
    }
    return {
      title: this.data.goods.name,
      path: "/pages/shareDetail/shareDetail?id=" + this.data.goods.id,
      imageUrl: this.data.image + this.data.imgs[0].icon_url,
      success(res) {
      }
    }
  },
  //点击购物车
  goCart() {
    wx.navigateTo({
      url: '/pages/cart/cart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow:function(){
    var that=this
    //获取购物车数量
    var goodlist = wx.getStorageSync('good')
    that.setData({
      userId: app.globalData.userId
    })
    if (app.globalData.userId){
      wx.request({
        url: app.globalData.http + '/mpa/cart/count', /////////////////////////////////////////////////goods后的传参需为 options.id，测试参数
        header: {
          'Api-Ext': app.globalData.apiExt,
          "Api-Key": app.globalData.apiKey,
          "Api-Secret": app.globalData.apiSecret,
        },
        method: 'get',
        success(res) {
          that.setData({
            cartNum: res.data
          })
        }
      })
    }else{
      that.setData({
        cartNum: goodlist.length
      })
    }
  },
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取商品规格详情
    wx.request({
      url: app.globalData.http + '/mpa/goods/' + options.id + '/specs',///////////////////////////////测试路径，1需改为 that.data.goods.id
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(data) {
        if (Object.prototype.toString.call(data.data) == '[object Array]') {
          that.setData({
            isSpec: false
          })
        } else {
          var specs = []
          var specType = []
          for (var key in data.data) {
            specs.push(data.data[key])
            specType.push(key)
          }
          var chooseSpec = []
          for (var i = 0; i < specType.length; i++) {
            chooseSpec.push(-1)
          }
          that.setData({
            spec: specs,
            specType: specType,
            chooseSpec: chooseSpec,
            isSpec: true
          })
        }
      }
    })

    //获取商品详情
    wx.request({
      url: app.globalData.http + '/mpa/goods/' + options.id, /////////////////////////////////////////////////goods后的传参需为 options.id，测试参数
      header: {
        'Api-Ext': app.globalData.apiExt
      },
      success(res) {
        wx.hideLoading();
        if (JSON.stringify(res.data) != '{}') {
          that.setData({
            goods: res.data,
            goodUrl: res.data.cover_url,
            goodPrice: res.data.price,
            imgs: res.data.images,
            name: res.data.name,
            show: 1,
            status: res.data.status
          })
          if (res.data.detail) {
            that.setData({
              content: res.data.detail.content.replace(/\<img style="max-width:750.0px;"/gi, '<img style="width:100%;height:auto" ').replace(/750.0px/gi, '100%').replace(/width="\d+"/gi, '').replace(/height="\d+"/gi, '').replace(/\s+id/gi,' class'),
            })
          }
        }else{
          wx.showToast({
            title: '该商品已找不到',
            icon:'none',
            duration:2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '暂无网络',
          icon: 'none'
        })
        wx.hideLoading();
      }
    })
  }
})