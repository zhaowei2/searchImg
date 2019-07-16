const rp = require("request-promise")
const cheerio = require('cheerio')
const depositPath = "E:/node/baiduNews/img/";
const fs =require('fs')
let existsFile = false;
let downLoadPath;
module.exports ={
  async getPage(url){
    try {
      const data ={
        url:url,
        res:await rp({
          url:url
        })
      }
      return data
    } catch (error) {
      return {}
    }

  },
  async getPageDetail(url){
    let data={};
    return  data.res = await rp(url)
  },
  getUrl(data){
    let list = [];
    try {
      const $ = cheerio.load(data.res);

      $("#pins li a")
      .children()
      .each(async(i,e)=>{
        let obj = {
          name: e.attribs.alt, //图片网页的名字，后面作为文件夹名字
          url: e.parent.attribs.href //图片网页的url
        }
        list.push(obj)
      })
    } catch (error) {
      
    }
    return list;
  },
  getTitle(obj){
    downloadPath = depositPath + obj.name;
    if(!fs.existsSync(downloadPath)){
      console.log(`${obj.name}文件夹创建成功`);
      // fs.mkdirSync(downloadPath)
      return true;
    }else{
      console.log(`${obj.name}文件夹已经存在`);
      return false;
    }
  },
  getImagesNum(res,name){
    // console.log(res)
    if(res){
      let $ = cheerio.load(res);
      // console.log($)
      let len = $(".main .pagenavi").find("a").eq(-2).find('span').html();
      // console.log($(".main .pagenavi").find("a"))
      console.log(len)
      // console.log(len)
      if (len == 0) {
        fs.rmdirSync(`${depositPath}${name}`);//删除无法下载的文件夹
        return 0;
      }
      // let pageIndex = $(".pagenavi")
      //   .find("a")
      //   .find("span")[len - 2].children[0].data;
      return len*1;//返回图片总数
    }
  },
  //下载相册照片
  async downloadImage(data, index) {
    if (data.res) {
      console.log('imagess')
      var $ = cheerio.load(data.res);
      if ($(".main-image").find("img")[0]) {
        let imgSrc = $(".main-image").find("img")[0].attribs.src;//图片地址
        let headers = {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
          Host: "i.meizitu.net",
          Pragma: "no-cache",
          "Proxy-Connection": "keep-alive",
          Referer: data.url,
          "Upgrade-Insecure-Requests": 1,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
        };//反防盗链
        // await rp({
        //   url: imgSrc,
        //   resolveWithFullResponse: true,
        //   headers
        // }).pipe(fs.createWriteStream(`${downloadPath}/${index}.jpg`));//下载
        console.log(`${downloadPath}/${index}.jpg下载成功`);
      } else {
        console.log(`${downloadPath}/${index}.jpg加载失败`);
      }
    }
  }
}