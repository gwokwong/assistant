const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

function format(ts) {
    var d = new Date(ts)
    return [d.getMonth() + 1, d.getDate()].join('-')
}

function formatUsa(time) {
    // 判断时间戳是否为13位数，如果不是则*1000，时间戳只有13位数(带毫秒)和10(不带毫秒)位数的
    if (time.toString().length == 13) {
        var tme = new Date(time);
    } else {
        var tme = new Date(time * 1000);
    }
    var Y = tme.getFullYear();
    var M = (tme.getMonth() + 1 < 10 ? '0' + (tme.getMonth() + 1) : tme.getMonth() + 1);
    var D = tme.getDate();
    var h = tme.getHours();
    var m = tme.getMinutes();
    var s = tme.getSeconds();
    var tem1 = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
    return tem1;
}
/**
 * 部分提前还款计算（等额本息、期限不变）
 *
 * @param principal      贷款总额
 * @param months         贷款期限
 * @param aheadPrincipal 提前还款金额
 * @param payTimes       已还次数
 * @param rate           贷款利率
 * @return
 */
function calculateEqualPrincipalAndInterestApart2(principal, months, aheadPrincipal, payTimes, rate) {
    var data = "";
    var monthRate = rate / (100 * 12).toFixed(4);//月利率
    console.log("月利率:" + monthRate)
    var preLoan = (principal * monthRate * Math.pow((1 + monthRate), months)) / (Math.pow((1 + monthRate), months) - 1);//每月还款金额
    var totalMoney = preLoan * months;//还款总额
    console.log("还款总额:" + totalMoney)
    var interest = totalMoney - principal;//还款总利息
    console.log("还款总利息:" + interest)
    var leftLoanBefore = principal * Math.pow(1 + monthRate, payTimes) - preLoan * (Math.pow(1 + monthRate, payTimes) - 1) / monthRate;//提前还款前欠银行的钱
    console.log("提前还款前欠银行的钱"+leftLoanBefore)
    console.log("还款总利息:" + interest)
    var leftLoan = principal * Math.pow(1 + monthRate, payTimes*1 + 1) - preLoan * (Math.pow(1 + monthRate, payTimes*1 + 1) - 1) / monthRate;//提前还款后银行的钱
    console.log("提前还款后银行的钱"+leftLoan)
    var payLoan = principal - leftLoanBefore;//已还本金
    console.log("已还本金:" + payLoan)
    var payTotal = preLoan * payTimes;//已还总金额
    console.log("已还总金额:" + payTotal)
    var payInterest = payTotal - payLoan;//已还利息
    console.log("已还利息:" + payInterest)
    var aheadTotalMoney = preLoan + aheadPrincipal;//下个月还款金额
    console.log("下个月还款金额:" + aheadTotalMoney)
    var newPreLoan = ((leftLoan - aheadPrincipal) * monthRate * Math.pow((1 + monthRate), months - payTimes - 1)) / (Math.pow((1 + monthRate), months - payTimes - 1) - 1);//下个月起每月还款金额
    var leftTotalPayTimes = months - payTimes;
    console.log("剩余还款期限:" + leftTotalPayTimes)
    var leftTotalMoney = newPreLoan * (months - payTimes);
    console.log("剩余还款金额:" + leftTotalMoney)
    var leftInterest = leftTotalMoney - (leftLoan - aheadPrincipal);
    console.log("剩余还款总利息:" + leftInterest)
    var saveInterest = totalMoney - payTotal - aheadTotalMoney - leftTotalMoney;
    console.log("节省利息:" + saveInterest)
    // data.add("原还款总额："+FormatDecimal.format(totalMoney)+" 元");//原还款总额
    // data.add("贷款总额："+FormatDecimal.format(principal)+" 元");//贷款总额
    // data.add("原还款总利息："+FormatDecimal.format(interest)+" 元");//原还款总利息
    // data.add("原还每月还款金额："+FormatDecimal.format(preLoan)+" 元");//原还每月还款金额
    // data.add("已还总金额："+FormatDecimal.format(payTotal)+" 元");//已还总金额
    // data.add("已还本金："+FormatDecimal.format(payLoan)+" 元");//已还本金
    // data.add("已还利息："+FormatDecimal.format(payInterest)+" 元");//已还利息
    // data.add("提前还款总额："+FormatDecimal.format(aheadTotalMoney)+" 元");//提前还款总额
    // data.add("剩余还款总额："+FormatDecimal.format(leftTotalMoney)+" 元");//剩余还款总额
    // data.add("剩余还款总利息："+FormatDecimal.format(leftInterest)+" 元");//剩余还款总利息
    // data.add("剩余每月还款金额："+FormatDecimal.format(newPreLoan)+" 元");//剩余每月还款金额
    // data.add("节省利息："+FormatDecimal.format(saveInterest)+" 元");//节省利息
    // data.add("剩余还款期限："+months+" 个月");//剩余还款期限

    data = "节省利息：" + saveInterest.toFixed(2) + "元" + "\n" +
        "原每月还款金额：" + preLoan.toFixed(2) + "元" + "\n" +
        "已还本金：" + payLoan.toFixed(2) + "元" + "\n" +
        "已还利息：" + payInterest.toFixed(2) + "元" + "\n" +
        "已还总额：" + payTotal.toFixed(2) + "元" + "\n" +
        "提前还款总额：" + aheadTotalMoney.toFixed(2) + "元" + "\n" +
        "剩余每月还款金额：" + newPreLoan.toFixed(2) + "元" + "\n" +
        "剩余还款期限：" + (months-payTimes) + " 个月"

    // data.push("原还款总额："+totalMoney+" 元");//原还款总额
    // data.push("贷款总额："+principal+" 元");//贷款总额
    // data.push("原还款总利息："+interest+" 元");//原还款总利息
    // data.push("原还每月还款金额："+preLoan+" 元");//原还每月还款金额
    // data.push("已还总金额："+payTotal+" 元");//已还总金额
    // data.push("已还本金："+payLoan+" 元");//已还本金
    // data.push("已还利息："+payInterest+" 元");//已还利息
    // data.push("提前还款总额："+aheadTotalMoney+" 元");//提前还款总额
    // data.push("剩余还款总额："+leftTotalMoney+" 元");//剩余还款总额
    // data.push("剩余还款总利息："+leftInterest+" 元");//剩余还款总利息
    // data.push("剩余每月还款金额："+newPreLoan+" 元");//剩余每月还款金额
    // data.push("节省利息："+saveInterest+" 元");//节省利息
    // data.push("剩余还款期限："+months+" 个月");//剩余还款期限

    return data;
}

module.exports = {
    formatTime, format, formatUsa, calculateEqualPrincipalAndInterestApart2
}
