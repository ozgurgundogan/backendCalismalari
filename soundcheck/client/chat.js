(function () {
    
    var getNode = function (s) {
            return document.querySelector(s);
        },

        // get required nodes
        session_username = sessionStorage.getItem('ss_user_email'),
        chat_title = getNode('#chat-title'),
        messages = getNode('.chat-messages'),
        textarea = getNode('.chat-app textarea'),
        status = getNode('.chat-status span'),
        statusDefault = status.textContent,

        setStatus = function (s) {
            status.textContent = s;
            if (s !== statusDefault) {
                var delay = setTimeout(function () {
                    setStatus(statusDefault);
                    clearInterval(delay);
                }, 3000);
            }
        };

    // attempt connection to the server
    try {
        var server = io.connect('http://127.0.0.1:8080');
    } catch (e) {
        alert('Sorry, we couldn\'t connect. Please try again later \n\n' + e);
    }

    // if the server connection is successful
    if (server !== undefined) {

        server.emit('chat-connection', sessionStorage.getItem('ss_user_email'));
        
        server.on('update-title', function(name){
            name += ', ';
            chat_title.innerHTML = name.concat(chat_title.innerHTML);
        });

        // listen for output function from server - displayes messages from database
        server.on('output', function (data) {
            if (data.length) {
                // loop through the array of messages
                for (var i = 0; i < data.length; i++) {

                    // create a wrapper for the message
                    var wrapper = document.createElement('div');
                    wrapper.setAttribute('class', 'chat-wrapper');

                    // create a picture wrapper
                    var picWrapper = document.createElement('div');
                    picWrapper.setAttribute('class', 'pic-wrapper');

                    // add picwrapper element
                    wrapper.appendChild(picWrapper);

                    // create the image
                    var image = document.createElement('img');
                    
                    image.setAttribute('src', data[i].photo);
                    image.setAttribute('class', 'profile-pic');

                    
                    image.setAttribute('width', '100%');
                    image.setAttribute('height', '100%');
                    picWrapper.appendChild(image);
                    
                    
                    // add an event listener to fix broken images
                    image.addEventListener('error', function(){
                        this.onerror = "";
                        this.src = "http://i1072.photobucket.com/albums/w368/"
                                + "jamesrallen2011/profile.jpg_zpsgjdxq5gd.png";
                        return true;
                    });
                    

                    // create the actual message
                    var message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');


                    var msg = '<span>';

 
                    if (data[i].email === session_username) {
                        msg += 'You:</span>';
                    } else {
                        msg += data[i].name + ':</span>';
                    }

                    message.innerHTML = msg;
                    
                    message.innerHTML += data[i].message;


                    // append newly created element to chat wrapper
                    wrapper.appendChild(message);
                    wrapper.scrollTop = messages.scrollHeight;

                    // append the whole thing to chat messages
                    messages.appendChild(wrapper);

                    messages.scrollTop = messages.scrollHeight;

                }
            }
        });

        // listen for status
        server.on('status', function (data) {
            setStatus((typeof data === 'object') ? data.message : data);

            if (data.clear === true) {
                textarea.value = "";
            }
        });

        // listen for keydown
        textarea.addEventListener('keydown', function (event) {


            if (event.which === 13 && event.shiftKey === false) {
                server.emit('input', {
                    email: session_username,
                    message: this.value
                });

                event.preventDefault;
            }
        });

    }

})();