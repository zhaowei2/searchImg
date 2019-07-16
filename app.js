const basicPath = "https://www.mzitu.com/xinggan";
// https://www.mzitu.com/page/2/
let start = 1;
let end =3;
const render = require("./render");
const main = async (url)=>{
  let list = [],index=0;
  let data = await render.getPage(url)
  list = render.getUrl(data)
  downLoadImages(list, index);//下载
}

const downLoadImages=async(list,index)=>{
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
    let item = await render.getPage(list[index].url);
    conaole.log('26--------------------')
    console.log(item)
    let imageNum = render.getImagesNum(item.res,list[index].name);//获取这组图片的数量
    console.log('29---------'+ imageNum)
    for (var i = 1; i <= imageNum; i++) {
      // console.log(list[index].url + `/${i}`)
        let url='';
        if(i!=1){
          url = list[index].url + `/${i}`
        }else{
          url = list[index].url
        }
        console.log('38 ---------' + url)
      try {
        let page = await render.getPage(url);//遍历获取这组图片每一张所在的网页
        // console.log(page)
        console.log(url +' scuess')
        await render.downloadImage(page, i);//下载
      } catch (error) {
        console.log('error error')
        // console.log(error)
        console.log(url)
        // continue
      }
    }
    index++;
    downLoadImages(list, index);//循环完成下载下一组
  }else{
    index++;
    downLoadImages(list, index);//下载下一组
  }
}
main(basicPath)