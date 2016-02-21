/*
    documentready function generally is used for listeners and others
*/

var socket;
var userName = "ozgur";
var userId = "123";
var currentlyOpenRoomName = "adinizelihakoydum";

var unreadMessages = [];
var readMessages = [];

/*katınılan odaların bilgilerini tutar*/
var roomInfos = [];


var sideNavSubjects = [{
    subjectName: 'Su testisi su yolunda kırılır Su testisi su yolunda kırılır',
    subjectId: 1,
    subSubject: ['A1', 'A2', 'A3'],
    whoCreated: "EndoplazmikBirRetikulum",
    createdDate: "12-05-16 15:30:24",
    numberOfPerson: 11
}, {
    subjectName: 'Parfüm için yardım Parfüm için yardım Parfüm için yardım',
    subjectId: 2,
    subSubject: ['B1', 'B2', 'B3'],
    whoCreated: "EndoplazmikBirRetikulum",
    createdDate: "12-05-16 15:30:24",
    numberOfPerson: 7
}, {
    subjectName: 'C',
    subjectId: 3,
    subSubject: ['C1', 'C2', 'C3'],
    whoCreated: "EndoplazmikBirRetikulum",
    createdDate: "12-05-16 15:30:24",
    numberOfPerson: 3
}];

var talkingSpaceTabs = [];


var currentPageTalks = [];


angular.module('offApp', []).controller('offAppController', function($scope) {
    $scope.sideNavSubjects = sideNavSubjects;
    $scope.$watch('sideNavSubjects', function(newValue, OldValue) {
        $scope.sideNavSubjects = sideNavSubjects;
    });

    $scope.talkingSpaceTabs = talkingSpaceTabs;
    $scope.$watch('talkingSpaceTabs', function(newValue, OldValue) {
        $scope.talkingSpaceTabs = talkingSpaceTabs;
    });

    $scope.currentPageTalks = currentPageTalks;
    $scope.$watch('currentPageTalks', function(newValue, OldValue) {
        $scope.currentPageTalks = currentPageTalks;
    });
});

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



$(document).ready(function() {

    function setHeight() {
        windowHeight = $(window).innerHeight();
        $('.row.content').css('min-height', windowHeight);
        $('.row.content').css('height', windowHeight);
    };
    setHeight();

    $(window).resize(function() {
        setHeight();
    });


    checkChildsOfSubject();

    $(document).keypress(function(e) {
        if (e.which == 13) {
            if ($('#myModal').is(":visible")) {
                // $('#issueCreateSubmitButton')[0].onclick();
            } else {
                alert('You pressed enter!');
            }
        }
    });

    $('#newIssueForm').submit(function(e) {
        console.log("create new subject function");


        mainIssue = $('#mainIssue').val();
        subIssue = $('#subIssue').val();
        addSubject(mainIssue, subIssue);

        e.preventDefault();
        $('#myModal').modal('hide');
        $('#mainIssue').val('');
        $('#subIssue').val('');
        $('#newIssueButton').focusout();
        checkChildsOfSubject();
        return true;
    });

    $('#myModal').on('shown.bs.modal', function() {
        $('#mainIssue').focus();
    })




    // $('#mainIssue').keypress(function(e) {
    //     if (e.keyCode == 0 || e.keyCode == 32) {
    //         inputValue = $(this).val();
    //         $(this).val('');
    //         $(this).append('<button type="button" class="btn btn-info">' + inputValue + '</button>');

    //         console.log('space pressed from main');
    //         console.log($('#mainIssue').val());

    //     }
    // });

    // $('#subIssue').keypress(function(e) {
    //     if (e.keyCode == 0 || e.keyCode == 32) { // `0` works in mozilla and `320 in other`}
    //         console.log('space pressed from sub');
    //         console.log($('#subIssue').val());
    //     }
    // });



});


function checkChildsOfSubject() {
    $(".nav-stacked").children("li").click(function() {
        $(".active").removeClass("active");
        $(this).addClass("active");
    });
};



