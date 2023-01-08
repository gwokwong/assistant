// pages/payment/payment.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: '',
        principal:19.74 ,      //贷款总额
        months: 315,      //贷款期限
        aheadPrincipal: 5,      //提前还款金额
        payTimes: 0,      //已还次数
        rate: 5.87,      //贷款利率
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // inputPrincipal:function(value){
    //     this.setData({
    //         principal:value
    //     })
    //     console.log(value);
    // },
    // inputprincipal:function (){
    //     console.log('点击到了这里')
    // },

    inputprincipal: function (e) {
        this.setData({
            principal: e.detail.value
        })
    },

    inputmonths: function (e) {
        this.setData({
            months: e.detail.value
        })
    },

    inputrate: function (e) {
        this.setData({
            rate: e.detail.value
        })
    },
    inputpayTimes: function (e) {
        this.setData({
            payTimes: e.detail.value
        })
    },
    inputaheadPrincipal: function (e) {
        this.setData({
            aheadPrincipal: e.detail.value
        })
    },
    calculation: function () {
        var that = this
        console.log('点击了计算' + that.data.principal)
        var att = util.calculateEqualPrincipalAndInterestApart2
            (that.data.principal * 10000,
                that.data.months,
                that.data.aheadPrincipal * 10000,
                that.data.payTimes,
                that.data.rate);
        console.log(att);
        that.setData({
            result: att
        })
    },
})