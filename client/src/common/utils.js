// 格式化时间函数
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    // RegExp.$1就是上面匹配的结果
    // 例如yyyy  yy之类的
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    // 如果想要显示12小时制需要进行转化
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

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

// 格式化数字保留两位小数
export function changeNumber(number) {
  const x = String(number).indexOf('.') + 1;   //小数点的位置
  const y = String(number).length - x;  //小数的位数
  if(y>2){
    return number.toFixed(2);
  }else{
    return number;
  }
}
