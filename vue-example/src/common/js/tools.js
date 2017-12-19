/* 解析url参数 */
export function urlParse() {
  let urlArr = window.location.search.substr(1).split('&'); // 截取掉?,并以&分开，存入数组
  let obj = {};
  if (urlArr) {
    urlArr.forEach((item) => {
      let arr = item.split('='); // 每一项用=分开存入数组,arr[0]=key,arr[1]=value
      let key = decodeURIComponent(arr[0]); // 对url解码
      let val = decodeURIComponent(arr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
