var redis = require("redis");
    //client = redis.createClient();

// Cria Cliente Redis
// Porta e hostname são retirados de configuration -> endpoint do redislabs.com
var client = redis.createClient(10118, 
	'redis-10118.c15.us-east-1-2.ec2.cloud.redislabs.com', 
	{no_ready_check: true});

  client.auth('password', function(err){
	if (err) throw err;
});

client.on('connect', function () {
    console.log('Servidor Redis Conectado ...');
});

exports.todo = function(req, res){
  var anid= req.query['id'];
  var oldText="";
  console.log("View id is =>"+anid);
  if(anid=="" || anid==undefined){
    anid="";
    oldText="";
    console.log("if null callBack id is =>"+anid+" And text is =>"+oldText);	
    callBackExe();
  }
  else{
    client.hget("Todo1",anid, function(err, obj) {
      oldText=obj;
      callBackExe();
    });
  }
  
  function callBackExe(){
    var todos = [];
    client.hgetall("Todo1", function(err, objs) {
      for(var k in objs) {
        var newTodo = {
          text: objs[k],
          id:k
        };
        todos.push(newTodo);
      }
      console.log("callBack id is =>"+anid+" And text is =>"+oldText);	
      res.render('todo', {
        title: 'Nova lista de Tarefas',
        todos: todos,
	      anid:anid,
	      oldText:oldText
      });
    });
  } 
};

exports.saveTodo = function(req, res) {
  var newTodo = {};
  newTodo.name = req.body['todo-text'];
  var anid= req.body['id'];
  if(anid=="" || anid==undefined){
    console.log("save / edit id is =>"+anid);
    var d = new Date();
    var n = d.getTime();
    newTodo.id = n;
  }
  else{
    newTodo.id = anid;
  } 
  client.hset("Todo1", newTodo.id, newTodo.name);
  res.redirect("/todo");
};

exports.removeTodo = function(req, res) {
  var anid= req.query['id'];
  if(anid=="" || anid==undefined){  
    res.redirect("/todo");
  }
  else{  
    res.redirect("/todo");
    client.hdel("Todo1", anid);
  }
};

// flush all keys in the current db
exports.removeAll = function(req, res) {
	client.flushdb( function (err, succeeded) {
      if (err) {
        console.log("Problema ao limpar database"); 
        res.redirect("/todo");
      }
      else
      {
        console.log("Database limpo"); 
        res.redirect("/todo");
      }
  });
};

exports.getKeys = function(req, res) {
	var regex = req.query.regex || req.body['regex'] || "*";
	client.keys(regex, function(err, data) {
		if (err) {
			console.log("Problema ao pesquisar as keys:"+ err ); 
			res.redirect("/todo");
    }
    else{
      res.jason({data:data});
    }
	});
};



