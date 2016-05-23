var cluster = require('cluster');
var express=require("express");
var app=express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var collection = require('strong-store-cluster').collection('test');
var key = 'dataKey';

// Does not install own `express` modules
var ClusterStore = require('strong-cluster-connect-store')(session);
 
var app = express();
 
app
  .use(cookieParser())
  .use(session({
    secret: 'This is secret key',
    store: new ClusterStore(), // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));


app.get('/',function(req,res){
	collection.get(key, function(err, obj) {
    if (err) {
      console.error('There was an error in collection.get.', err);
      return;
    }
 
    // You now have the object
    console.log('The object: ', obj);
  });
	var workerId = cluster.worker.id;
	var workerProcessId = cluster.worker.process.pid;
    res.send('Hello from Worker ' + workerId + ' as process ' + workerProcessId);
});

app.listen(3000,function(){
    console.log("Running at PORT 3000");
});