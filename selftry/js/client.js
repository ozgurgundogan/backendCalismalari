var socket;
var userName;
var userId;
var currentlyOpenRoomId;

var unreadMessages = [];
var readMessages = [];


/*katınılan odaların bilgilerini tutar*/
var roomInfo = [];



/*client.js yüklendiğinde çağrılır.*/
window.onload = function() {


    alert("Load it bitch");
    if (window.jQuery) {
        // jQuery is loaded    alert("Yeah!");
    } else {
        // jQuery is not loaded
        alert("Jquery Doesn't Work");
    }



    //socket = io.connect('http://localhost:8888');

    try {
        
        socket = io.connect('http://localhost:8888/');
    } catch (e) {
        alert('Sorry, we couldn\'t connect. Please try again later \n\n' + e);
    }

    if (socket !== undefined) {

        // run our program

    }

    joinARoom(5);


    /*Yeni bir oda açıldığında serverdan oda hakkında bilgi mesajı gelir */
    socket.on("newRoomFromServer", function(data) {

    });


    /* bir user yeni bir odaya katılırken kendi id, username ve roomidsini server a bildirir.
    Server bu userid yi kullanarak bu user idye oda hakkındaki bilgileri yollar. Gelen bu bilgiler 
    roomInfoArrayinin içine kaydedilir.*/
    socket.on("joiningToRoomFromServer", function(data) {
        console.log("joiningToRoomFromServer");
        roomInfos.push({
            userId: data.userId,
            userName: data.userName,
            roomName: data.roomName,
            roomId: data.roomId
        });

    });

    userId = "123";
    userName = " Ozgur Gundogan";

    console.log(userId);
    console.log(userName);

    

}



/* bir user yeni bir odaya katılırken kendi id, username ve roomidsini server a bildirir.
Server bu userid yi kullanarak bu user idye oda hakkındaki bilgileri yollar. */
function joinARoom(roomId) {

    console.log("join a room " + roomId);

    socket.emit('joiningToRoomFromClient', {
        id: userId,
        username: userName,
        roomId: roomId
    });

    //getOldMessageFromARoom(roomId);

    //after joining start to listen room messages.
    socket.on("room" + String(roomId), handleComingMessages);
}


/* odadan ayrılırken server ı bilgilendirmemize gerek yok. Listener ı öldürsek yeter.*/
function leaveFromARoom(roomId) {

    //remove listener.
    // to remove listener you have to give the same function to handle. O yüzden bu kısım için handleComingMessage fonksiyonunun içeriği hiç önemli değil.
    socket.removeListener("room" + String(roomId), handleComingMessages);
}


/* Yeni katılınılan oda dinlenmeye başlanır. 
Oda üzerinden gelen mesajların listenerı bu fonksiyondur.*/
function handleComingMessages(message) {

    //* eger şu an ekranda bu oda açık ise direk mesajları okunan mesajlar arrayine ekle ve ekrana bas.*//
    if (message.roomId == currentlyOpenRoomId) {

        //* eger şu an ekranda bu oda açık değil ise mesajları okunMAMIŞ mesajlar arrayine ekle ve bekle.*//
    } else {

    }

}

/* user mesaj yollayacağı zaman send Kanalına bilgiyi iletir. Bilginin içinde hangi odaya mesaj yazdığı yer
    almaktadır. Server bu bilgiyi alıp, room un kanalına send eder.*/
function sentMessageToARoom(roomId, message) {
    socket.emit("send", {
        id: userId,
        username: userName,
        roomId: roomId,
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
