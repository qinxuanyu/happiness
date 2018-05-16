// pages/myCenter /myCenter.js
const app = getApp();
const url = app.globalData.apiUrl;
const token = wx.getStorageInfoSync("token")||"";
Page({
     
  /**
   * 页面的初始数据
   */
  data: {
    topTab: 1,
    listData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goQrCode:function(e){
    app.globalData.qrCode.id= e.currentTarget.id;
    app.globalData.qrCode.openId = wx.getStorageSync('openId');
    app.globalData.qrCode.type = 1;
    if (this.data.topTab==1){

      wx.navigateTo({
        url: '../qrcode/qrcode'
      })
    }
    console.log(e);
  },
  topTabFun:function(e){
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.setData({
      topTab:e.target.dataset.num,
    })
    this.listRequst()
  },
  listRequst:function(){
    var self = this;
    // console.error(token)
      wx.request({
        url: url + "/businessapi/ticket/auth/myTicket",
        data: { status: self.data.topTab },
        header: {
          token: wx.getStorageSync('token')||"", platform: "web",
        },
        success: function (data) {
          console.log(data);
          self.setData({
            listData: data.data.data,
          })
        }
      })
  },
  onLoad: function (options) {
    // this.listRequst();
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.listRequst();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})