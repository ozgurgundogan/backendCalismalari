/*
    STRUCTURES

    ROOM STRUCTURE
    
        - creator ?
        - creation time stamp ? 
        - main issue or name
        - sub issues 

    MESSAGE STRUCTURE

        - sender ? 
        - which room , roomname
        - creation timestamp


    USER STRUCTURE
        - userid
        - username
*/












var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;

var port = 3601;

var maxKeyCountForRoomNumber = 2000;

var db;
/*
 *
 *     JADE RENDER ISSUE
 *
 */
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));



/* işe başlarken hemen rooms collection ını yaratıyoruz. Odaların talk collectionları oda create edilirken yaratılacak.*/
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, dbb) {
    if (err) {
        console.log("kısmet olmadı");
    } else {

        con("database is created");



        db = dbb;



        if (typeof db !== undefined) {
            db.createCollection("rooms", function(err, collection) {
                if (err || !collection) console.log("Rooms collection can not be created");
                else {
                    con("Rooms collection has been created");
                    //dropAllCollections(" DROP : ");
                }
            });

        } else {
            con("database undefined");
        }




        getUsedDBCollections("    USED :  ");
        //dropAllCollections("    DROP ALL : ");
        //listCollection("rooms");
        //

    }
});






/*
 *
 *       ROUTING ISSUES
 *
 */
app.get("/", function(req, res) {
    res.render("page");
});




var io = require('socket.io').listen(app.listen(port), {
    log: false
});


// io.sockets.emit(data.toWhom, data);
io.sockets.on('connection', function(socket) {


    //* gelen mesaj database e kaydedilecek.*//
    /* user mesaj yollayacağı zaman send Kanalına bilgiyi iletir. Bilginin içinde hangi odaya mesaj yazdığı yer
    almaktadır. Server bu bilgiyi alıp, room un kanalına send eder.*/
    socket.on('send', function(data) {
        if (data.message) {
            io.sockets.emit(data.roomName, data);
        }
    });


    socket.on('newRoomFromClient', function(data) {
        if (data.userId && data.username && data.roomName) {

            createRoom(data.userId, data.username, data.roomName);

        }
    });


    socket.on('joiningToRoomFromClient', function(data) {
        con(data.userId + " wants to join to room {" + data.roomName + "}");
        /* gelen user id odaya katılmak isteyen kişinin user idsi. Bunu alıyoruzki user a geri mesaj basabilelim*/
        sentRoomInfoBackToUser(socket, data.roomName, data.userId);

    });

    socket.on('destroyRoomFromClient', function(data) {
        con(data.userId + " wants to destroy to room {" + data.roomName + "}");
        destroyRoom(data.roomName);
    });



    /**************************************************************************************/

    socket.on("startToSimulate", function(data) {
        setInterval(simulateMessageWritten, 4000);
    });
    
});






function createRoom(userIdOf, userNameOf, roomNameOf) {


    /*Odanın adına bak daha önce set edilmiş mi diye ? 
      Set Edilmemişse boş olan bir id bul . Bulduğun o idye kütürt diye yeni odayı yerleştir.*/
    //listCollection("rooms");
    con("create room");
    db.collection("rooms").find({
        roomName: roomNameOf
    }, function(err, roomCursor) {
        if (err) {
            con("Something went wrong in finding room since : " + err);
        }

        roomCursor.count(function(err, count) {
            if (count == 0) {
                con(roomNameOf + " can not be found");
                db.collection("rooms").insert({
                    userId: userIdOf,
                    userName: userNameOf,
                    roomName: roomNameOf
                }, function(err, saved) {
                    if (err || !saved) con("Room {" + roomNameOf + "} has been saved into rooms collection");
                    else con("Room {" + roomNameOf + "} has been saved into rooms collection");
                });

                listCollection("rooms");


                //* odanın talk collectionını yarat*//
                db.createCollection(String(roomNameOf), function(err, collection) {
                    if (err || !collection) con("Room {" + roomNameOf + "} has not been created");
                    else con("Room {" + roomNameOf + "} has been created");
                });

                /* tüm socketlere yeni oda açıldığının bilgisini yolla*/
                io.sockets.emit("newRoomFromServer", {
                    roomName: roomNameOf
                });

            } else if (count == 1) {
                con(roomNameOf + " already exists !");
                io.sockets.emit("user_" + userIdOf, {
                    issue: "newRoom",
                    message: "Room is Already Exist"
                });
            } else {
                con(count + " fucked up");
            }
        });

    });
}


