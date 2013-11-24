var humanId;
var $feedNowSpeaking = $('#feedNowSpeaking');
var $feedsList = $('#feedsList');
var $itemTemplate = $('.itemTemplate');

function InitializeHuman() {
    try {
        humanId = window.localStorage.getItem("humanId");
        if (humanId == null || humanId == "") {
            humanId = prompt("Please enter your username");
            window.localStorage.setItem("humanId", humanId);
        } else {
            //alert(humanId);
        }
    } catch (e) {
        //alert(e);
    }
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
            InitializeHuman();
            WakeUp();
            $feedsList.slideDown();
            $feedNowSpeaking.slideUp();
        } catch (e) {
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
        url: "http://192.237.246.113:40000/?user=" + humanId,
        crossDomain: true,
        beforeSend: function () {
        },
        complete: function () {
        },
        data: {},
        dataType: 'text', //json
        success: function (response) {
            try {
                var json = JSON.parse(response);

                var data = json.returnValue.data;

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.link != "null" && item.link != "") {//@TODO remove me, temp fix until server fixed
                        var clone = $itemTemplate.clone();
                        clone.find('.itemTitle').text(item.title);
                        clone.find('.itemTitle').attr('href',item.link);
                        clone.find('.itemDescription').text(item.description);
                        $feedsList.append(clone);
                    }
                }
            } catch (e) {
                alert(e);
            }


        },
        error: function (e) {
            alert(e.toString());
        }
    });
}

function scream() {

    var url = prompt("Enter link");

    if (isValidURL(url)) {
        $.ajax({
            type: "GET",
            url: "http://192.237.246.113:30000/?user=" + humanId + "&url=" + encodeURIComponent(url),
            crossDomain: true,
            beforeSend: function () {
            },
            complete: function () {
            },
            data: {},
            dataType: 'text', //json
            success: function (response) {
                try {
                    alert(response);
                } catch (e) {
                    alert(e);
                }


            },
            error: function (e) {
                alert(e.toString());
            }
        });
    } else {
        alert('Sorry :-( This link is not recognized by News Mute')
    }

}

function stalk() {

    var url = prompt("Enter feed");

    if (isValidURL(url)) {
        $.ajax({
            type: "GET",
            url: "http://192.237.246.113:16185/?user=" + humanId + "&url=" + encodeURIComponent(url) + "&action=CREATE",
            crossDomain: true,
            beforeSend: function () {
            },
            complete: function () {
            },
            data: {},
            dataType: 'text', //json
            success: function (response) {
                try {
                    alert(response);
                } catch (e) {
                    alert(e);
                }


            },
            error: function (e) {
                alert(e.toString());
            }
        });
    } else {
        alert('Sorry :-( This feed is not recognized by News Mute')
    }

}

function superFriend(){
    function findAllContactsSuccess(contacts) {
        alert('Found contacts: ' + contacts.length);
        try {
            var contactSet = "";
            for (var i = 0; i < contacts.length; i++) {
                for (var j = 0; contacts[i].emails != null && j < contacts[i].emails.length; j++) {
                    if (contacts != "") {
                        contactSet = contactSet + "%7C" + contacts[i].emails[j].value; //%7C is the pipe | sign
                    } else {
                        contactSet = contacts[i].emails[j].value;
                    }
                }

                if (i % 20 == 0) {//Why? Because we might hit the maximum length of the URL. Right now my contacts count on the phone is some 1900+
                        $.ajax({
                            type: "GET",
                            url: "http://192.237.246.113:20000/?user=" + humanId + "&users=" + contactSet,
                            crossDomain: true,
                            beforeSend: function () {
                            },
                            complete: function () {
                            },
                            data: {},
                            dataType: 'text', //json
                            success: function (response) {
                                try {
                                    alert(response);
                                } catch (e) {
                                    alert(e);
                                }


                            },
                            error: function (e) {
                                alert(e.toString());
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
        var options      = new ContactFindOptions();
        options.filter   = "";
        options.multiple = true;

        navigator.contacts.find(['emails'], findAllContactsSuccess, findAllContactsFailure, options);
    } catch (e) {
        alert(e);
    }

    return;
}

window.isValidURL = (function() {// wrapped in self calling function to prevent global pollution

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


