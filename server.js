var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/
  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

  const filePath = path === '/' ? '/index.html' : path
  // 找到文件格式种的 . 是第几个
  const index = filePath.lastIndexOf('.')
  // 利用点得到文件的后缀(格式)
  const suffix = filePath.substring(index)
  // 利用得到的后缀来映射响应头中的格式
  // 这里使用 hash 来映射
  const fileType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.xml': 'text/xml',
    '.json': 'text/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  }
  // 根据用户请求的格式替换不同的类型格式，如果不是以上格式，保底格式为 text/html
  response.setHeader('Content-Type', `${fileType[suffix] || 'text/html'};charset=utf-8`);
  let content;
  try {
    content = fs.readFileSync(`./public${filePath}`);
  } catch (error) {
    content = '文件不存在';
    response.statusCode = 404;
  }
  response.write(content);
  response.end();

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)