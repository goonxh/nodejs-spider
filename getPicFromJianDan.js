/**
 * Created by goonxh on 2018/9/10.
 */
const express = require('express');
//const router = express.Router();
const path = require('path');
let http = require("http");
let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");

for(let i=1;i<39;i++) {
    let url = `http://i.jandan.net/ooxx/page-${i}#comments`;
    http.get(url, function(res) {
    let html = '';
    // 获取页面数据
    res.on('data', function(data) {
        html += data;
    });
    // 数据获取结束
    res.on('end', function() {
        // 通过过滤页面信息获取实际需求的轮播图信息
        let picListData = filterSlideList(html);
        // 打印信息
        printInfo(picListData);
    });
}).on('error', function() {
    console.log('获取数据出错！');
});
}


/* 过滤页面信息 */
function filterSlideList(html) {
    if (html) {
        // 沿用JQuery风格，定义$
        let $ = cheerio.load(html);
        // 根据id获取轮播图列表信息
        let picList = $('ol.commentlist');
        // 轮播图数据
        let picListData = [];

        /* 轮播图列表信息遍历 */
        picList.find('li').each(function(item) {

            let pic = $(this);
            // 找到a标签并获取href属性
            //let pic_href = pic.find('p').children('a.view_img_link').attr('href');
            // 找到a标签的子标签img并获取_src
            let pic_src_hash = pic.find('img').next("span.img-hash").text();
            let pic_src = new Buffer(pic_src_hash,'base64').toString();

            // 向数组插入数据
            picListData.push({
                pic_src: pic_src
            });
        });
        // 返回轮播图列表信息
        return picListData;
    } else {
        console.log('无数据传入！');
    }
}

/* 打印信息 */
function printInfo(picListData) {
    //console.log(picListData)
    // 计数
    let count = 0;
    // 遍历信息列表
    picListData.forEach(function(item) {
        if(item.pic_src) {
            // 获取图片
        let pic_src = item.pic_src.replace(/mw600/,'large');
        // 获取图片对应的链接地址
        //let pic_href = item.pic_href;
        // 打印信息
        //console.log(pic_href);
        console.log(pic_src);
        let firstIndex = pic_src.lastIndexOf("/")+1;
        let lastIndex = pic_src.lastIndexOf(".");
       // console.log(lastIndex)
        let dirname = pic_src.substring(firstIndex,lastIndex);
        //console.log(dirname)
        //fs.mkdirSync(`../dist/static/img/${dirname}`);
        request({uri: 'http:'+pic_src, encoding:'binary'}).pipe(fs.createWriteStream(path.join(`jiandan_large`,`${dirname}.jpg`)));
        console.log('\n');
        }
    });
}

/*
const dirname = 'uploadImages'
const hostdir = "../dist/static/"

function mkdirSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return false
}*/
