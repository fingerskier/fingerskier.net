var express = require('express')
,   routes = require('./routes')
,   api = require('./routes/api')
,   http = require('http')
,   path = require('path')
,   socket = require('./routes/socket');
// ,  streamer = require('./routes/streamer');
// ,  redis = require('redis');

var app = express();
var io = require('socket.io').listen(app);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

io.sockets.on('connection', socket);

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/api', api.action);
app.get('/api/:action', api.action);
app.get('/api/:action/:data', api.action);

app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});