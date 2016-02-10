var application_root = __dirname,
    express = require("express"),
    path = require("path");

var app = express();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});


var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users", "reports"];
var mongojs = require("mongojs");
var db = mongojs(databaseUrl, collections);



db.users.find({
    sex: "female"
}, function(err, users) {
    if (err || !users) console.log("No female users found");
    else users.forEach(function(femaleUser) {
        console.log(femaleUser);
    });
});

db.users.save({
    email: "srirangan@gmail.com",
    password: "iLoveMongo",
    sex: "female"
}, function(err, saved) {
    if (err || !saved) console.log("User not saved");
    else console.log("User saved");
});


db.users.update({
    email: "srirangan@gmail.com"
}, {
    $set: {
        password: "iReallyLoveMongo"
    }
}, function(err, updated) {
    if (err || !updated) console.log("User not updated");
    else console.log("User updated");
});





app.post('/insertangularmongouser', function(req, res) {

    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Methods", "GET, POST");

    console.log("POST : ");

    //var jsonData = JSON.parse(req.body.mydata);
    db.users.save({
        email: "ozgur",
        password: "ozgur",
        sex: "ozgur"
    }, function(err, saved) {
        if (err || !saved) {console.log("Post User not saved");
        res.end("POST User not saved");
        }else {
            console.log("Post User saved");
            res.end("User saved");
        }
    });
});


app.listen(1212);
console.log("start to listen 1212");



//db.collection('users').drop();
//db.collection('reports').drop();
