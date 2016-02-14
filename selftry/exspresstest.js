var application_root = __dirname;

var express = require("express");
var path = require("path");
var fs = require('fs');

var app = express();
var port = 8888;

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.static(path.join(application_root, "js")));
    app.use(express.errorHandler({
        dumpExceptions: false,
        showStack: false
    }));
});




app.get('/goal', function(req, res) {
    res.send('Goal is running');
});

app.get('/health', function(req, res) {
    fs.readFile("clientTest.html", function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write(error + " opps this doesn't exist - 404");
            res.end();
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.write(data, "utf8");
            res.end();
        }
    });
});





app.listen(port);

console.log("app starts to listen localhost:" + port);
