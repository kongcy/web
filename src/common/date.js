/**
 * 日期格式化
 * @formatStr: 格式化参数, 默认yyyy-MM-dd
 * @return:    Date
 * e.g.         new Date().formatDate('yyyy-MM-dd')  =>  '2016-12-12'
 */

Date.prototype.formatDate = function(formatStr='yyyy-MM-dd') {
  var dict = {
    yyyy: this.getFullYear(),
    M: this.getMonth() + 1,
    d: this.getDate(),
    H: this.getHours(),
    m: this.getMinutes(),
    s: this.getSeconds(),
    SS: this.getMilliseconds(),
    MM: ('' + (this.getMonth() + 101)).substr(1),
    dd: ('' + (this.getDate() + 100)).substr(1),
    HH: ('' + (this.getHours() + 100)).substr(1),
    mm: ('' + (this.getMinutes() + 100)).substr(1),
    ss: ('' + (this.getSeconds() + 100)).substr(1),
    SS: ('' + (this.getMilliseconds() + 1000)).substr(1)
  }
  return formatStr.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?|SS)/g, function() {
    return dict[arguments[0]]
  })
}