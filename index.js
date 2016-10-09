var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('public'));

app.get('/', function (req, res){
    console.log(req);
    res.sendFile('index.html');
});

app.get('/download/:vid', function(req, res){
    res.download('E:/BaiduYun/6.mkv');
});

app.get('/online/:vid', function(req, res){
    var vid = req.params.vid;
    var path = 'E:/BaiduYun/6.mkv';

    fs.stat(path, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
      res.end(err);
      }
      var range = req.headers.range;
      console.log(req.headers);
      if (!range) {
       // 416 Wrong range
       return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mkv"
      });

    var v_stream = fs.createReadStream(path, { start: start, end: end });
    v_stream.on('open', function(){
        v_stream.pipe(res);
    });

    v_stream.on('error', function(err){
        console.log(err);
    });
    });
});
app.listen(8888, function(){
    console.log('Video Library Start...');
});