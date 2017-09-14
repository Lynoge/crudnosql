
/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes/routes');

var app = module.exports = express.createServer();

app.set('port', (process.env.PORT || 5000));

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.todo);
app.get('/todo', routes.todo);
app.get('/removeAll', routes.removeAll);
app.post('/save', routes.saveTodo);
app.get('/getKeys', routes.getKeys);
app.get('/remove', routes.removeTodo);
//app.listen(4000, function(){
//  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
//});

app.listen(5000, function() {
	console.log('Servidor Inicializado na Porta', 5000);
});
