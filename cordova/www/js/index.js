var humanId;
var $feedNowSpeaking = $('#feedNowSpeaking');
var $feedsList = $('#feedsList');

function InitializeHuman() {
    try {
        humanId = window.localStorage.getItem("humanId");
        if (humanId == null || humanId == "") {
            var username = prompt("Please enter your username");
            window.localStorage.setItem("humanId", username);
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
        url: "http://192.237.246.113/",
        crossDomain: true,
        beforeSend: function () {
            alert('Retrieving data')
        },
        complete: function () {
            alert('Retrieved data')
        },
        data: {},
        dataType: 'text', //json
        success: function (response) {
            var json = JSON.parse(response)
            alert(JSON.stringify(json));
        },
        error: function (e) {
            alert(e.toString());
        }
    });
}
