App({
  
  
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
 data:{
   avatarUrl:null,
   nickName:null,
 },
  onLaunch: function () {
    

    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    var self = this;
    // wx.getSetting({
    //   success:res=>{

    //     if (res.authSetting['scope.userInfo']){    
    wx.getUserInfo({
      withCredentials: false,
      lang: "zh_CN",
      success: function (res) {
        console.log(res);
        var userInfo = res.userInfo;
        self.data.nickName = userInfo.nickName;
        self.data.avatarUrl = userInfo.avatarUrl;
        var gender = userInfo.gender; //性别 0：未知、1：男、2：女
        var province = userInfo.province;
        var city = userInfo.city;
        var country = userInfo.country;
        wx.login({
          success: function (res) {
            if (res.code) {
              var code = res.code;
              var obj = {
                code: code,
                imageUrl: self.data.avatarUrl,
                name: self.data.nickName
              };
              wx.request({
                url: 'https://yihubaiying.org/businessapi/user/login',
                data: obj,
                method: "POST",
                header: {
                  //  "Content-Type":"application/json;charset=UTF-8",
                  "platform": "web"
                },
                success: res => {
                  console.log(res);
                  if(res.data.code = 200){
                    wx.setStorageSync("token", res.data.data.token);
                    wx.setStorageSync("phone", res.data.data.phone);
                    wx.setStorageSync("openId", res.data.data.openId);
                  }
                 
                  // wx.setStorage({
                  //   key: "token",
                  //   data: res.data.data.token
                  // })

                }
              })

              console.log(res)
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }, fail: function () {
        wx.showModal({
          title: '提示',
          content: '授权登录后才能领取福袋和优惠券',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  console.log(1111)
                  /*
                  * res.authSetting = {
                  *   "scope.userInfo": true,
                  *   "scope.userLocation": true
                  * }
                  */
                  self.onLaunch();
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    });
    //     }
    //   }
    // })

    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.error("未过期")
      },
      fail: function () {
        //登录态过期



      }
    })
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  //全局变量
  globalData: {
    userInfo: null,
    apiUrl: 'https://yihubaiying.org',
    storeId:null,         //商户id
    qrCode:{}             //二维码数据
  }
   
})

