var humanId;
var $feedNowSpeaking = $('#feedNowSpeaking');
var $feedsList = $('#feedsList');
var $itemTemplate = $('.itemTemplate');

var flag_super_friend = "flag_super_friend";
var flag_app_launched = "flag_app_launched";


function InitializeHuman() {
    try {
        humanId = window.localStorage.getItem("humanId");
        humanId = null;
        if (humanId == null || humanId == "") {
            window.validemail.send('Anything', function(arg){
                    try {
                        alert(JSON.stringify(arg));
                        var emails = arg.emails;
                        while(humanId == null){
                            for (var i = 0; i < emails.length ; i++) {
                                var answer = confirm('Login as ' + emails[i] + '?');
                                if (answer) {
                                    humanId = emails[i];
                                    break;
                                }
                            }
                        }

                        alert('Your email for News Mute is ' + humanId);

                        var password;

                        while((password = prompt("Enter password")) == "" || password == null){
                        }

                        //Now we have the email, we try to login, if we fail
                        //If password failure

                        signIn(getHash(password), function(arg){
                            alert(arg);
                            var status = arg.data[0].status;
                            alert("Status" + status);

                            if(status == "OK"){
                                alert("Login successful");
                            } else {
                                alert("Login failed");
                            }

                        }, function(arg){
                            alert(arg);
                        });

                    } catch (e) {
                        alert(e);
                    }
                },
                function(arg){alert(arg);});

            window.localStorage.setItem("humanId", getHash(humanId));
        } else {
            //alert(humanId);
        }
    } catch (e) {
        //alert(e);
    }
}

function signUp(passwordHash, successCallback, failureCallback){
    $.ajax({
        type: "GET",
        url: "http://192.237.246.113:50200/?user=" + humanId + "&token=" + passwordHash+ "&nmact=" + "CREATE",
        crossDomain: true,
        beforeSend: function () {
        },
        complete: function () {
        },
        data: {},
        dataType: 'text', //json
        success: function (response) {
            successCallback(response);
        },
        error: function (e) {
            failureCallback(e);
        }
    });
}



function signIn(passwordHash, successCallback, failureCallback){
    $.ajax({
        type: "GET",
        url: "http://192.237.246.113:50200/?user=" + humanId + "&token=" + passwordHash + "&nmact=" + "CREATE",
        crossDomain: true,
        beforeSend: function () {
        },
        complete: function () {
        },
        data: {},
        dataType: 'text', //json
        success: function (response) {
            successCallback(response);
        },
        error: function (e) {
            failureCallback(e);
        }
    });
}


function justVisiting() {
    var lastVisited = window.localStorage.getItem("lastVisited");
    if (lastVisited != null) {
        //alert('lv no null');
        screamLink(lastVisited,function(e){}, function(e){});
        markRead(lastVisited);
        share(lastVisited);
        window.localStorage.removeItem("lastVisited");
    } else {
        //alert('lv null');
        //alert('The share url is null');
    }

}

function NewsMute() {
    try {
        InitializeHuman();
        WakeUp();
        justVisiting();
        $feedsList.slideDown();
        $feedNowSpeaking.slideUp();

        window.localStorage.setItem(flag_app_launched, "true");

        var flag_super_friend_value = window.localStorage.getItem(flag_super_friend);
        if (flag_super_friend_value == null) {
            superFriend();
            window.localStorage.setItem(flag_super_friend, "true");
        } else {
            //Check for time and update after several days?
            //Remember that we can run a hash check
        }
    } catch (e) {
        alert(e);
    }
}

function getHash(value){
    return CryptoJS.SHA512(value);
}

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        try {
            if(!isConnected()){
                alert("Sorry, for now News Mute needs internet to start. We will fix this soon, promise!");
                return;
            }
            //alert("Initializing...");
            NewsMute();
            document.addEventListener("pause", function () {
                window.localStorage.removeItem(flag_app_launched);
                window.localStorage.removeItem("lastVisited");
                app.exitApp();//@FIXME: If the use is reading and article and receives a call?
            }, false);


        } catch (e) {
            alert('init error');
            alert(e);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
    }
};


