/*
* Setting up clusters and master slaves
*/
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster)
{
    for (var i = 0; i < numCPUs; i++) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) =>
    {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    require("./server/server.js");
}
