const $feedNowSpeaking = $('#feedNowSpeaking');
const $feedsList = $('#feedsList');
const $itemTemplate = $('.itemTemplate');
const $Loader = $(".Loader");
const $FeedSetup = $(".FeedSetup");
const $FeedInterface = $(".FeedInterface");



const flag_super_friend = "flag_super_friend";
const flag_app_launched = "flag_app_launched";

const endpointYawn = "http://23.253.36.42:40200";
const endpointScream = "http://23.253.36.42:30200";
const endpointStalk = "http://23.253.36.42:16285";
const endpointSuperFriend = "http://23.253.36.42:20200";
const endpointGuardian = "http://23.253.36.42:50200";

var humanId;


function InitializeHuman() {
    try {
        humanId = window.localStorage.getItem("humanId");
        if (humanId == null || humanId == "") {
            window.validemail.send('Anything', function(arg){
                    try {
                        //alert(JSON.stringify(arg));
                        var emails = arg.emails;
                        if(emails.length == 1){
                            humanId = getHash(emails[0]);
                        } else {
                            while(humanId == null){
                                for (var i = 0; i < emails.length ; i++) {
                                    var answer = confirm('Login as ' + emails[i] + '?');
                                    if (answer) {
                                        humanId = getHash(emails[i]);
                                        break;
                                    }
                                }
                            }
                        }

                        var password;

                        while((password = prompt("Enter password (6 or more characters)")) == "" || password == null || password.length < 6){
                        }

                        //Now we have the email, we try to login, if we fail
                        //If password failure

                        signIn(getHash(password), function(response){
                            try {
                                var json = JSON.parse(response);
                                //alert(JSON.stringify(json));
                                var dataArray = json.returnValue.data;
                                var data = dataArray[0];
                                var status = data.status;
                                if (json.returnStatus == "OK") {
                                    if (status == "OK") {
                                        window.localStorage.setItem("humanId", humanId);
                                        postSession();
                                    } else if (status == "ERROR") {
                                        alert("Login failed");//
                                        window.location.href = window.location.href;
                                    } else if (status == "NO_ACCOUNT") {
                                        alert("No account, signing you up");
                                        signUp(getHash(password), function (response) {

                                            try {
                                                var json = JSON.parse(response);
                                                //alert(JSON.stringify(json));
                                                var dataArray = json.returnValue.data;
                                                var data = dataArray[0];
                                                var status = data.status;
                                                if (json.returnStatus == "OK") {
                                                    if (status == "OK") {
                                                        window.localStorage.setItem("humanId", humanId);

                                                        stalk('http://feeds.feedburner.com/WikipediaTodaysFeaturedArticle');
                                                        stalk('http://feeds.foxnews.com/foxnews/most-popular');
                                                        stalk('https://news.ycombinator.com/rss');

                                                        alert("Tap 'pink nm' to add RSS feed or share link.\n " +
                                                            "We added some for you.\n" +
                                                            "Click the asterisks to remove feed.");
                                                        postSession();
                                                    } else if (status == "ERROR") {
                                                        alert("Signup failed");//
                                                        window.location.href = window.location.href;
                                                    } else {
                                                        alert('News Mute had an error:' + status);
                                                    }
                                                } else {
                                                    alert("returnStatus:" + data.returnStatus);
                                                }
                                            } catch (e) {
                                                alert(e);
                                            }


                                        }, function (argS) {
                                            alert(JSON.stringify(argS));
                                        })

                                    } else {
                                        alert('News Mute had an error:' + status);
                                    }
                                } else {
                                    alert("returnStatus:" + data.returnStatus);
                                }
                            } catch (e) {
                                alert(e);
                            }

                        }, function(arg){
                            alert(arg);
                            alert(JSON.stringify(arg));
                        });

                    } catch (e) {
                        alert(e);
                    }
                },
                function(arg){alert(arg);});
        } else {
            postSession();
        }
    } catch (e) {
        //alert(e);
    }
}

