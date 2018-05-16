// pages/list/list.js
const app = getApp();
const url = app.globalData.apiUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketId:"",                 //超市id
    createTime:"",            //创建时间，用来调列表数据
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  pullUp:function(){
    
  },
  listRequest:function(){
    var self = this;
    wx.request({
      url: url + '/businessapi/home/marketList/' + this.data.marketId,
      data: { token: "", platform: "web", marketId: this.data.marketId, createTime: this.data.createTime, size: 10 },
      success: function (res) {
        console.error(res);
        var _info = self.data.dataList.concat(res.data.data)
        self.setData({
          dataList: _info
        })
      }
    })
  },
  list_href:function(e){
    var id = e.currentTarget.id;
    app.globalData.storeId = id;
    wx.navigateTo({
      url: '../ticked/ticked'
    })
  },
  onLoad: function (options) {
   
    this.setData({
      marketId: options.id
    })
    this.listRequest();
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