// pages/ticket/ticked.js
const app = getApp();
const url = app.globalData.apiUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponPop:false,
    storeId:null,          //商户id
    listDatas:[]
  },
   
  couponPop_on: function () {
    this.setData({
      couponPop: true
    })
  },
  couponPop_off: function () {
    this.setData({
      couponPop: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getTicked:function(e){
    var token = wx.getStorageSync("token") ||"";
   
      console.log(e);
      var id = e.currentTarget.id;     //优惠券id
      if(!wx.getStorageSync("phone")){
      
        wx.showModal({
          title: '提示',
          content: '您未领取福袋，请先领取福袋',
          success: function (res) {
            console.log(res)
            if (res.confirm) {
              console.log(11111)
              wx.switchTab({
                url: '../index/index',

              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.request({
          url: url + "/businessapi/ticket/auth/getTicket/" + id,
          method: "POST",
          header: {
            platform: "web",
            token: token
          },
          success: res => {
            console.log(res)
            if (res.data.code == 200) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '领取成功',
                success: function (res) { }
              })
            } else if (res.data.code == 1002){
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '你已经领取',
                success: function (res) { }
              })
            } else if (res.data.code == 1008) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '优惠券已过期',
                success: function (res) { }
              })
            }else{
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '领取失败，您未授权登录，你可以重新进入小程序授权登录',
                success: function (res) { }
              })
            }
          }
        })
      }
  },
  onLoad: function () {
    // this.setData({
    //   storeId: options.id
    // })
    // console.log(options)
    let self = this;
    var storeId = app.globalData.storeId;
    wx.request({                  //列表数据
      url: url + "/businessapi/ticket/ticketList/" + storeId,
      success:function(res){
        console.log(res);
        console.log(res.data.data)
        self.setData({
          
          listDatas:res.data.data
        })
        if (res.data.data.length==0){
          wx.showToast({
            title: '没有优惠券哦',
            // mask:true,
            image: '../../images/home_icon_no@3x.png',
            duration: 2000
          })
        }
      }
    })
    
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