function signUp(passwordHash, successCallback, failureCallback){
    $.ajax({
        type: "GET",
        url: endpointGuardian +
            "/?user=" + humanId + "&token=" + passwordHash+ "&nmact=" + "CREATE",
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
        url: endpointGuardian +
            "/?user=" + humanId + "&token=" + passwordHash + "&nmact=" + "READ",
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
        _internal_screamLink(lastVisited,function(e){}, function(e){});
        markRead(lastVisited);
        share(lastVisited);
        window.localStorage.removeItem("lastVisited");
    } else {
        //alert('lv null');
        //alert('The share url is null');
    }

}

function postSession(){

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
}

function NewsMute() {
    try {
        InitializeHuman();
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
        url: endpointYawn +
            "/?nmact=READ&user=" + humanId,
        crossDomain: true,
        beforeSend: function () {
            section($Loader);
        },
        complete: function () {
            section($FeedInterface);
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
                    (function(i){
                        var item = data[i];
                        if (item.link != "null" && item.link != "") {//@TODO remove me, temp fix until server fixed
                            var clone = $itemTemplate.clone();
                            var id = getHash(item.link);
                            clone.attr("id", id);
                            clone.find('.itemTitle').text(item.title);
                            //clone.find('.itemTitle').attr('href', item.link);
                            clone.find('.itemTitle').attr("title", item.link);
                            clone.find('.itemTitle').attr("style", "font-size: 40px; text-decoration: underline;color: #271aad;");
                            clone.find('.itemTitle').click(
                                function(){
                                    $('.itemTemplate:not(#'+ id + ')').animate({opacity:0.2});
                                    window.localStorage.setItem('lastVisited', this.title);
                                    setTimeout("openLink(window.localStorage.getItem('lastVisited'))", 1000);
                                }
                            );
                            //clone.find('.itemDescription').html(item.description.replace(/<(?:.|\n)*?>/gm, ''));
                            clone.find('.itemDescription').html(item.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''));
                            clone.find('.itemBookmark').attr("title", item.link);
                            clone.find('.itemHide').attr("title", item.link);
                            clone.find('.itemAdvanced').attr("title", item.source);
                            $feedsList.append(clone);
                        }
                    })(i);
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

function openLink(link){
    $FeedInterface.hide(0, function(){
        //navigator.app.loadUrl(link, {wait:0, loadingDialog:"Loading external web page", loadUrlTimeoutValue: 1000, openExternal:false });
        window.location.href = link;
    });
}

function screamLink(url, successCallback, failureCallback){
    if (isValidURL(url)) {
        //alert("Sharing:" + url)
        $.ajax({
            type: "GET",
            url: endpointScream +
                "/?user=" + humanId + "&url=" + encodeURIComponent(url),
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

function _internal_screamLink(url, successCallback, failureCallback){
        $.ajax({
            type: "GET",
            url: endpointScream +
                "/?user=" + humanId + "&url=" + encodeURIComponent(url),
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
}

function scream() {
    var url = prompt("Enter link");
    if(url == null || url == ""){
        return;
    }

    screamLink(url, function(e){}, function(e){});
}

function stalk(url) {

    if(url == null){
        url = prompt("Enter feed URL");
        if(url == null || url == ""){
            return;
        }
    }



    if (isValidURL(url)) {
        $.ajax({
            type: "GET",
            url: endpointStalk +
                "/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=CREATE",
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
                    //window.location.href = window.location.href;
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
function _internal_stalk(url) {
    $.ajax({
            type: "GET",
            url: endpointStalk +
                "/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=CREATE",
            crossDomain: true,
            beforeSend: function () {
            },
            complete: function () {
            },
            data: {},
            dataType: 'text', //json
            success: function (response) {
                try {
                    //alert("Subscribed");//@TODO: Check response
                    //window.location.href = window.location.href;
                } catch (e) {
                    alert(e);
                }
            },
            error: function (e) {
                alert(JSON.stringify(e));
            }
        });
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
                url: endpointStalk +
                    "/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=DELETE",
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
                url: endpointYawn +
                    "/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&nmact=DELETE",
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
    //alert('Finding contacts');
    function findAllContactsSuccess(contacts) {
        //alert('Found contacts: ' + contacts.length);
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
                        url: endpointSuperFriend +
                            "/?user=" + humanId + "&users=" + contactSet,
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
                            //alert(JSON.stringify(e));
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
        var id = getHash(url);
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



function initialSetup(){
    _internal_screamLink('http://elle.tumblr.com/rss');
}

function section(sectionToShow) {
    if (sectionToShow != $Loader){
        $Loader.hide();
    }
    if (sectionToShow != $FeedSetup){
        $FeedSetup.hide();
    }
    if (sectionToShow != $FeedInterface){
        $FeedInterface.hide();
    }
    sectionToShow.show();
}

function sectionFadeOut() {
        $Loader.fadeOut();
        $FeedSetup.fadeOut();
        $FeedInterface.fadeOut();
}

function sectionHide() {
        $Loader.hide();
        $FeedSetup.hide();
        $FeedInterface.hide();
}

