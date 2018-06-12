
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const checkLogin= () =>{
  var timeStamp = wx.getStorageSync('timeStamp')
  var nowTimeStamp = Date.parse(new Date());
  var apiKey = wx.getStorageSync('apiKey')
  var apiSecret = wx.getStorageSync('apiSecret')
  var apiExt = wx.getStorageSync('apiExt')
  var userId = wx.getStorageSync('userId')
  let that = this;
  if (timeStamp + 24 * 60 * 60 * 1000 > nowTimeStamp && apiExt && apiSecret && apiKey && userId) {
    this.setData({
      apiKey: apiKey,
      apiSecret: apiSecret,
      apiExt: apiExt
    })
    return true
    }
    else{
      wx.login({
        success(code) {
          //向后台发起请求，传code
          wx.request({
            url: 'https://test.yiqixuan.com/mpa/wechat/auth',
            method: 'POST',
            data: {
              code: code.code
            },
            header: {
              'Api-Ext':apiExt
            },
            success: function (res) {
              //保存响应头信息
              var apiKey = res.header["Api-Key"],
                apiSecret = res.header["Api-Secret"];
              //设置storage
              //获取时间戳保存storage
              let timestamp = Date.parse(new Date());
              wx.setStorage({
                key: 'apiKey',
                data: apiKey,
              })
              wx.setStorage({
                key: 'timestamp',
                data: timestamp,
              })
              wx.setStorage({
                key: 'apiSecret',
                data: apiSecret,
              })
              if (!res.data.user_id) {
                wx.navigateTo({
                  url: "/pages/regMob/regMob"
                })
              } else {
                wx.setStorage({
                  key: 'userId',
                  data: res.data_id,
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
