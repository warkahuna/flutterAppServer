var mosca = require('mosca');
var settings = {
		port:8520
		}

var server = new mosca.Server(settings);

server.on('ready', function(){
console.log("ready");
});