function WakeUp() {
    $.ajax({
        type: "GET",
        url: "http://192.237.246.113:40200/?nmact=READ&user=" + humanId,
        crossDomain: true,
        beforeSend: function () {
            $(".Loader").show();
            $(".FeedSetup").hide();
            $(".FeedInterface").hide();
        },
        complete: function () {
            $(".Loader").hide();
            $(".FeedSetup").hide();
            $(".FeedInterface").show();
        },
        data: {},
        dataType: 'text', //json
        success: function (response) {
            try {
                var json = JSON.parse(response);

                var data = json.returnValue.data;

                    data.sort(function (a, b) {//http://stackoverflow.com/questions/4222690/sorting-a-json-object-in-javascript
                            var a1st = -1; // negative value means left item should appear first
                            var b1st = 1; // positive value means right item should appear first
                            var equal = 0; // zero means objects are equal

                            try { // compare your object's property values and determine their order
                                if (b.shocks < a.shocks) {
                                    return b1st;
                                }
                                else if (a.shocks < b.shocks) {
                                    return a1st;
                                }
                                else {
                                    return equal;
                                }
                            } catch (e) {
                                alert("Error comparing " + JSON.stringify(a) + " \nWith\n " + JSON.stringify(b));
                            }
                        }
                    );

                data.reverse();



                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.link != "null" && item.link != "") {//@TODO remove me, temp fix until server fixed
                        var clone = $itemTemplate.clone();
                        clone.attr("id", encodeURIComponent(item.link));
                        clone.find('.itemTitle').text(item.title);
                        //clone.find('.itemTitle').attr('href', item.link);
                        clone.find('.itemTitle').attr("title", item.link);
                        clone.find('.itemDescription').html(item.description);
                        clone.find('.itemBookmark').attr("title", item.link);
                        clone.find('.itemHide').attr("title", item.link);
                        clone.find('.itemAdvanced').attr("title", item.source);
                        $feedsList.append(clone);
                    }
                }
            } catch (e) {
                alert('Data render error' + e);
            }


        },
        error: function (e) {
            alert(JSON.stringify(e));
        }
    });
}

function screamLink(url, successCallback, failureCallback){
    if (isValidURL(url)) {
        //alert("Sharing:" + url)
        $.ajax({
            type: "GET",
            url: "http://192.237.246.113:30200/?user=" + humanId + "&url=" + encodeURIComponent(url),
            crossDomain: true,
            beforeSend: function () {
            },
            complete: function () {
            },
            data: {},
            dataType: 'text', //json
            success: function (response) {
                successCallback(response);
            },
            error: function (e) {
                failureCallback(JSON.stringify(e));
            }
        });
    } else {
        alert('Sorry :-( This link is not recognized by News Mute')
    }
}

function scream() {
    var url = prompt("Enter link");
    if(url == null || url == ""){
        return;
    }

    screamLink(url, function(e){}, function(e){});
}

function stalk() {

    var url = prompt("Enter feed");

    if(url == null || url == ""){
        return;
    }


    if (isValidURL(url)) {
        $.ajax({
            type: "GET",
            url: "http://192.237.246.113:16285/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=CREATE",
            crossDomain: true,
            beforeSend: function () {
            },
            complete: function () {
            },
            data: {},
            dataType: 'text', //json
            success: function (response) {
                try {
                    alert("Subscribed");//@TODO: Check response
                } catch (e) {
                    alert(e);
                }
            },
            error: function (e) {
                alert(JSON.stringify(e));
            }
        });
    } else {
        alert('Sorry :-( This feed is not recognized by News Mute')
    }

}

function share(link) {
    try {
        var message = {
            url: link
        };
        window.socialmessage.send(message);
    } catch (e) {
        alert(e);
    }

}
function unshare(url) {
    if (isValidURL(url)) {
        if(confirm("Remove feed permanently?")){
            $.ajax({
                type: "GET",
                url: "http://192.237.246.113:16285/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=DELETE",
                crossDomain: true,
                beforeSend: function () {
                },
                complete: function () {
                },
                data: {},
                dataType: 'text', //json
                success: function (response) {
                    alert('Removed feed!');
                },
                error: function (e) {
                    alert(JSON.stringify(e));
                }
            });
        }
    } else {//Then this is a spammy user, get rid of it?
        //alert('Noted as spam');
    }

}

function markRead(url) {
            $.ajax({
                type: "GET",
                url: "http://192.237.246.113:40200/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=DELETE",
                crossDomain: true,
                beforeSend: function () {
                },
                complete: function () {
                },
                data: {},
                dataType: 'text', //json
                success: function (response) {
                },
                error: function (e) {
                    alert(JSON.stringify(e));
                }
            });
}

