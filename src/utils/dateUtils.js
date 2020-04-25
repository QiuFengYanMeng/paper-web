/**
 * 日期工具类
 * 陈登文
 * 2018年6月11日 16:58:43
 */

var dateUtils = {}
/**
 * 日期格式转换
 * @param str
 * @param format
 */
dateUtils.format = (str, format) => {
    var time = new Date(str.replace(/-/g, '/'))
    var t = new Date(time)
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear())
            case 'MM':
                return tf(t.getMonth() + 1)
            case 'mm':
                return tf(t.getMinutes())
            case 'dd':
                return tf(t.getDate())
            case 'HH':
                return tf(t.getHours())
            case 'ss':
                return tf(t.getSeconds())
        }
    })
}

dateUtils.dateToStr = (date, slipe) => {
    var year = date.getFullYear()
    var month = (date.getMonth() + 1).toString()
    var day = (date.getDate()).toString()
    if (month.length === 1) {
        month = '0' + month
    }
    if (day.length === 1) {
        day = '0' + day
    }
    var dateTime = year + slipe + month + slipe + day
    return dateTime
}

dateUtils.dateChinese = (date) => {
    date = new Date(date)
    var year = date.getFullYear()
    var month = (date.getMonth() + 1).toString()
    var day = (date.getDate()).toString()
    var dateTime = year + '年' + month + '月' + day + '日'
    return dateTime
}

dateUtils.dateTo = (date, slipe) => {
    date = new Date(date)
    var year = date.getFullYear()
    var month = (date.getMonth() + 1).toString()
    var day = (date.getDate()).toString()
    var timeHours = date.getHours().toString()
    var timeMinutes = date.getMinutes().toString()
    var timeSeconds = date.getSeconds().toString()
    if (month.length === 1) {
        month = '0' + month
    }
    if (day.length === 1) {
        day = '0' + day
    }
    var dateTime = year + slipe + month + slipe + day + ' ' + timeHours + ':' + timeMinutes + ':' + timeSeconds
    return dateTime
}

/**
 * 根据身份证号码获取年龄
 * @param identityCard
 * @returns {string}
 */
dateUtils.getAge = (identityCard) => {
    var len = (identityCard + '').length;
    if (len === 0) {
        return 0;
    } else {
        if ((len !== 15) && (len !== 18)) {
            // 身份证号码只能为15位或18位其它不合法
            return 0;
        }
    }
    var strBirthday = '';
    if (len === 18) {
        // 处理18位的身份证号码从号码中得到生日和性别代码
        strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2);
    }
    if (len === 15) {
        strBirthday = '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2);
    }
    // 时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

/**
 * 判断日期是否是工作日
 * @param date
 * @returns {string}
 */
dateUtils.isWorkDay = (date) => {
    date = new Date(date)
    var wd = date.getDay()
    var flag = false
    if (wd === 1 || wd === 2 || wd === 3 || wd === 4 || wd === 5) {
        flag = true
    }
    return flag
}

export default dateUtils
