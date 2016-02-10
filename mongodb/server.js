/*  BU BLOK SERVER TARAFI
    BU TARAFTA EXPRESS - CLIENT SIDE (ANGULAR.JS) İLE İLETİŞİME GEÇECEK.
    EXPRESS - MONGOdb (MONGOJS) İLE İLETİŞİME GEÇEREK DATABASE'E ERİŞİM SAĞLAYACAK.
    MONGOJS mongodb ile konuşarak data kaydetme ve data getirme işleriyle ilgilenecek.
*/


var application_root = __dirname,
    express = require("express"),
    path = require("path");

/*mongodb url address : // "username:password@example.com/mydb" */
/*The databaseUrl can contain the database server host and port along with the database name to connect to.By
default the host is“ localhost” and the port is“ 27017“.If you’ re using the
default, which is likely on a developer environment, the databaseUrl can contain just the actual database name
for our app.*/

var databaseUrl = "mydb2"; // "username:password@example.com/mydb"
var collections = ["users"];
var mongojs = require("mongojs");
var db = mongojs(databaseUrl, collections);

var app = express();


// Config Parameters

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


/* check the health of application */
app.get('/api', function(req, res) {
    res.send('Ecomm API is running');
});

/* DATA OUT FROM DB */
/* /getangularusers kanalına girdiğinde , bu kısım otomatik var olan dataları databaseden çekerek ekrana JSON halinde basacak. */
app.get('/getangularusers', function(req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");

    try {
        db.users.find('', function(err, users) {
            if (err || !users) console.log("No users found");
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                str = '[';
                users.forEach(function(user) {
                    str = str + '{ "name" : "' + user.username + '"},' + '\n';
                });
                str = str.trim();
                str = str.substring(0, str.length - 1);
                str = str + ']';
                res.end(str);
            }
        });
    } catch (err) {
        console.log(" SOMETHING WENT WRONG SINCE : " + err);
    }
});

/* DATA IN DB */
/* burada request in body'sine gömülmüş bir data var o datayı alıyor parse ediyor adamımız. */
app.post('/insertangularmongouser', function(req, res) {
    console.log("POST: ");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //user = req.body.username;
    //passwd = req.body.password;
    //emailid = req.body.email;
    console.log(req.body);
    console.log(req.body.mydata);
    var jsonData = JSON.parse(req.body.mydata);
    console.log(jsonData.username);
    console.log(jsonData.password);
    console.log(jsonData.email);
    console.log(" IT WILL TRY TO SAVE IT !! ");

    db.users.save({
        email: "srirangan@gmail.com",
        password: "iLoveMongo",
        username: "female"
    }, function(err, saved) {
        if (err || !saved) console.log("User not saved since : " + err);
        else console.log("User saved");
    });

    try {
        db.users.save({
            email: jsonData.email,
            password: jsonData.password,
            username: jsonData.username
        }, function(err, saved) {
            if (err || !saved) res.end("User not saved");
            else res.end("User saved");
        });
    } catch (err) {
        console.log(" SOMETHING WENT WRONG ");
    }
});








app.listen(1212);
console.log("start to listen 1212");
