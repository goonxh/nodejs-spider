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
const allTXT = '';
// fs.mkdirSync(`./ooxxPic-${dir}`);
const urlMap = [
    "http://www.lgwy.net/html/p/p_119888.html",
    "http://www.lgwy.net/html/p/p_119920.html",
    "http://www.lgwy.net/html/p/p_119905.html",
    "http://www.lgwy.net/html/p/p_119899.html",
    "http://www.lgwy.net/html/p/p_119898.html",
    "http://www.lgwy.net/html/p/p_119895.html",
    "http://www.lgwy.net/html/p/p_119890.html",
    "http://www.lgwy.net/html/p/p_119863.html",
    "http://www.lgwy.net/html/p/p_119824.html",
    "http://www.lgwy.net/html/p/p_119773.html",
    "http://www.lgwy.net/html/p/p_119772.html",
    "http://www.lgwy.net/html/p/p_119774.html",
    "http://www.lgwy.net/html/p/p_119775.html",
    "http://www.lgwy.net/html/p/p_119776.html",
    "http://www.lgwy.net/html/p/p_119777.html",
    "http://www.lgwy.net/html/p/p_119778.html",
    "http://www.lgwy.net/html/p/p_119761.html",
    "http://www.lgwy.net/html/p/p_119722.html",
    "http://www.lgwy.net/html/p/p_119717.html",
    "http://www.lgwy.net/html/p/p_119712.html",
    "http://www.lgwy.net/html/p/p_119700.html",
    "http://www.lgwy.net/html/p/p_119663.html",
    "http://www.lgwy.net/html/p/p_119662.html",
    "http://www.lgwy.net/html/p/p_119661.html",
    "http://www.lgwy.net/html/p/p_119594.html",
    "http://www.lgwy.net/html/p/p_119522.html",
    "http://www.lgwy.net/html/p/p_119509.html",
    "http://www.lgwy.net/html/p/p_119507.html",
    "http://www.lgwy.net/html/p/p_119497.html",
    "http://www.lgwy.net/html/p/p_119378.html",
    "http://www.lgwy.net/html/p/p_119163.html",
    "http://www.lgwy.net/html/p/p_119349.html",
    "http://www.lgwy.net/html/p/p_119375.html",
    "http://www.lgwy.net/html/p/p_119865.html",
    "http://www.lgwy.net/html/p/p_119821.html",
    "http://www.lgwy.net/html/p/p_119821.html",
    "http://www.lgwy.net/html/p/p_119891.html",
    "http://www.lgwy.net/html/p/p_118207.html",
    "http://www.lgwy.net/html/p/p_120125.html",
    "http://www.lgwy.net/html/p/p_119694.html",
    "http://www.lgwy.net/html/p/p_119673.html",
    "http://www.lgwy.net/html/p/p_118066.html",
    "http://www.lgwy.net/html/p/p_120123.html",
    "http://www.lgwy.net/html/p/p_119967.html",
    "http://www.lgwy.net/html/p/p_118037.html",
    "http://www.lgwy.net/html/p/p_117658.html",
    "http://www.lgwy.net/html/p/p_118223.html",
    "http://www.lgwy.net/html/p/p_116751.html",
    "http://www.lgwy.net/html/p/p_119897.html",
    "http://www.lgwy.net/html/p/p_119674.html",
    "http://www.lgwy.net/html/p/p_119295.html",
    "http://www.lgwy.net/html/p/p_118803.html",
    "http://www.lgwy.net/html/p/p_117405.html",
    "http://www.lgwy.net/html/p/p_116722.html",
    "http://www.lgwy.net/html/p/p_116897.html",
    "http://www.lgwy.net/html/p/p_117057.html",
    "http://www.lgwy.net/html/p/p_116713.html",
    "http://www.lgwy.net/html/p/p_116713.html",
    "http://www.lgwy.net/html/p/p_118313.html",
    "http://www.lgwy.net/html/p/p_118402.html",
    "http://www.lgwy.net/html/p/p_118209.html",
    "http://www.lgwy.net/html/p/p_117842.html",
    "http://www.lgwy.net/html/p/p_117840.html",
    "http://www.lgwy.net/html/p/p_117063.html",
    "http://www.lgwy.net/html/p/p_116676.html",
    "http://www.lgwy.net/html/p/p_116711.html",
    "http://www.lgwy.net/html/p/p_120048.html",
    "http://www.lgwy.net/html/p/p_119801.html",
    "http://www.lgwy.net/html/p/p_119760.html",
    "http://www.lgwy.net/html/p/p_119634.html",
    "http://www.lgwy.net/html/p/p_116642.html",
    "http://www.lgwy.net/html/p/p_120001.html",
    "http://www.lgwy.net/html/p/p_119977.html",
    "http://www.lgwy.net/html/p/p_119957.html",
    "http://www.lgwy.net/html/p/p_119955.html",
    "http://www.lgwy.net/html/p/p_119950.html",
    "http://www.lgwy.net/html/p/p_119887.html",
    "http://www.lgwy.net/html/p/p_119892.html",
    "http://www.lgwy.net/html/p/p_119805.html",
    "http://www.lgwy.net/html/p/p_117836.html",
    "http://www.lgwy.net/html/p/p_117721.html",
    "http://www.lgwy.net/html/p/p_117738.html",
    "http://www.lgwy.net/html/p/p_117543.html",
    "http://www.lgwy.net/html/p/p_117477.html",
    "http://www.lgwy.net/html/p/p_117473.html",
    "http://www.lgwy.net/html/p/p_117409.html",
    "http://www.lgwy.net/html/p/p_117398.html",
    "http://www.lgwy.net/html/p/p_117358.html",
    "http://www.lgwy.net/html/p/p_117331.html",
    "http://www.lgwy.net/html/p/p_117046.html",
    "http://www.lgwy.net/html/p/p_116773.html",
    "http://www.lgwy.net/html/p/p_116650.html",
    "http://www.lgwy.net/html/p/p_116651.html",
    "http://www.lgwy.net/html/p/p_119909.html",
    "http://www.lgwy.net/html/p/p_119418.html",
    "http://www.lgwy.net/html/p/p_119417.html",
    "http://www.lgwy.net/html/p/p_119296.html",
    "http://www.lgwy.net/html/p/p_117072.html",
    "http://www.lgwy.net/html/p/p_116656.html",
    "http://www.lgwy.net/html/p/p_116889.html",
    "http://www.lgwy.net/html/p/p_120127.html",
    "http://www.lgwy.net/html/p/p_120128.html",
    "http://www.lgwy.net/html/p/p_120061.html",
    "http://www.lgwy.net/html/p/p_120061.html",
    "http://www.lgwy.net/html/p/p_119996.html",
    "http://www.lgwy.net/html/p/p_117835.html",
    "http://www.lgwy.net/html/p/p_117675.html",
    "http://www.lgwy.net/html/p/p_117656.html",
    "http://www.lgwy.net/html/p/p_117701.html",
    "http://www.lgwy.net/html/p/p_117336.html",
    "http://www.lgwy.net/html/p/p_117357.html",
    "http://www.lgwy.net/html/p/p_117059.html",
    "http://www.lgwy.net/html/p/p_117045.html",
    "http://www.lgwy.net/html/p/p_117050.html",
    "http://www.lgwy.net/html/p/p_116634.html",
    "http://www.lgwy.net/html/p/p_116743.html",
    "http://www.lgwy.net/html/p/p_116676.html",
    "http://www.lgwy.net/html/p/p_120039.html",
    "http://www.lgwy.net/html/p/p_118036.html",
    "http://www.lgwy.net/html/p/p_118039.html",
    "http://www.lgwy.net/html/p/p_117834.html",
    "http://www.lgwy.net/html/p/p_117837.html",
    "http://www.lgwy.net/html/p/p_117670.html",
    "http://www.lgwy.net/html/p/p_117657.html",
    "http://www.lgwy.net/html/p/p_117699.html",
    "http://www.lgwy.net/html/p/p_117529.html",
    "http://www.lgwy.net/html/p/p_117530.html",
    "http://www.lgwy.net/html/p/p_117130.html",
    "http://www.lgwy.net/html/p/p_117047.html",
    "http://www.lgwy.net/html/p/p_116719.htm",
    "http://www.lgwy.net/html/p/p_116576.html",
    "http://www.lgwy.net/html/p/p_116627.html",
    "http://www.lgwy.net/html/p/p_119411.html",
    "http://www.lgwy.net/html/p/p_119176.html",
    "http://www.lgwy.net/html/p/p_118450.html",
    "http://www.lgwy.net/html/p/p_118324.html",
    "http://www.lgwy.net/html/p/p_118229.html",
    "http://www.lgwy.net/html/p/p_118208.html",
    "http://www.lgwy.net/html/p/p_118203.html",
    "http://www.lgwy.net/html/p/p_118040.html",
    "http://www.lgwy.net/html/p/p_117722.html",
    "http://www.lgwy.net/html/p/p_117679.html",
    "http://www.lgwy.net/html/p/p_117678.html",
    "http://www.lgwy.net/html/p/p_117622.html",
    "http://www.lgwy.net/html/p/p_117537.html",
    "http://www.lgwy.net/html/p/p_117333.html",
    "http://www.lgwy.net/html/p/p_117328.html",
    "http://www.lgwy.net/html/p/p_117061.html",
    "http://www.lgwy.net/html/p/p_117031.html",
    "http://www.lgwy.net/html/p/p_116971.html",
    "http://www.lgwy.net/html/p/p_116566.html",
    "http://www.lgwy.net/html/p/p_116740.html",
    "http://www.lgwy.net/html/p/p_116825.html",
    "http://www.lgwy.net/html/p/p_116801.html",
    "http://www.lgwy.net/html/p/p_119968.html",
    "http://www.lgwy.net/html/p/p_119904.html",
    "http://www.lgwy.net/html/p/p_119902.html",
    "http://www.lgwy.net/html/p/p_119901.html",
    "http://www.lgwy.net/html/p/p_119880.html",
    "http://www.lgwy.net/html/p/p_119886.html",
    "http://www.lgwy.net/html/p/p_119845.html",
    "http://www.lgwy.net/html/p/p_119759.html",
    "http://www.lgwy.net/html/p/p_119379.html",
    "http://www.lgwy.net/html/p/p_117815.html",
    "http://www.lgwy.net/html/p/p_117356.html",
    "http://www.lgwy.net/html/p/p_117110.html",
    "http://www.lgwy.net/html/p/p_116617.html",
    "http://www.lgwy.net/html/p/p_116611.html",
    "http://www.lgwy.net/html/p/p_116615.html",
    "http://www.lgwy.net/html/p/p_116632.html",
    "http://www.lgwy.net/html/p/p_116865.html",
    "http://www.lgwy.net/html/p/p_117833.html",
    "http://www.lgwy.net/html/p/p_117682.html",
    "http://www.lgwy.net/html/p/p_117533.html",
    "http://www.lgwy.net/html/p/p_116618.html",
    "http://www.lgwy.net/html/p/p_120136.html",
    "http://www.lgwy.net/html/p/p_116619.html",
    "http://www.lgwy.net/html/p/p_120131.html",
    "http://www.lgwy.net/html/p/p_118038.html",
    "http://www.lgwy.net/html/p/p_117730.html",
    "http://www.lgwy.net/html/p/p_117329.html",
    "http://www.lgwy.net/html/p/p_117056.html",
    "http://www.lgwy.net/html/p/p_116612.html",
    "http://www.lgwy.net/html/p/p_116620.html",
    "http://www.lgwy.net/html/p/p_116741.html",
    "http://www.lgwy.net/html/p/p_116927.html",
    "http://www.lgwy.net/html/p/p_117695.html",
    "http://www.lgwy.net/html/p/p_116614.html",
    "http://www.lgwy.net/html/p/p_119380.html",
    "http://www.lgwy.net/html/p/p_117673.html",
    "http://www.lgwy.net/html/p/p_117153.html",
    "http://www.lgwy.net/html/p/p_117000.html",
    "http://www.lgwy.net/html/p/p_116953.html",
    "http://www.lgwy.net/html/p/p_116671.html",
    "http://www.lgwy.net/html/p/p_116720.html",
    "http://www.lgwy.net/html/p/p_116752.html",
    "http://www.lgwy.net/html/p/p_120150.html",
    "http://www.lgwy.net/html/p/p_119953.html",
    "http://www.lgwy.net/html/p/p_119713.html",
    "http://www.lgwy.net/html/p/p_118061.html",
    "http://www.lgwy.net/html/p/p_118216.html",
    "http://www.lgwy.net/html/p/p_118211.html",
    "http://www.lgwy.net/html/p/p_117922.html",
    "http://www.lgwy.net/html/p/p_117060.html",
    "http://www.lgwy.net/html/p/p_116952.html",
    "http://www.lgwy.net/html/p/p_116750.html",
    "http://www.lgwy.net/html/p/p_119716.html",
    "http://www.lgwy.net/html/p/p_117055.html",
    "http://www.lgwy.net/html/p/p_117694.html",
    "http://www.lgwy.net/html/p/p_120130.html",
    "http://www.lgwy.net/html/p/p_120132.html",
    "http://www.lgwy.net/html/p/p_119931.html",
    "http://www.lgwy.net/html/p/p_119903.html",
    "http://www.lgwy.net/html/p/p_119894.html",
    "http://www.lgwy.net/html/p/p_119811.html",
    "http://www.lgwy.net/html/p/p_119802.html",
    "http://www.lgwy.net/html/p/p_119754.html",
    "http://www.lgwy.net/html/p/p_119779.html",
    "http://www.lgwy.net/html/p/p_118937.html",
    "http://www.lgwy.net/html/p/p_119299.html",
    "http://www.lgwy.net/html/p/p_120453.html",
    "http://www.lgwy.net/html/p/p_120339.html",
    "http://www.lgwy.net/html/p/p_120446.html",
    "http://www.lgwy.net/html/p/p_120444.html",
    "http://www.lgwy.net/html/p/p_120440.html",
    "http://www.lgwy.net/html/p/p_120326.html",
    "http://www.lgwy.net/html/p/p_120419.html",
    "http://www.lgwy.net/html/p/p_120300.html",
    "http://www.lgwy.net/html/p/p_120416.html",
    "http://www.lgwy.net/html/p/p_120301.html",
    "http://www.lgwy.net/html/p/p_120325.html",
    "http://www.lgwy.net/html/p/p_120324.html",
    "http://www.lgwy.net/html/p/p_120302.html",
    "http://www.lgwy.net/html/p/p_120318.html",
    "http://www.lgwy.net/html/p/p_120281.html",
    "http://www.lgwy.net/html/p/p_120271.html",
    "http://www.lgwy.net/html/p/p_120278.html",
    "http://www.lgwy.net/html/p/p_120277.html",
    "http://www.lgwy.net/html/p/p_120280.html",
    "http://www.lgwy.net/html/p/p_120272.html",
    "http://www.lgwy.net/html/p/p_120273.html",
    "http://www.lgwy.net/html/p/p_118937.html",
    "http://www.lgwy.net/html/p/p_119299.html",
];
for(let i = 0; i < urlMap.length; i++) {
    setTimeout(() => {
        let url = urlMap[i];
    http.get(url, function(res) {
        let html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            const t = filterSlideList(html);
            console.log(t);
            fs.appendFile(`./2023Q.txt`, t, function(err) {
                console.log(err);
            })
        });
    }).on('error', function() {
        console.log('获取数据出错！');
    });
    }, 2000 * i);
}


/* 过滤页面信息 */
function filterSlideList(html) {
    if (html) {
        let text = '';
        let $ = cheerio.load(html);
        let newContent = $('div.new_content');
        newContent.find('p').each(function(item) {
            let q = $(this);
            text = text + q.text() + '\r\n';
        });
        return text + '\r\n';
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
