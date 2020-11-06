// date.js
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function str2Date(dateStr, separator) {
  if (!separator) {
    separator = "-";
  }
  let dateArr = dateStr.split(separator);
  let year = parseInt(dateArr[0]);
  let month;
  //处理月份为04这样的情况
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  let day = parseInt(dateArr[2]);
  let date = new Date(year, month - 1, day);
  return date;
}

export function showtime(time) {
  let date =
    typeof time === "number"
      ? new Date(time)
      : new Date((time || "").replace(/-/g, "/"));
  let diff = (new Date().getTime() - date.getTime()) / 1000;
  let dayDiff = Math.floor(diff / 86400);

  let isValidDate =
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date.getTime());

  if (!isValidDate) {
    window.console.error("不是有效日期格式");
  }
     //小于0或者大于等于31显示原时间
  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return this.formatDate(date);
  }
  return (
    (dayDiff === 0 &&
      ((diff < 60 && "刚刚") ||
        (diff < 120 && "1分钟前") ||
        (diff < 3600 && Math.floor(diff / 60) + "分钟前") ||
        (diff < 7200 && "1小时前") ||
        (diff < 86400 && Math.floor(diff / 3600) + "小时前"))) ||
    (dayDiff === 1 && "昨天") ||
    (dayDiff < 7 && dayDiff + "天前") ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + "周前")
  );
}
