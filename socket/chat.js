
var socket;
var senderUser;
var name;
var receiverUser;

window.onload = function() {
	
	if (window.jQuery) {  
        // jQuery is loaded    alert("Yeah!");
    } else {
        // jQuery is not loaded
        alert("Jquery Doesn't Work");
    }

	var colors = ["#547F7E", "#FFBE69", "#FFA15C" , "#FF895C" , "#FFCA5C" , "#FFDA5C","#9BFF75", "#75FF7E", "#93FFBA" , "#93E9FF" , "#93CDFF", "#B578FF", "#8B77FF", "#FF7682" , "#FF9482", "#FF76CF" ];
	var chosenColorForUser = colors[Math.floor(Math.random()*colors.length)];
	var messages = [];
	socket = io.connect('http://'+location.host);
	
	senderUser = prompt("Please enter your id", "6431");
	var receiverId = document.getElementById("receiver");
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	name = prompt("Please enter your name", "Harry Potter");
	var userCounter = document.getElementById("userInfo");
	
	socket.emit('userInfoToServer', {id: senderUser, username: name });
	
	socket.on("onlineUserNumber", function (data) {
		if (data.length){
			var html = '';
			
			html += '<div>' + data.length + ' user online !</div>';
			html += '<div> ////id - ////username </div>';
			
			console.log("in socket number : " + data.availableSockets.length);
			
			for(var i=0; i<data.availableSockets.length; i++) {
				html += '<div>' + data.availableSockets[i].id + ' - ' + data.availableSockets[i].username + '</div>';
			}
			
			userCounter.innerHTML = html;
			userCounter.scrollTop = userCounter.scrollHeight;
		}
	});
	
	/*kullanicinin kendisi her zaman sender.
	bu sebeple sender ı dinlemesi gerekiyor.*/
	socket.on(senderUser, function (data) {
		if(data.message) {
			messages.push(data);
			var html = '';
			for(var i=0; i<messages.length; i++) {
				html += '<div style="color: #547F7E; display: inline ; position: absolute; right: 30px;">(' + messages[i].timestamp+') </div>' ;
				html += '<div style="color: '+ messages[i].messageUserColor +'; display: inline ;">' + (messages[i].username ? messages[i].username : 'Server') + ': </div>';
				html += '<div style="color: #FFFFFF; display: inline ;">' + messages[i].message + '</div><br />';
				//document.title =" ! "+  messages[i].username  + ' write you a message ';
				$.playSound('http://www.freesound.org/people/KeyKrusher/sounds/154953/download/154953__keykrusher__microwave-beep.wav');
			}
			content.innerHTML = html;
			content.scrollTop = content.scrollHeight;
		} else {
			console.log("There is a problem:", data);
		}
	});

	
	/* send methodu server tarafına send tag'i ile datayı yolluyor. Server tarafı parse edip yollanacak tarafa yolluyor*/
	sendButton.onclick = sendMessage = function() {
		
		receiverUser = receiverId.value;
		
		if(senderUser == "") {
			senderUser = prompt("Please enter your id", "Harry Potter");
		}
		
		if(receiverUser == "") {
			alert("Please type receiver user id!");
		}
		
		if(name.value == "") {
			alert("Please type your name!");
		} else {
						
			var text = field.value;
			var dt = new Date();
			var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
			socket.emit('send', { fromWhom: senderUser, toWhom: receiverUser , message: text, username: name , timestamp: time, messageUserColor: chosenColorForUser });
			field.value = "";
			content.scrollTop = content.scrollHeight;
		}
	};
	
	
	jQuery(document).ready(function() {
    console.log( "ready!" );
	$("#field").keyup(function(e) {
		if(e.keyCode === 13) {
			sendMessage();
		}else{
			console.log("aga " + e);
		}
	});
	});

	

(function($){
  $.extend({
    playSound: function(){
      return $(
        '<audio autoplay="autoplay" style="display:none;">'
          + '<source src="' + arguments[0] + '.mp3" />'
          + '<source src="' + arguments[0] + '.ogg" />'
          + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />'
        + '</audio>'
      ).appendTo('body');
    }
  });

})(jQuery);




};


window.onbeforeunload = function (e) {
	socket.emit('leaving',{id: senderUser, username: name });
}



