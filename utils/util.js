const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function login(res,code){
    var userInfo = res.userInfo;
    //向后台发起请求，传code
    wx.request({
      url: 'http://192.168.10.99/mpa/wechat/auth',
      method: 'POST',
      data: {
        code: code.code
      },
      success: function (res) {
        //保存响应头信息
        var apiKey = res.header["Api-Key"],
          apiSecret = res.header["Api-Secret"];
          //设置storage
          //获取时间戳保存storage
          let timestamp = Date.parse(new Date());
          wx.setStorage({
            key: 'Api-Key',
            data: apiKey
          })
          wx.setStorage({
            key: 'timestamp',
            data: timestamp,
          })
          wx.setStorage({
            key: 'Api-Secret',
            data: apiSecret
          })
          //判断是否又userid
          if(res.data.id){
              wx.setStorage({
                key: 'userId',
                data: res.data.id,
              })
              wx.request({
                url: 'http://192.168.10.99/mpa/wechat/'+res.data.id,
                method:"PUT",
                data:{
                  "nick_name":userInfo.nickName,
                  "avatar_url":userInfo.avatarUrl,
                  "gender":userInfo.gender,
                  "city":userInfo.city,
                  "province":userInfo.province,
                  "country":userInfo.country,
                  "language":userInfo.language
                },
                header:{
                  "Api-Key":apiKey,
                  "Api-Secret":apiSecret
                },
                success(res){
                  console.log(111)
                },
                fail(res){
                  console.log(222)
                }
              })
          }else{
            wx.navigateTo({
              url: "pages/regMob/regMob"
            })
          }
         
        }
    })
}

const checkLogin= () =>{
    var timestamp;
    var newTimestamp=new Date().getTime();

    wx.getStorage({
      key: 'timestamp',
      success: function(res) {
        timestamp=res.data;
      } 
    })
    console.log(111)
    if (timestamp && timestamp+6*60*60*1000>newTimestamp){}
    else{
       wx.login({
          success(code){
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(code)
            //获取用户信息，拿到userInfo
           wx.getSetting({
             success: response=> {
                console.log(222)
                console.log(response)
                // 判断用户是否授权获取用户信息
                if (!response.authSetting['scope.userInfo']){
                  console.log(666)
                  wx.authorize({
                    scope: 'scope.userInfo',
                    success:function(data) {
                      console.log(data)
                      // 用户已经同意小程序获取用户信息
                      wx.getUserInfo({
                        withCredentials: true,
                        success:function(res){
                          console.log(res)
                            login(res,code)
                        }
                      })
                    },
                    fail:function(data){
                      console.log(data)
                    }

                  })
                }else{
                    wx.getUserInfo({
                      withCredentials: true,
                      success:function(res){
                        login(res,code)
                      }
                    })
                }
              }
            })
          }
        })            
    }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  checkLogin: checkLogin
}
