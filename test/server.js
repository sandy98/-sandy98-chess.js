#!/usr/bin/env node

(function() {
var Router, argv, http, router, server, clean_up;

try {
Router = require('node-simple-router');
} catch (e) {
console.log('node-simple-router must be installed for this to work');
process.exit(-1);
}

http = require('http');

router = Router({
list_dir: true
});

/*
Example routes
*/


/*
End of example routes
*/


argv = process.argv.slice(2);

server = http.createServer(router);

server.on('listening', function() {
  var addr;
  addr = server.address() || {
    address: '0.0.0.0',
    port: argv[0] || 8000
  };
  return router.log("Serving web content at " + addr.address + ":" + addr.port + " - PID: " + process.pid);
});

clean_up = function() {
  router.log(" ");
  router.log("Server shutting up...");
  router.log(" ");
  server.close();
  return process.exit(0);
};

process.on('SIGINT', clean_up);
process.on('SIGHUP', clean_up);
process.on('SIGQUIT', clean_up);
process.on('SIGTERM', clean_up);

server.listen((argv[0] != null) && !isNaN(parseInt(argv[0])) ? parseInt(argv[0]) : 8000);

}).call(this);
