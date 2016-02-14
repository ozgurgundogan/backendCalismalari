var socket;
var userName = "ozgur";
var userId = "123";
var currentlyOpenRoomName = "adinizelihakoydum";

var unreadMessages = [];
var readMessages = [];


/*katınılan odaların bilgilerini tutar*/
var roomInfos = [];


window.onload = function() {

    socket = io.connect('http://localhost:3601');

    if (socket !== undefined) {


        /*user kendisine gelecek mesajlar için kullanılacak.
        Bu daha çok user ı server tarafından bilgilendirmek için kullanılacak olan channel*/
        socket.on("user_" + userId, function(data) {


            if (data.issue === "newIssue") {
                console.log(data.message);
            } else if (data.issue === "joinRoom") {
                console.log(userId + " joined to " + data.roomName);
                roomInfos.push({
                    userId: data.userId,
                    userName: data.userName,
                    roomName: data.roomName
                });

                socket.emit('startToSimulate',
                    "test"
                );

            }

        });

        /*Yeni bir oda açıldığında serverdan oda hakkında bilgi mesajı gelir */
        socket.on("newRoomFromServer", function(data) {
            console.log("Created room : " + data.roomName);

        });


        /* Herhangi bir oda destroy edildiğinde server tarafından kullanılacak channel*/
        socket.on("destroyRoomFromServer", function(data) {
            console.log(data.roomName + " is destroyed");

        });

        //createNewRoom("adinizelihakoydum");
        //destroyRoom("adinizelihakoydum");
        joinARoom("adinizelihakoydum");


        setInterval(simulateSendMessage, 200);
    }


};

function simulateSendMessage() {
	
    sentMessageToARoom("adinizelihakoydum", "Beşiktaş" );
}

function simulateLeaveRoom() {
	console.log("simulate Leave Room");
    leaveFromARoom("adinizelihakoydum");
}

/* bir user yeni bir odaya katılırken kendi id, username ve roomidsini server a bildirir.
Server bu userid yi kullanarak bu user idye oda hakkındaki bilgileri yollar. */
function joinARoom(roomNameOf) {

    socket.emit('joiningToRoomFromClient', {
        userId: userId,
        username: userName,
        roomName: roomNameOf
    });

    //getOldMessageFromARoom(roomId);

    //after joining start to listen room messages.
    socket.on(roomNameOf, handleComingMessages);
}


/* odadan ayrılırken server ı bilgilendirmemize gerek yok. Listener ı öldürsek yeter.*/
function leaveFromARoom(roomNameOf) {

    //remove listener.
    // to remove listener you have to give the same function to handle. O yüzden bu kısım için handleComingMessage fonksiyonunun içeriği hiç önemli değil.
    socket.removeListener(roomNameOf, handleComingMessages);
}


/* Yeni katılınılan oda dinlenmeye başlanır. 
Oda üzerinden gelen mesajların listenerı bu fonksiyondur.*/
function handleComingMessages(message) {


    //* eger şu an ekranda bu oda açık ise direk mesajları okunan mesajlar arrayine ekle ve ekrana bas.*//
    if (message.roomName === currentlyOpenRoomName) {
        console.log(message.message);

        //* eger şu an ekranda bu oda açık değil ise mesajları okunMAMIŞ mesajlar arrayine ekle ve bekle.*//
    } else {
        console.log(message.roomName);

    }

}






/* user mesaj yollayacağı zaman send Kanalına bilgiyi iletir. Bilginin içinde hangi odaya mesaj yazdığı yer
    almaktadır. Server bu bilgiyi alıp, room un kanalına send eder.*/
function sentMessageToARoom(roomName, message) {
    
    socket.emit("send", {
        id: userId,
        username: userName,
        roomName: roomName,
        message: message,
        timestamp: getTimeStamp()
    });
}

function getOldMessageFromARoom(roomId) {
    //* idsi verilen room'un databasedeki son 50 mesajını getir. Bu method'u user room ilk defa açtığında kullanacağız.*//
    //* old messajları getirdiğinde bunları okunmuş mesaj arrayine ekle.*//

    var url = 'http://localhost:1212/gettalks?roomId=' + roomId;
    $http.get(url).success(function(data) {
        /*do whatever you want with data*/
    });


}


function getOldMessageFromARoom(roomId, offset) {

    //*bu kısım scroll dinleme tarafından tetiklenecek*//
    //* idsi verilen room'un databasedeki offset fazlasından sonrasının 50 tanesini getir. *//
    //* old messajları getirdiğinde bunları okunmuş mesaj arrayinin BAŞINA ekle.*//

    var url = 'http://localhost:1212/gettalks?roomId=' + roomId + "&offset=" + offset;
    $http.get(url).success(function(data) {
        /*do whatever you want with data*/
    });
}


function changeCurrentRoomToAnotherRoom(destinationRoomId) {
    currentlyOpenRoomId = destinationRoomId;
    // burada destination room'un okunmamış mesajlarını okunmuş mesajlara geçiriyoruz
    unreadMessageToReadMessageForARoom(destinationRoomId);
}

function unreadMessageToReadMessageForARoom(roomId) {

    for (var i = 0; i < unreadMessages.length; i++) {
        if (unreadMessages[i].roomId == roomId) {
            readMessages.push(unreadMessages[i]);
            unreadMessages.splice(i, 1);
            i--; /*unread messajlardan bir mesaj eksilttiğimizden i 'yi arttırmamamız*/
        }
    }

}

function createNewRoom(roomName) {
    /*serverdan databaseden yeni açılan room a ait room id ajax ile alınabilinir.*/
    socket.emit('newRoomFromClient', {
        userId: userId,
        username: userName,
        roomName: roomName
    });

}


function destroyRoom(roomName) {
    /*serverdan databaseden yeni açılan room a ait room id ajax ile alınabilinir.*/
    socket.emit('destroyRoomFromClient', {
        roomName: roomName
    });

}





function getTimeStamp() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + "_" + minutes + "_" + seconds;

    return str;
}
