var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  streamer = require('./routes/streamer'),
  redis = require('redis');

var app = module.exports = express();


app.configure(function(){
  app.set('views', __dirname + '/view');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Server-Sent-Events
app.get('/stream', streamer.out);
app.get('/stream/msg', streamer.msg);
app.get('/stream/:event_name', streamer.in);

// JSON API
app.get('/api', api.action);
app.get('/api/:action', api.action);
app.get('/api/:action/:data', api.action);

// redirect all others to the index (HTML5 history)
app.get('*/', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});