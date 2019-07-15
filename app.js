const basicPath = "https://www.mzitu.com/japan/";
// https://www.mzitu.com/page/2/
let start = 1;
let end =5;
const render = require("./render");
console.log(render)
const main = async (url)=>{
  let list = [],index=0;
  let data = await render.getPage(url)
  list = render.getUrl(data)
  downLoadImages(list, index);//下载
}

function downLoadImages(list,index){
  if (index == list.length) {
    console.log('list-length')
    start++;
    if (start < end) {
      main(basicPath + start);//进行下一页图片组的爬取。
    }
    return false;
  }

  if (render.getTitle(list[index])) {
    console.log(list[index].url)
    let item =  render.getPageDetail(list[index].url);//获取图片所在网页的url
    console.log(item);
    render.getPageDetail(list[index].url).then(res=>{
      let imageNum = render.getImagesNum(res,list[index].name);//获取这组图片的数量
      console.log(imageNum)
      for (var i = 1; i <= imageNum; i++) {
        let page = await render.getPage(list[index].url + `/${i}`);//遍历获取这组图片每一张所在的网页
        await render.downloadImage(page, i);//下载
      }
    })
    // let data = await render.getPage(basicPath)
    // let item = await render.getPage(basicPath);
    // let imageNum = render.getImagesNum(item.res,list[index].name);//获取这组图片的数量
    // for (var i = 1; i <= imageNum; i++) {
    //   let page = await render.getPage(list[index].url + `/${i}`);//遍历获取这组图片每一张所在的网页
    //   await render.downloadImage(page, i);//下载
    // }
    // index++;
    // downLoadImages(list, index);//循环完成下载下一组
  // }else{
  //   index++;
  //   downLoadImages(list, index);//下载下一组
  }
}
main(basicPath)