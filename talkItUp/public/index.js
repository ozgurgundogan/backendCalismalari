/*
    documentready function generally is used for listeners and others
*/

$(document).ready(function() {

    showtalkA = "11111dasda sda d ad ad ad sa da das < br/> < br > < br > dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br > ";


    showtalkB = "222222dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br > ";


    showtalkC = "33333dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br >";


    showtalkD = "444444dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br > < br > dasda sda d ad ad ad sa da das < br > < br >";

    function setHeight() {
        windowHeight = $(window).innerHeight();
        $('.row.content').css('min-height', windowHeight);
        $('.row.content').css('height', windowHeight);
    };
    setHeight();

    $(window).resize(function() {
        setHeight();
    });

    checkChildsOfOpenSubject();

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
        scope = angular.element($('#sideSubjectNavigation')).scope();

        mainIssue = $('#mainIssue').val();
        subIssue = $('#subIssue').val();
        addSubject(mainIssue, subIssue);
        scope.$apply();
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

function checkChildsOfOpenSubject() {
    $(".nav-tabs").children("li").click(function() {
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(this).children("a:first").children("span:first").remove();
        id = $(this).attr('id');
        if (id == 1) {
            $('#show-talks').html(showtalkA);
        } else if (id == 2) {
            $('#show-talks').html(showtalkB);
        } else if (id == 3) {
            $('#show-talks').html(showtalkC);
        } else {
            $('#show-talks').html(showtalkD);
        }
    });
};


function checkChildsOfSubject() {
    $(".nav-stacked").children("li").click(function() {
        $(".active").removeClass("active");
        $(this).addClass("active");
    });
};


var sideNavSubjects = [{
    name: 'A',
    subjectId: 'a'
}, {
    name: 'B',
    subjectId: 'b'
}, {
    name: 'C',
    subjectId: 'c'
}];

var talkingSpaceTabs = [{
    name: 'A',
    unseenMessageCounts: '2',
    numberOfPerson: '3',
    alias: 3
}, {
    name: 'B',
    unseenMessageCounts: '2',
    numberOfPerson: '3',
    alias: 3
}, {
    name: 'C',
    unseenMessageCounts: '2',
    numberOfPerson: '3',
    alias: 3
}, {
    name: 'D',
    unseenMessageCounts: '2',
    numberOfPerson: '3',
    alias: 3
}];


angular.module('offApp', []).controller('offAppController', function($scope) {
    $scope.sideNavSubjects = sideNavSubjects;
    $scope.$watch('sideNavSubjects', function(newValue, OldValue) {
        $scope.sideNavSubjects = sideNavSubjects;
    });

    $scope.talkingSpaceTabs = talkingSpaceTabs;
    $scope.$watch('talkingSpaceTabs', function(newValue, OldValue) {
        $scope.talkingSpaceTabs = talkingSpaceTabs;
    });
});





function addSubject(subjectName, subjectid) {

    console.log("add subject function");

    console.log("length before : " + sideNavSubjects.length);
    sideNavSubjects.push({
        name: subjectName,
        subjectId: subjectid
    });

    console.log("length after : " + sideNavSubjects.length);
};


function openSubject(subjectName, subjectid, numberOfPersonInSubject) {

    console.log("open subject");
    talkingSpaceTabs.push({
        name: subjectName,
        unseenMessageCounts: String(subjectid),
        numberOfPerson: String(numberOfPersonInSubject),
        alias: 3
    });

    scope = angular.element($('#talkingSpaceMenu')).scope();
    scope.$apply();
    checkChildsOfOpenSubject();

};