// event listener for the checkbox toggle
(function(){
    var checkbox = document.getElementById('photo_option');
    var is_checked;
    var photo_input = document.getElementById('photo_input');
    
    function toggle() {
        if (!is_checked) {
            photo_input.style.display = "block";
            is_checked = true;
        } else {
            photo_input.style.display = "none";
            is_checked = false;
        }
        return is_checked;
    }
    checkbox.addEventListener('click', toggle);
})();

(function(){
    
    // make a quick jquery-type selector
    var getNode = function(s) {
        return document.querySelector(s);   
    };
    
    // get all the elements we'll need in this function elements we'll work with
    
    // get the form elements
            
    var user_email_input = getNode('#user_email'),
        user_name_input = getNode('#user_name'),
        photo_option = getNode('#photo_option'),
        photo_input = getNode('#photo_input'),
        fpass_input = getNode('#password_first'),
        cpass_input = getNode('#password_confirm'),
        submit_button = getNode('#submit_button');
    
    // attempt to establish a connection to the server
    try {
        var server = io.connect('http://127.0.0.1:8080');
    }
    catch(e) {
        alert('Sorry, we couldn\'t connect. Please try again later \n\n' + e);
    }
    
    // if successful
    if(server !== undefined) {

        console.log("Connection established...");
        
        // add the event listener for the login submit button
        submit_button.addEventListener('click', function(event){
            
            // create variables to send to the server and assign them values
            var user_email = user_email_input.value,
                user_name = user_name_input.value,
                photo_option = photo_input.value,
                fpass = fpass_input.value,
                cpass = cpass_input.value;
            
            // test the photo input
            if (photo_option === ''){
                photo_option = "http://i1072.photobucket.com/albums/w368/jamesrallen2011/profile.jpg_zpsgjdxq5gd.png"; 
            }
            
            // send the values to the server
            server.emit('join', {
                user_email: user_email,
                user_name: user_name,
                photo_option: photo_option,
                fpass: fpass,
                cpass: cpass
            });
            event.preventDefault;
        });
        
        // alert error messages returned from the server
        server.on('alert', function(msg){
            alert(msg);
        });
        
        // clear the login form
        server.on('clear-login', function(){
                user_email_input.value = '';
                user_name.value = '';
                photo_option.checked = false;
                photo_input.value = '';
                photo_input.style.display = 'none';
                fpass_input.value = '';
                cpass_input.value = '';
        });
    }
})();