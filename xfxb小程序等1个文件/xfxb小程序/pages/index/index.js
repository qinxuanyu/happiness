// pages/index/index.js
const app = getApp();
const url = app.globalData.apiUrl;
const token = wx.getStorageSync("token")||"";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheights: "",
    //图片宽度  
    imgwidth: 750,
    popShow:false,                //福袋弹窗
    couponPop:false,             //领取成功弹窗
    layerShow:false,
    listData:[],
    createTime: "",               //创建时间,用来调列表数据
    bannerL:[],                  //轮播图
    couponData:[],                //优惠券数据
    isAjax:true              //用来触发下拉事件
  },
 
  popShow_on:function(){
      this.setData({
        popShow:true,
        layerShow: true,
      })
     
  },
  popShow_off: function () {
    this.setData({
      popShow: false,
      layerShow: false,
    })

  },
  couponPop_on: function () {   //优惠券
    this.setData({
      couponPop: true,
      layerShow: true,
    })
  },
  couponPop_off: function () {   //优惠券
    this.setData({
      couponPop: false,
      layerShow: false,
    })
  }, 
  RichScan:function(){             //扫一扫
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        if(res.errMsg = 'scanCode:ok'){
          var obj = JSON.parse(res.result)
          if (obj.type==2){       //成为管理员
            wx.request({
              url: url + '/businessapi/user/auth/beCashier',
              method:"PUT",
              header: {
                token: wx.getStorageSync("token")||"",
                platform: "web"
              },
              success: res => {
                console.error(res);
                if(res.data.code==200){
                     wx.showModal({
                      title: '提示',
                      showCancel: false,
                      content: '您已成为收银员',
                      success: function (res) { }
                    })
                }
               
              }
            })
          } else if (obj.type == 1){    //让优惠券失效
            console.error(typeof obj)
            console.error(obj)
             wx.request({
               url: url +'/businessapi/ticket/auth/scan',
               method: "PUT",
               header:{
                  "token": wx.getStorageSync("token")||"",
                  platform:"web"
                },
              data: { openId: obj.openId, ticketId: obj.id},
              success:res=>{
                console.error(res);
                if (res.data.code == 200) {
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '优惠码使用成功',
                    success: function (res) { }
                  })
                } else if (res.data.code == 1004){
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '你不是收银员',
                    success: function (res) { }
                  })
                }
                else{
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '优惠码已失效',
                    success: function (res) { }
                  })
                }
              }
             })
          }

        }
      }
    })
  },
  listHref:function(e){
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '../list/list?id='+id
    })
  },
  tickedHref:function(e){
    console.error(e.currentTarget.id);
    app.globalData.storeId = e.currentTarget.id;
     wx.navigateTo({
       url: '../ticked/ticked'
     })
  },
  pulUp:function(){          //上拉到底部触发函数
    this.list_request();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    })
    console.log(1);
  },
  list_request:function(){
    var self = this;
    if (self.data.isAjax){
      self.data.isAjax = false;
      wx.request({
        url: url + "/businessapi/home/marketList",
        data: { token: "", platform: "web", createTime: this.data.createTime, size: 5 },
        success: function (res) {
          self.data.isAjax = true;
          console.log(res.data.data);
          var _info = self.data.listData.concat(res.data.data);
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '暂无数据',
              // mask:true,
              image: '../../images/home_icon_no@3x.png',
              duration: 2000
            })

          } else {
            self.setData({
              listData: _info,
              createTime: res.data.data[res.data.data.length - 1].createTime
            })
          }

        }
      })
    }
    
  },
  luckyBag:function(){             //领取福袋
      var self = this;
      wx.request({
        url: url +"/businessapi/ticket/auth/happyBag",
        method: "POST",
        header:{
          token:wx.getStorageSync("token")||"",
          platform:"web"
        },
        success:res=>{
          console.log(res);
          if(res.data.code==200){
            self.setData({
              couponData: res.data.data,
            })
            self.popShow_off();
            self.couponPop_on();
            app.onLaunch();
           
          }else{
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '领取失败，您未授权，你可以重新进入小程序授权登录',
              success: function (res) { }
            })
          }
        }
      })
  },
  getPhoneNumber: function (e) {
    var self = this;
   
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    console.error(token)
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权获取手机号，您将不能领取福袋和优惠券',
          success: function (res) { }
        })
      } else {
        // wx.showModal({
        //   title: '提示',
        //   showCancel: false,
        //   content: '同意授权',
        //   success: function (res) { 
        //     self.popShow_on();
        //   }
        // })
       
        if (wx.getStorageSync("phone")==null) {   //未绑定手机号
          wx.request({
            url: url + "/businessapi/user/auth/userPhone",
          
            data: { iv: e.detail.iv, encryptedData: e.detail.encryptedData },
            header: { token: wx.getStorageSync('token') ||"", platform: "web" },
            success: res => {
              console.log(res);
              if (res.data.code == 200) {
                self.luckyBag();
              }
            }
          })
        } else {
          console.error(11)
          self.luckyBag();
        } 
        
      


      }
    
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    this.list_request();
    var self = this;
    wx.request({
      url: url + "/businessapi/home/rotateImages",
      data: { platform: "web", token: "" },
      success: function (res) {
        console.log(res);
        if (res.data.data.length > 0) {
          self.setData({
            banner: res.data.data
          })
        }
      }
    })
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