/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        alert('device ready')
        app.receivedEvent('deviceready');
        try {
            window.plugins.tts.startup(function (arg) {
            }, function (arg) {
                alert('startup FAILED! ' + arg.toString());
            });
        } catch (e) {
            alert(e);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
    }
};

function speakFeed(rssFeedUrl) {
    window.plugins.tts.speak("Reading your news!", function (arg) {
        var feed = rssFeedUrl;//'http://feeds.feedburner.com/techcrunch/social?format=xml';
        $('#feed').feeds({
            feeds: {
                feed1: feed
                // key: 'url', ...
            },
            preprocess: function (e) {
                try {
                    window.plugins.tts.speak(this.title + "." + this.content,
                        function (arg) {
                        }, function (arg) {
                            alert(arg);
                        });

                } catch (error) {
                    alert(error);
                }
            }
        });
    }, function (arg) {
        alert('speech FAILED! ' + arg.toString());
    });
}