function superFriend() {
    alert('Finding contacts');
    function findAllContactsSuccess(contacts) {
        alert('Found contacts: ' + contacts.length);
        try {
            var contactSet = "";
            for (var i = 0; i < contacts.length; i++) {
                for (var j = 0; contacts[i].emails != null && j < contacts[i].emails.length; j++) {
                    if (contacts != "") {
                        contactSet = contactSet + "%7C" + getHash(contacts[i].emails[j].value); //%7C is the pipe | sign
                    } else {
                        contactSet = getHash(contacts[i].emails[j].value);
                    }
                }

                if (i % 20 == 0) {//Why? Because we might hit the maximum length of the URL. Right now my contacts count on the phone is some 1900+
                    $.ajax({
                        type: "GET",
                        url: "http://192.237.246.113:20200/?user=" + humanId + "&users=" + contactSet,
                        crossDomain: true,
                        beforeSend: function () {
                        },
                        complete: function () {
                        },
                        data: {},
                        dataType: 'text', //json
                        success: function (response) {
                        },
                        error: function (e) {
                            alert(JSON.stringify(e));
                        }
                    });
                    contactSet = "";

                }
            }
        } catch (e) {
            alert(e);
        }

    }

    function findAllContactsFailure(e) {
        alert(e)
    }

    try {
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;

        navigator.contacts.find(['emails'], findAllContactsSuccess, findAllContactsFailure, options);
    } catch (e) {
        alert(e);
    }

}


function hide(url){
    try {
        markRead(url);
        var id = encodeURIComponent(url);
        $("#" + id).fadeOut();
    } catch (e) {
        //alert(e);//@TODO: There's an error here, because of the weird ids we use. Fix this (Hashing?)
    }

}

window.isValidURL = (function () {// wrapped in self calling function to prevent global pollution

    //URL pattern based on rfc1738 and rfc3986
    var rg_pctEncoded = "%[0-9a-fA-F]{2}";
    var rg_protocol = "(http|https):\\/\\/";

    var rg_userinfo = "([a-zA-Z0-9$\\-_.+!*'(),;:&=]|" + rg_pctEncoded + ")+" + "@";

    var rg_decOctet = "(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])"; // 0-255
    var rg_ipv4address = "(" + rg_decOctet + "(\\." + rg_decOctet + "){3}" + ")";
    var rg_hostname = "([a-zA-Z0-9\\-\\u00C0-\\u017F]+\\.)+([a-zA-Z]{2,})";
    var rg_port = "[0-9]+";

    var rg_hostport = "(" + rg_ipv4address + "|localhost|" + rg_hostname + ")(:" + rg_port + ")?";

    // chars sets
    // safe           = "$" | "-" | "_" | "." | "+"
    // extra          = "!" | "*" | "'" | "(" | ")" | ","
    // hsegment       = *[ alpha | digit | safe | extra | ";" | ":" | "@" | "&" | "=" | escape ]
    var rg_pchar = "a-zA-Z0-9$\\-_.+!*'(),;:@&=";
    var rg_segment = "([" + rg_pchar + "]|" + rg_pctEncoded + ")*";

    var rg_path = rg_segment + "(\\/" + rg_segment + ")*";
    var rg_query = "\\?" + "([" + rg_pchar + "/?]|" + rg_pctEncoded + ")*";
    var rg_fragment = "\\#" + "([" + rg_pchar + "/?]|" + rg_pctEncoded + ")*";

    var rgHttpUrl = new RegExp(
        "^"
            + rg_protocol
            + "(" + rg_userinfo + ")?"
            + rg_hostport
            + "(\\/"
            + "(" + rg_path + ")?"
            + "(" + rg_query + ")?"
            + "(" + rg_fragment + ")?"
            + ")?"
            + "$"
    );

    // export public function
    return function (url) {
        if (rgHttpUrl.test(url)) {
            return true;
        } else {
            return false;
        }
    };
})();

function processError(error, callback){
}



//http://docs.phonegap.com/en/1.8.1/cordova_connection_connection.md.html#connection.type
function isConnected() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    //alert('Connection type: ' + states[networkState]);

    return networkState != Connection.NONE;
}



