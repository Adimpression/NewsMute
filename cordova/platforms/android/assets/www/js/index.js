function InitializeHuman() {
    try {
        var humanId = window.localStorage.getItem("humanId");
        if(humanId == null || humanId == ""){
            var username = prompt("Please enter your username");
            window.localStorage.setItem("humanId", username);
        }else{
            alert(humanId);
        }
    } catch (e) {
        alert(e);
    }
}


/**
 *
 * // Feeds to retrieve
 *  feeds: {
 *     // identifier: url, ...
 * },
 *
 *  // Maximum number of entries to fetch per feed, -1 for maximum available
 *  max: -1,
 *
 *  // Use SSL connection. Option;
 *  //  - true: use https
 *  //  - false: use http
 *  //  - 'auto': use same as current domain
 *  ssl: 'auto',
 *
 *  // Retrieve and parse XML elements when true
 *  xml: false,
 *
 *  // Called when all entries are rendered
 *  onComplete: function( entries ) { },
 *
 *  // Called for each entry
 *  preprocess: function( feed ) { },
 *
 *  // Template injected to container while feeds are loaded
 *  loadingTemplate: '<p class="feeds-loader">Loading entries ...</p>',
 *
 *  // Template used to render each entry
 *  entryTemplate:  '<div class="feeds-entry feeds-source-<!=source!>">' +
 *  '<a class="feed-entry-title" target="_blank" href="<!=link!>" title="<!=title!>"><!=title!></a>' +
 *  '<div class="feed-entry-date"><!=publishedDate!></div>' +
 *  '<div class="feed-entry-content"><!=contentSnippet!></div>' +
 *  '</div>'
 *
 *  title
 *  author
 *  publishedDate
 *  content
 *  contentSnippet (< 120 characters, no html tags)
 *  link
 *  mediaGroup
 *  categories
 *  source (the feed identifier, added by the plugin)
 *  feedUrl (the url of the rss feed)
 *  feedTitle (the title of the feed)
 *  feedLink (the url of the HTML version of the feed)
 *  feedDescription (the feed description)
 *  feedAuthor (the feed author)
 *
 *
 *
 *
 *
 *
 *
 *
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
        app.receivedEvent('deviceready');
        try {
            $userFeed.focus();
            InitializeHuman();
            DB = openDatabase('NewsMute', '1.0', 'News Mute Feed Entries', 2 * 1024 * 1024);
            DB.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS Feed (url UNIQUE)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS FeedTitle (url UNIQUE, title)');
                updateFeedListFromDB();
                $feedsList.slideDown();
                $feedNowSpeaking.slideUp();
            });


            document.addEventListener("touchstart", function () {
                $$bar.each(function (i) {
                    unfluctuate($(this));
                });
            }, false);
            document.addEventListener("touchend", function () {
                if (speechEngineState == 3) {
                    $$bar.each(function (i) {
                        fluctuate($(this));
                    });
                }
            }, false);

            window.plugins.tts.startup(function (arg) {
            }, function (arg) {
            });
        } catch (e) {
            alert(e);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
    }
};

var DB;

function updateFeedListFromDB() {
    try {
        $feedsList.empty();
        DB.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Feed', [], function (tx, results) {
                try {
                    var len = results.rows.length, i;
                    var feedList = $feedsList;

                    for (i = 0; i < len; i++) {
                        (function(i){
                            var feedTitle;

                            tx.executeSql('SELECT * FROM FeedTitle WHERE url=?', [results.rows.item(i).url], function (tx, titles) {
                                feedTitle =  titles.rows.item(0).title;

                                feedList.append(feedList.add("<div class='use100'  style='background-color:#444444;color: #ffffff; border-radius: 2px;'><div class='use10 center' id='" + 'Deletefeed' + i + "'>X</div><div class='use90'><b id='" + 'feed' + i + "'>" + feedTitle + "</b><input id='" + 'URLfeed' + i + "' type='hidden' value='"+results.rows.item(i).url+"'/></div></div>"));
                                $('#feed' + i).click(function (event) {
                                    try {
                                        var feedItem = '#' + event.target.id;

                                        var URLfeed = '#URLfeed' + feedItem.substr(5, feedItem.length - 1);//7 = # and Delete...

                                        //alert(URLfeed);

                                        $userFeed.val($(URLfeed).val());
                                        $userFeed.text($(URLfeed).val());

                                        //alert($(URLfeed).val());

                                        //alert($('#' + event.target.id).text());
                                        $('#play').click();
                                    } catch (e) {
                                        alert(e);
                                    }
                                })

                                $('#Deletefeed' + i).click(function (event) {
                                    try {
                                        try {
                                            var feedItem = '#' + event.target.id;
                                            feedItem = feedItem.substr(11, feedItem.length - 1);//7 = # and Deletefeed...

                                            var confirmed = confirm('Remove:' + $('#feed' + feedItem).text());

                                            if(confirmed){
                                                DB.transaction(function (tx) {
                                                    tx.executeSql('DELETE FROM Feed WHERE url=?', [$('#URLfeed' + feedItem).val()], function (success) {
                                                        DB.transaction(function (tx) {
                                                            tx.executeSql('DELETE FROM FeedTitle WHERE url=?', [$('#URLfeed' + feedItem).val()], function (success) {
                                                                updateFeedListFromDB();
                                                            }, function (error) {
                                                                updateFeedListFromDB();//Since we successfully deleted from master table anyway
                                                                alert(error);
                                                            });
                                                        });
                                                    }, function (error) {
                                                        alert(error);
                                                    });
                                                });
                                            }

                                        } catch (e) {
                                            alert(e);
                                        }
                                    } catch (e) {
                                        alert(e);
                                    }
                                })
                            });
                        })(i);

                    }
                } catch (e) {
                    alert(e);
                }
            }, function (error) {
                alert(error)
            });
        });
    } catch (e) {
        alert(e);
    }
}

function unspeakFeed() {
    speakFeedEntriesRecursivelyCurrentContinue = false;
    window.plugins.tts.stop();
    speechEngineState = 2;
    $feedsList.show();
    $feedNowSpeaking.hide();

    $$bar.each(function (i) {
        unfluctuate($(this));
    });
}

var feedEntriesBeingReadIndex;//The index of the the feed item of the feed entries being read
var feedEntriesNoModifyCurrent;//This should never be modified unless it is a new feed, and always being the currently being read feed

/**
 * STOPPED = 0 INITIALIZING = 1 STARTED = 2 SPEAKING = 3
 * -1 reflects the state has never being updated.
 * @type {number}
 */