function addSubject(subjectName, subjectid, subIssues, createdDate) {

    console.log("add subject function");

    console.log("length before : " + sideNavSubjects.length);
    sideNavSubjects.push({
        subjectName: subjectName,
        subjectId: subjectid,
        subSubject: subIssues,
        whoCreated: userName,
        createdDate: createdDate,
        numberOfPerson: 0
    });

    console.log("length after : " + sideNavSubjects.length);

    scope = angular.element($('#sideSubjectNavigation')).scope();
    scope.$apply();
};


function openSubject(subjectId) {


    subjectRealId = subjectId.split('_');

    if (subjectRealId.length == 2) {
        subjectRealId = subjectRealId[1];
    }

    var possibleSubject = $.grep(sideNavSubjects, function(e) {
        return e.subjectId == subjectRealId;
    });

    var isItAlreadOpened = $.grep(talkingSpaceTabs, function(e) {
        return e.subjectId == subjectRealId;
    });

    if (isItAlreadOpened.length != 0) {
        setTimeout(switchSubjectWithChangingId, 20, subjectId);
        return 1;
    }

    if (possibleSubject.length == 1) {
        talkingSpaceTabs.push({
            subjectName: possibleSubject[0].subjectName,
            subjectId: possibleSubject[0].subjectId,
            subSubject: possibleSubject[0].subSubject,
            whoCreated: possibleSubject[0].whoCreated,
            createdDate: possibleSubject[0].createdDate,
            numberOfPerson: possibleSubject[0].numberOfPerson,
            unseenMessageCounts: 0,
            talks: []
        });
    }



    scope = angular.element($('#talkingSpaceMenu')).scope();
    scope.$apply();

    setTimeout(switchSubjectWithChangingId, 20, subjectId);

};


function switchSubjectWithChangingId(subjectId) {

    subjectRealId = subjectId.split('_');

    if (subjectRealId.length == 2) {
        subjectRealId = subjectRealId[1];
    }

    $(".nav-tabs").children("li.active").removeClass("active");
    $("#talkingSpaceTabId_" + subjectRealId).parent().addClass("active");
    $("#talkingSpaceTabId_" + subjectRealId).children("span:first").remove();
    switchSubject(subjectRealId);
}


function switchSubject(subjectRealId) {

    var possibleSubject = $.grep(talkingSpaceTabs, function(e) {
        return e.subjectId == subjectRealId;
    });

    if (possibleSubject.length == 1) {

        $("#subSubjects").empty();
        for (var i = 0; i < possibleSubject[0].subSubject.length; i++) {
            var item = "<span class = \"label label-warning add-left-margin\"> " + possibleSubject[0].subSubject[i] + " </span>";
            $("#subSubjects").append(item);
        };

        var item = "<span class=\"badge pull-right\"> " + possibleSubject[0].numberOfPerson + " Person </span>";
        $("#subSubjects").append(item);


        currentPageTalks.length = 0;
        clonableTalks = possibleSubject[0].talks.slice(0);

        for (var l = 0; l < clonableTalks.length; l++) {
            currentPageTalks.push(clonableTalks[l]);
        };

        scope = angular.element($('#showTalks')).scope();
        scope.$apply();

    }

}

function showCloseButton(element) {

    $(element).children("a").children(".closeButton").css('visibility', 'visible');

}


function hiddenCloseButton(element) {

    $(element).children("a").children(".closeButton").css('visibility', 'hidden');
}


function closeRoom(roomId) {
    subjectRealId = roomId.split('_');

    if (subjectRealId.length == 2) {
        subjectRealId = subjectRealId[1];
    }

    console.log(talkingSpaceTabs.length);




    clonableTalks = talkingSpaceTabs.slice(0);

    talkingSpaceTabs.length = 0;

    for (var l = 0; l < clonableTalks.length; l++) {
        if (clonableTalks[l].subjectId != subjectRealId) {
            talkingSpaceTabs.push(clonableTalks[l]);
        }
    };




    $("#subSubjects").empty();
    currentPageTalks.length = 0;


    scope = angular.element($('#talkingSpaceMenu')).scope();
    scope.$apply();

    scope = angular.element($('#showTalks')).scope();
    scope.$apply();



}

function simulateSendMessage() {

    sentMessageToARoom("adinizelihakoydum", "Beşiktaş");
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
