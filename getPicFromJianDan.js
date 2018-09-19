/**
 * Created by goonxh on 2018/9/10.
 */
const express = require('express');
const path = require('path');
const http = require("http");
const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");
const Bagpipe = require("bagpipe");  // 控制并发
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

let bagpipe = new Bagpipe(10);
let index = 1;
let dir = new Date().toLocaleString().replace(/:/g, '');

fs.mkdirSync(`./ooxxPic-${dir}`);

for(let i=1;i<33;i++) {
    let url = `http://i.jandan.net/ooxx/page-${i}#comments`;
    http.get(url, function(res) {
        let html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            let picListData = filterSlideList(html);
            saveImg(picListData);
        });
    }).on('error', function() {
        console.log('获取数据出错！');
    });
}


/* 过滤页面信息 */
function filterSlideList(html) {
    if (html) {
        let $ = cheerio.load(html);
        let picList = $('ol.commentlist');
        let picListData = [];
        picList.find('li').each(function(item) {
            let pic = $(this);
            let pic_src_hash = pic.find('img').next("span.img-hash").text();
            let pic_src = new Buffer(pic_src_hash,'base64').toString();
            picListData.push({
                pic_src: pic_src
            });
        });
        return picListData;
    } else {
        console.log('无数据传入！');
    }
}

function saveImg(picListData) {
    for(let i=0;i<picListData.length;i++) {
        if(picListData[i].pic_src) {
            let pic_src = picListData[i].pic_src.replace(/mw600/,'large');
            bagpipe.push(downloadImg, pic_src, function(err,data) {
                console.log("["+ index++ +"]: " + pic_src);
            })
        }  
    }
}

function downloadImg(pic_src,callback) {
    let firstIndex = pic_src.lastIndexOf("/")+1;
    //let lastIndex = pic_src.lastIndexOf(".");
    let dirname = pic_src.substring(firstIndex,pic_src.length);
    request({uri: 'http:'+pic_src, headers: {'User-Agent': userAgent} })
    .on('error',(err)=>{
        console.log(err)
    })
    .pipe(fs.createWriteStream(path.join(`ooxxPic-${dir}`,`${dirname}`)))
    .on('close',function(){
        callback()
    });
}
