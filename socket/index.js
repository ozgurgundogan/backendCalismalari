var express = require("express");
var app = express();
var port = 8888;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.render("page");
});

var sockets = [];



var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {


    /* put a receiver to get sent messages*/

    socket.on('send', function(data) {
        if (data.message) {
            io.sockets.emit(data.toWhom, data);
            io.sockets.emit(data.fromWhom, data);
        }
    });


    /*user ayrılırken server a böyle bir mesaj yolluyor*/
    socket.on('leaving', function(data) {

        console.log("lentgh Before : " + sockets.length);


        var socketIndex = sockets.indexOf(data);



        for (var k = 0; k < sockets.length; k++) {
            if (sockets[k].id == data.id) {
                if (sockets[k].name == data.name) {
                    socketIndex = k;
                }
            }
        }




        if (socketIndex > -1) {
            sockets.splice(socketIndex, 1);

        }

        console.log("lentgh After : " + sockets.length);
        console.log(" ");

        io.sockets.emit("onlineUserNumber", {
            length: sockets.length,
            availableSockets: sockets
        });

        try {
            socket.disconnect('unauthorized');
        } catch (err) {
            try {
                socket.disconnect(true);
            } catch (err) {
                try {
                    socket.close();
                } catch (err) {
                    console.log("socket can not be closed");
                }
            }
        }

    });


    /*yeni gelen user kendi bilgilerini girdikten buraya mesaj yolluyor.*/
    socket.on('userInfoToServer', function(data) {
        /* gelen json kaydet */
        sockets.push(data);
        console.log("sockets length : " + sockets.length);
        io.sockets.emit("onlineUserNumber", {
            length: sockets.length,
            availableSockets: sockets
        });


    });

});


console.log("Listening on port " + port);
console.log("");
