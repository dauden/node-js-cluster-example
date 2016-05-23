var cluster = require('cluster');
var control = require('strong-cluster-control');
var numCPUs = require('os').cpus().length;
var collection = require('strong-store-cluster').collection('test');

var key = 'dataKey';
 
// don't let keys expire, ever - values are seconds to expire keys
collection.configure({ expireKeys: 0 });
 
// set a key in the current collect to the object
collection.set(key, {id: 1, name : { first: 'Anh', last: 'Nguyen'}}, function(err) {
  // now get the object we just set
  collection.acquire(key, function(err, keylock, value) {
    // Do something with the value…
 
    // Release the lock.
    keylock.release();
  });
});

// global setup here...
control.start({
  size: control.CPUS,
  shutdownTimeout: 5000,
  terminateTimeout: 5000,
  throttleDelay: 5000
}).on('error', function(er) {
  // don’t need to manually restart the workers
  console.log(er);
});

if (cluster.isMaster) {
//require._load(process.argv[2]);

  //for (var i = 0; i < numCPUs; i++) {
  //  cluster.fork();
  //}

  Object.keys(cluster.workers).forEach(function(id) {
    console.log("I am running with ID : " + cluster.workers[id].process.pid);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {

    //change this line to Your Node.js app entry point.
    require("./worker.js");
}