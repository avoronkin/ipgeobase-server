var finalhandler = require('finalhandler')
var http = require('http')
var geo = require('geotools');
var Router = require('router')
var qs = require('qs')

http.ServerResponse.prototype.text = function(data) {
  this.setHeader('Content-Type', 'text/plain; charset=utf-8')
  this.end(data)
}

http.ServerResponse.prototype.json = function(data) {
  this.setHeader('Content-Type', 'application/json; charset=utf-8')
  this.end(JSON.stringify(data))
}

var router = Router()

router.use(function(req, res, next) {
  if (req._parsedUrl && req._parsedUrl.query) {
    req.query = qs.parse(req._parsedUrl.query)
  }
  next()
})

router.get('/', function(req, res, next) {
  var ip = req.query.ip
  var result = geo.lookup(ip)

  res.json(result)
})

router.use('*', function(req, res) {
  res.statusCode = 404
  res.text('Not found')
})

router.use(function(err, req, res, next) {
  console.error(err)
  console.error(err.stack)

  res.statusCode = 500
  res.text('Internal Server Error')
})

var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res))
})

server.listen(process.env.PORT || 8888)
