// index.js
const app = getApp()
var util = require('../../utils/util.js')

Page({
    data: {
        showToast: false,
        vn30Index: '', //VN30 指数
        vn30Timer: '', //定时器名称
        vn30IndexStyle: '', // 默认样式不改
        vn30IndexRefreshTime: '', //刷新时间
        vn30IndexResult: false, //是否请求成功
        waveStyle: '', //中心圆
        circleStyle: '', //外面最大圆的样式

        xopIndex: '',//xop指数
        xopTimer: '',//xop定时器名称
        xopIndexStyle: '',//xop定时器名称
        xopIndexResult: false, //是否请求成功
        xopWaveStyle: '', //中心圆
        xopCircleStyle: '', //外面最大圆的样式
        xopIndexRefreshTime: '',//刷新时间
    },
    onLoad() {
        var that = this
        that.startVn30()
        that.getVn30()
        that.getSPDR()
        that.startXop()
    },

    /**定时获取vn30指数信息 */
    startVn30: function () {
        var that = this
        var timerTem = setTimeout(function () {
            var n = new Date(); //当前时间
            var nowHours = parseInt(n.getHours())
            if (nowHours > 9 && nowHours < 17) { //判断当前时间
                that.getVn30()
                that.startVn30()
            } else if (!that.data.vn30IndexResult) {
                //可能第一次请求不成功
                // console.log('可能第一次请求不成功')
                that.getVn30()
                that.startVn30()
            } else {
                // console.log('时间范围不在10点-16点之间')
            }
        }, 20000) //20秒更新一次
        that.setData({
            vn30Timer: timerTem
        })
    },
    /**定时获取xop指数信息 */
    startXop: function () {
        var that = this
        var timerTem = setTimeout(function () {
            var n = new Date(); //当前时间
            var nowHours = parseInt(n.getHours())
            if (nowHours > 20 || nowHours < 5) { //判断当前时间
                that.getSPDR()
                that.startXop()
            } else if (!that.data.xopIndexResult) {
                //可能第一次请求不成功
                // console.log('可能第一次请求不成功')
                that.getSPDR()
                that.startXop()
            } else {
                console.log('xop时间范围不在10点-16点之间')
            }
        }, 20000) //20秒更新一次
        that.setData({
            xopTimer: timerTem
        })
    },

    /**关闭定时器 */
    endTimer: function () {
        var that = this;
        clearTimeout(that.data.vn30Timer) // 关闭vn30指数
        clearTimeout(that.data.xopTimer) // 关闭xop
    },
    /**
     * 获取vn30指数
     */
    getVn30: function (isShowToast) {
        var that = this
        wx.request({
            url: 'https://wallstreetcn.com/markets/VNI30.OTC',
            complete() { },
            fail() { },
            success(result) {
                var result_str = result.data;
                var status = ''
                //指数
                var pos1 = result_str.lastIndexOf('price-lastpx'); //指数
                if (pos1 > 1) {
                    var indexTxt = result_str.substring(pos1, pos1 + 230)
                    var index = indexTxt.substring(indexTxt.indexOf('>') + 1, indexTxt.indexOf('<'))
                    // console.log("txt is" + indexTxt);
                    if (indexTxt.indexOf('gt') > 1) {
                        status = 'gt'
                    } else if (indexTxt.indexOf('lt')) {
                        status = 'lt'
                    } else {

                    }
                    switch (status) {
                        case 'lt':
                            that.setData({
                                vn30IndexStyle: 'color:white',
                                circleStyle: 'box-shadow: 0 0 0 5px #4CAF50;',
                                waveStyle: 'background-color: #4CAF50; box-shadow: inset 0 0 50px #4CAF50;'
                            })
                            break;
                        case 'gt':
                            that.setData({
                                vn30IndexStyle: 'color:white',
                                circleStyle: 'box-shadow: 0 0 0 5px #f44336;',
                                waveStyle: 'background-color: #f44336; box-shadow: inset 0 0 50px #f44336;'
                            })
                            break;
                        default:
                            break;
                    }

                    var reg1 = new RegExp('\n', 'g'); //全局替换换行符
                    index = index.replace(reg1, '');

                    //波动点数
                    var precisionPos = result_str.lastIndexOf('price-precision'); //指数
                    var precision = ''
                    if (precisionPos > 1) {
                        if (isShowToast) {
                            // wx.showToast({
                            //     icon: 'none',
                            //     title: '刷新成功',
                            // })
                            that.setData({
                                showToast: true
                            })
                        }
                        var precisionTxt = result_str.substring(precisionPos, precisionPos + 230)
                        precision = precisionTxt.substring(precisionTxt.indexOf('>') + 1, precisionTxt.indexOf('<'))
                    }
                    precision = precision.replace(reg1, '');
                    //涨跌百分比
                    var rate = ''
                    var ratePos = result_str.lastIndexOf('price-rate'); //涨跌百分比
                    if (ratePos > 1) {
                        var rateTxt = result_str.substring(ratePos, ratePos + 230)
                        var rate = rateTxt.substring(rateTxt.indexOf('>') + 1, rateTxt.indexOf('<'))
                    }
                    rate = rate.replace(reg1, '');
                    that.setData({
                        vn30Index: rate + '\n' + index,
                        vn30IndexResult: true
                    })
                    //获取时间
                    var beijingtimePos = result_str.indexOf('(北京时间)')
                    var beijingtime = ''
                    if (beijingtimePos > 1) {
                        beijingtime = result_str.substring(beijingtimePos - 15, beijingtimePos - 1);
                        that.setData({
                            vn30IndexRefreshTime: beijingtime 
                            // vn30IndexRefreshTime: '(' + beijingtime + ')'
                        })
                    }
                } else {
                    console.log("vn30指数 pos<1 第一次请求没成功");
                }
            }
        })
    },

    /**
     * 获取xop
     * @param {*} isShowToast 
     */
    getSPDR: function (isShowToast) {
        // var cookie = "xq_a_token=25916c3bfec27272745f6070d664a48d4b10d322; xqat=25916c3bfec27272745f6070d664a48d4b10d322; xq_r_token=2242d232b1aa6ffb6d9569d53e067311db16c12c; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTY2NzAwMjE2NSwiY3RtIjoxNjY0NjExNzYyODU1LCJjaWQiOiJkOWQwbjRBWnVwIn0.St8TPUjXMC-6n9uLCUE0gpWAsSd-MCRsaf3vkah87ZgfSPzyVAS779qaL4WS7KFjoXhXl-yjSKh2w_p01NWsV2y9kczfLIdzQJ6PKuFHvAaXaP58YdQBU9blvteKQgy8D5C--3EhYftKnTCVLmNPbM_NIdiwb8gjwksY97_PKh-vQQDwR5gVKgQCraRhKZEuOfc_YRsfZLbbx5HvIUgi2ogfk-65UwW9B3fa-zHIRKzf5mFTFrfV4ztlZ5nHiD-syQELM6E1ZIkUUxyy_iGX116I-bVNJeSx8pOe4Ofn8o6ody5TD3Gh_z9_A7iOMi8u6gbFHnSdfZqLR3KLQoyaDg; u=271664611786110; device_id=036eb2341f3882782ac8256ba985c93d; Hm_lvt_1db88642e346389874251b5a1eded6e3=1664611787; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1664618965; is_overseas=0"
        var that = this
        wx.request({
                //   https://stock.xueqiu.com/v5/stock/realtime/quotec.json?symbol=XOP&_=1665582411695
            url: 'https://stock.xueqiu.com/v5/stock/realtime/quotec.json?symbol=XOP',
            header: {
                'content-type': 'application/json',
                // 'cookie': cookie
            },
            method: 'GET',
            complete() { },
            fail() { },
            success(result) {
                var result_str = result.data;
                console.log("<----------------------- this result----------------------->")
                console.log(result_str)
                var current = result_str.data[0].current
                var percent = result_str.data[0].percent
                var time = result_str.data[0].timestamp
                var pre = "+";
                console.log('percent is '+percent)
                if (percent.toString().indexOf('-') == 0) {
                    console.log('负值')
                    that.setData({
                        xopIndexStyle: 'color:white',
                        xopCircleStyle: 'box-shadow: 0 0 0 5px #4CAF50;',
                        xopWaveStyle: 'background-color: #4CAF50; box-shadow: inset 0 0 50px #4CAF50;'
                    })
                    pre = "";
                } else {
                    that.setData({
                        xopIndexStyle: 'color:white',
                        xopCircleStyle: 'box-shadow: 0 0 0 5px #f44336;',
                        xopWaveStyle: 'background-color: #f44336; box-shadow: inset 0 0 50px #f44336;'
                    })
                    pre = "+";
                }
                console.log("pre is "+pre)
                that.setData({
                    xopIndex: "(" +pre + percent + "%"+")" + '\n' + current.toString(),
                    xopIndexResult: true,
                    xopIndexRefreshTime: util.formatUsa(time).substring(5,util.formatUsa(time).length)
                })
            }
        })
    },

    //       // 隐藏 toast
    //   onHideToastTap() {
    //     this.setData({
    //       showToast: !showToast
    //     });
    //   },
    //刷新事件
    refresh(e) {
        var that = this
        that.getVn30(true)
        that.getSPDR(true)
    },
    //跳转到赞赏页面
    reward: function () {
        wx.navigateTo({
            url: '../reward/reward',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    //跳转到提前还款计算器
    payment:function(){
        wx.navigateTo({
                url: '../payment/payment',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
    },
    //跳转到历史数据页面
    history: function () {
        wx.navigateTo({
            url: '../history/history',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
        

    },
    /**
 * 用户点击右上角分享
 */
    onShareAppMessage: function () {


    },
})