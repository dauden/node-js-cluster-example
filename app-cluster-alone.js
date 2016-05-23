var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
 
if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork(); // create a worker
    console.log('create a worker');
  }
 
  cluster.on('exit', function(worker, code, signal) {
    // Do something when a worker crashes, typically
    // log the crash and start a new worker. 
    console.log('log the crash and start a new worker');
  });
} else {
  // Workers can share any TCP connection.
  // In this case its a HTTP server.
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
}