var speechEngineState = -1;

function processFeed(feed) {
    var feedEntries = [];//Array of feed entries
    var feedWebsiteTitle = undefined;

    $('#feed').feeds({
        feeds: {
            feed1: feed
        },
        preprocess: function (e) {
            try {
                $feedNowSpeaking.text('Still preparing your news. About to read them....');
                feedEntries.push(this.title + " - " + this.content);
                if(!feedWebsiteTitle){
                    feedWebsiteTitle = this.feedTitle;
                }
            } catch (error) {
                alert(error);
            }
        },
        onComplete: function () {
            try {
                $feedNowSpeaking.text('Done preparing your news. About to read ' + feedEntries.length + ' items....');
                if (feedEntries.length > 0) {//i.e. feed fetch successful
                    DB.transaction(function (tx) {
                        tx.executeSql('INSERT OR IGNORE INTO Feed (url) VALUES (?)', [feed], function (success) {
                            updateFeedListFromDB();
                        }, function (error) {
                            alert(error);
                        });
                    });
                    DB.transaction(function (tx) {
                        tx.executeSql('INSERT OR IGNORE INTO FeedTitle (url, title) VALUES (?,?)', [feed,feedWebsiteTitle], function (success) {
                            feedWebsiteTitle = undefined;
                        }, function (error) {
                            alert(error);
                        });
                    });
                }
                feedEntriesBeingReadIndex = 0;
                feedEntriesNoModifyCurrent = feedEntries;
                speakFeedEntriesRecursively(feedEntries, feedEntriesBeingReadIndex);
            } catch (e) {
                alert(e);
            }
        }
    });
}

function speakFeed(rssFeedUrl) {
    try {
        window.plugins.tts.speak("Reading your news!", function (arg) {
            discoverFeedUrlFor(rssFeedUrl.replace(/\s+/g, ''))//We replace all spaces since a user can type something like Facebook.com which ends up with spaces in the end
                .done(function (data) {
                    $feedNowSpeaking.text('Got data from your website. Preparing them...');
                    feedEntriesNoModifyCurrent = [];
                    //alert(JSON.stringify(data));
                    if (!!data.responseData) {
                        //alert(data.responseData.entries.length);
                        if (data.responseData.entries.length == 0) {
                            processFeed(rssFeedUrl);
                        } else {
                            var feedUrl = data.responseData.entries[0].url;
                            processFeed(feedUrl);
                        }
                    } else {
                        alert(queryResult);
                    }
                });
        }, function (arg) {
            alert('Sorry, we are speechless! ' + arg.toString());
        });
    } catch (e) {
        alert(e);
    }
}

function updatesSpeechEngineStateSuccess(result) {
    speechEngineState = result;
}

function updatesSpeechEngineStateSuccessError(reason) {
    alert(reason);
}

function updatesSpeechEngineState() {
    window.plugins.tts.getState(updatesSpeechEngineStateSuccess, updatesSpeechEngineStateSuccessError);
}

var updateSpeechEngineStateIntervalId;
function updatesSpeechEngineStateStart() {
    updateSpeechEngineStateIntervalId = setInterval("updatesSpeechEngineState()", 1000);
}

