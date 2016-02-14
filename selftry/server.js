var application_root = __dirname;

var express = require("express");
var path = require("path");
var mongojs = require("mongojs");
var socketio = require('socket.io');
var fs = require('fs');

/*below is all about application*/
var app = express();
var port = 8888;


/*below is all about database*/
var localDatabaseName = "chdb";
var databaseTableName = ["talks", "rooms"];
var db = mongojs(localDatabaseName, databaseTableName);

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



var maxKeyCountForRoomNumber = 2000;
var roomsArray = {};

/*

TUM SOCKETLERE MESAJ YOLLAMAK ICIN
io.sockets.emit(data.fromWhom, data);

*/

/*below is all about routing*/

app.get('/health', function(req, res) {
    res.send('App is running');
});

app.get('/health', function(req, res) {
    res.render('App is running');
});

//get from database
app.get('/gettalks', function(req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");

    try {
        chdb.talks.find('', function(err, users) {
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

app.get('/', function(req, res) {

    fs.readFile(__dirname + "\\clientTest.html", function(error, data) {
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


//insert talk
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






/*below is all about sockets*/

var io = socketio.listen(app.listen(port), { log: false });
console.log("App starts to listen port : " + port);

io.sockets.on('connection', function(socket) {


    //* gelen mesaj database e kaydedilecek.*//
    /* user mesaj yollayacağı zaman send Kanalına bilgiyi iletir. Bilginin içinde hangi odaya mesaj yazdığı yer
    almaktadır. Server bu bilgiyi alıp, room un kanalına send eder.*/
    socket.on('send', function(data) {
        if (data.message) {
            io.sockets.emit("room" + data.roomId, data);
        }
    });


    socket.on('newRoomFromClient', function(data) {
        if (data.userId && data.username && data.roomName) {

            setRoomNumber(data.userId, data.username, data.roomName);

        }
    });


    socket.on('joiningToRoomFromClient', function(data) {
        //sentRoomInfoBackToUser(socket);
        socket.emit('joiningToRoomFromServer', "ozgur");
       //checkFunction(socket);
        console.log("joiningToRoomFromClient");
    });


});

function checkFunction(socket){
     socket.emit('joiningToRoomFromServer', "ozgur");
};


function setRoomNumber(userId, userName, roomName) {


    for (var i = 0; i < maxKeyCountForRoomNumber; i++) {
        if (!(String(i) in items)) {

            /* odayı arraye ve databasee kaydet */
            roomsArray[String(i)] = {
                roomName
            };

            db.rooms.save({
                userId: userId,
                userName: userName,
                roomName: roomName,
                roomId: String(i)
            }, function(err, saved) {
                if (err || !saved) res.end("User not saved");
                else res.end("User saved");
            });

            /* tüm socketlere böyle birşeyin varlığı hakkında bilgi ver*/
            io.sockets.emit("newRoomFromServer", {
                roomName: roomName
            });
        }
    };

}


/* bir user yeni bir odaya katılırken kendi id, username ve roomidsini server a bildirir.
Server bu userid yi kullanarak bu user idye oda hakkındaki bilgileri yollar. */
function sentRoomInfoBackToUser(socket, roomId) {

    var data;
    db.rooms.find({
        roomId: roomId
    }, function(err, room) {
        if (err || !users) console.log("No users found");
        else {

            data = {
                userId: room.userId,
                userName: room.userName,
                roomName: room.roomName,
                roomId: roomId
            };
        }
    });

    socket.emit('joiningToRoomFromServer', data);

}
