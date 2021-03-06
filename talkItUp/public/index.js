/*
    documentready function generally is used for listeners and others
*/

var userId;
var userName;


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