function updatesSpeechEngineStateStop() {
    try {
        window.clearInterval(updateSpeechEngineStateIntervalId);
    } catch (e) {
        alert(e);
    }
}

function speakFeedEntriesPrevious() {
    try { //We decrement the feed's feedEntriesBeingReadIndex by one. We avoid doing so if it is 0 being read
        if (feedEntriesNoModifyCurrent && feedEntriesNoModifyCurrent.length > 2 && feedEntriesBeingReadIndex != 0) {
            //First we stop everything
            unspeakFeed();
//            alert('Waiting forspeech stop');

            updatesSpeechEngineStateStart();
            while (speechEngineState == 3 && !speakFeedEntriesRecursivelyCurrentCompleted) {
                //We have to wait for the speech engine to stop. No other way.
            }
            updatesSpeechEngineStateStop();

//            alert('Speech stopped');
            if (feedEntriesBeingReadIndex > 0) {
                --feedEntriesBeingReadIndex;
            }
            speakFeedEntriesRecursively(feedEntriesNoModifyCurrent, feedEntriesBeingReadIndex);
        }
    } catch (e) {
        alert(e);
    }
}

function speakFeedEntriesNext() {
    try { //We increment the feed's feedEntriesBeingReadIndex by one, if it has that length;
        if (feedEntriesNoModifyCurrent && feedEntriesNoModifyCurrent.length - 1 > feedEntriesBeingReadIndex) {
            //First we stop everything
            unspeakFeed();
//            alert('Waiting for speech stop');

            updatesSpeechEngineStateStart();
            while (speechEngineState == 3 && !speakFeedEntriesRecursivelyCurrentCompleted) {
                //We have to wait for the speech engine to stop. No other way.
            }
            updatesSpeechEngineStateStop();

//            alert('Speech stopped');
            //Since the speakFeedEntriesRecursively is a recursive loop hopping onto the next item, we don't need to increment. Or we'll have to change our strategy in the loop
            speakFeedEntriesRecursively(feedEntriesNoModifyCurrent, ++feedEntriesBeingReadIndex);
        }
    } catch (e) {
        alert(e);
    }
}

var speakFeedEntriesRecursivelyCurrentCompleted = false;
var speakFeedEntriesRecursivelyCurrentContinue = true;

var $feedNowSpeaking = $('#feedNowSpeaking');
var $feedsList = $('#feedsList');
var $$bar = $('.bar');
var $userFeed = $('#userFeed');

function speakFeedEntriesRecursively(feedEntries, feedEntriesBeingReadIndex) {
    try {
        if (feedEntries.length - 1 >= feedEntriesBeingReadIndex) {
            $feedNowSpeaking.empty();
            $feedNowSpeaking.html(feedEntries[feedEntriesBeingReadIndex]);

            // readability.init($feedNowSpeaking.get(0));

            $feedNowSpeaking.show();
            $feedsList.hide();

            speechEngineState = 3;

            $$bar.each(function (i) {
                fluctuate($(this));
            });

            speakFeedEntriesRecursivelyCurrentCompleted = false;
            //http://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
            var readableText = feedEntries[feedEntriesBeingReadIndex].replace(/(<([^>]+)>)/ig, "");
            window.plugins.tts.speak(readableText,
                function (arg) {
//                    alert('Completed reading this entry');
                    speechEngineState = 2;
                    speakFeedEntriesRecursivelyCurrentCompleted = true;
                    if (feedEntries.length - 1 >= feedEntriesBeingReadIndex) {
                        feedEntriesBeingReadIndex++;
                    }
                    if (speakFeedEntriesRecursivelyCurrentContinue) {
                        speakFeedEntriesRecursively(feedEntries, feedEntriesBeingReadIndex);
                    } else {
                        speakFeedEntriesRecursivelyCurrentContinue = true;//We end by resetting this. No better place to do this
                    }
                }, function (arg) {
                    alert(arg);
                });
        }
    } catch (e) {
        alert(e);
    }
}

var discoverFeedUrlFor = function (pageURL) {
    try {
        var baseApiUrl = "http://ajax.googleapis.com/ajax/services/feed/find?v=1.0";
        var jQueryJsonpToken = "&callback=?"; // tells jQuery to treat it as JSONP request
        var pageUrlParameter = "&q=site:" + pageURL.replace(/^https?:\/\//, '').replace(/^http?:\/\//, '');
        var requestUrl = baseApiUrl + jQueryJsonpToken + pageUrlParameter;
        var JSON = $.getJSON(requestUrl);
        return  JSON;
    } catch (e) {
        alert(e);
    }
};


function fluctuate(bar) {
    var hgt = Math.random() * 100;
    hgt += 1;
    var t = hgt * 0.5;

    bar.animate({
        height: hgt
    }, t, function () {
        fluctuate($(this));
    });
}

function unfluctuate(bar) {
    bar.stop();
    bar.css("height", "15px");
}
