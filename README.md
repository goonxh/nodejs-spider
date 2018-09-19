# nodejs-spider
基于nodejs的一些爬虫案例

## getPicFromJiandan
爬取的是煎蛋网的妹子图，一次性爬取了第一页到第三十三页的近800张图片。

url: http://i.jandan.net/ooxx/page-1#comments ~ http://i.jandan.net/ooxx/page-33#comments

煎蛋网的图片进行了base64编码处理，获取时需要用nodejs将其解码。
```
let pic_src = new Buffer(pic_src_hash,'base64').toString();
```

