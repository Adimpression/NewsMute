var humanId;
var $feedNowSpeaking = $('#feedNowSpeaking');
var $feedsList = $('#feedsList');

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
                        $feedsList.append("" +
                            "<li>" +
                            "<div>" +
                            "<h3>" +
                            "<a href='" +
                            item.link +
                            "'>" +
                            item.title +
                            "</a>" +
                            "</h3>" +
                            "<p>" +
                            "<blockquote>" +
                            item.description +
                            "</blockquote>" +
                            "</p>" +
                            "</div>" +
                            "</li>"
                        );
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
//    function findAllContactsSuccess(contacts) {
//        alert('Found contacts: ' + contacts.length);
//
//    }
//
//    function findAllContactsFailure(e) {
//        alert(e)
//    }
//
//    try {
//        var options      = new ContactFindOptions();
//        options.filter   = "";
//        options.multiple = true;
//
//        navigator.contacts.find(['emails'], findAllContactsSuccess, findAllContactsFailure, options);
//    } catch (e) {
//        alert(e);
//    }
//
//    return;

    var url = prompt("Enter link");

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

}