function destroyRoom(roomNameOf) {
    con("destroy room");
    db.collection("rooms").find({
        roomName: roomNameOf
    }, function(err, roomCursor) {
        if (err) {
            con("Something went wrong in finding room since : " + err);
        }

        roomCursor.count(function(err, count) {
            if (count == 0) {

            } else if (count == 1) {

                roomCursor.toArray(function(err, room) {
                    con(room.length);
                    data = {
                        userId: room[0].userId,
                        userName: room[0].userName,
                        roomName: room[0].roomName
                    };

                    io.sockets.emit("destroyRoomFromServer", data);
                });

                db.collection("rooms").removeOne({
                    roomName: roomNameOf
                });

                listCollection("rooms");

                dropCollection(roomNameOf);

            } else {
                con(count + " fucked up");
            }
        });

    });

}



/* bir user yeni bir odaya katılırken kendi id, username ve roomidsini server a bildirir.
Server bu userid yi kullanarak bu user idye oda hakkındaki bilgileri yollar. */
function sentRoomInfoBackToUser(socket, roomName, userId) {

    var data;
    db.collection("rooms").find({
        roomName: roomName
    }, function(err, rooms) {
        if (err || !rooms) console.log("No room found");
        else if (rooms !== null) {
            rooms.count(function(err, count) {
                if (count == 0) {
                    con("Nothing found in rooms collection");
                } else {
                    con(" there are " + count + " item");
                    rooms.each(function(err, doc) {
                        if (doc !== null) {
                            data = {
                                issue: "joinRoom",
                                userId: doc.userId,
                                userName: doc.userName,
                                roomName: doc.roomName
                            };

                            socket.emit('user_' + userId, data);

                        } else {
                            //con("errrrrrrrrrrrrrrrr");
                        }
                    });
                }
            });
        }
    });



}


function simulateMessageWritten() {

    con(" simulate message writing ");
    io.sockets.emit("adinizelihakoydum", {
        ownerId: "1234455",
        message: "AAAAAAAAAAAAAAAAAAAAAAAAAAA",
        timestamp: "01:02:35",
        roomName: "adinizelihakoydum"
    });

    io.sockets.emit("adinizelihakoydum", {
        ownerId: "1234455",
        message: "BBBBBBBBBBBBBBBBBBBBBBBBBB",
        timestamp: "01:02:35",
        roomName: "adinizelihakoydum1"
    });

    io.sockets.emit("adinizelihakoydum", {
        ownerId: "1234455",
        message: "CCCCCCCCCCCCCCCCCCCCCC",
        timestamp: "01:02:35",
        roomName: "adinizelihakoydum2"
    });



}

/**/
function listCollection(collectionName) {
    var cursor = db.collection(collectionName).find();

    cursor.count(function(err, count) {
        if (count == 0) {
            con("Nothing found in " + collectionName  + " collection");
        } else {
            cursor.each(function(err, doc) {
                if (doc !== undefined || doc !== null) {
                    console.log(collectionName + " =====>>");
                    con(doc);
                }
            });
        }
    });

}

function dropCollection(collectionName) {

    getUsedDBCollections("Before Drop: ");
    db.collection(collectionName).drop(function(err, reply) {
        if (err) {
            con("Error in drop Collection");
        } else {
            getUsedDBCollections("After Drop: ");
        }
    });

}

function dropAllCollections(header) {
    db.collections(function(err, collections) {

        if (collections.length == 0) {
            con(header + " There is no collection !");
        }

        for (var i = 0; i < collections.length; i++) {
            con(header + " " + collections[i].collectionName + " will be dropped out");
            dropCollection(String(collections[i].collectionName));
        };
    });

}

function getUsedDBCollections(header) {
    db.collections(function(err, collections) {

        if (collections.length == 0) {
            con(header + " There are no used collection !");
        }

        for (var i = 0; i < collections.length; i++) {
            con(header + " " + collections[i].collectionName);

            listCollection(collections[i].collectionName);
        };
    });
}

function con(logString) {
    console.log(logString);
    console.log("");
}



con("Listening on port " + port);
