window.onload = function() {

    var items = {};

    items["aa"] = 5;
    items["ab"] = {adı:4, soyadı:5};

    console.log(Object.keys(items).length);
     console.log(items);
     console.log(items);

     var sd = Object.keys(items);
     console.log(sd[Object.keys(items).length-1]);
     console.log(!("key" in items));

}
