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
            $('#userFeed').focus();
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

function unspeakFeed() {
    window.plugins.tts.stop();
}

var feedEntriesBeingReadIndex;//The index of the the feed item of the feed entries being read
var feedEntriesNoModifyCurrent;//This should never be modified unless it is a new feed, and always being the currently being read feed

function speakFeed(rssFeedUrl) {

    try {
        window.plugins.tts.speak("Reading your news!", function (arg) {
            discoverFeedUrlFor(rssFeedUrl.replace(/\s+/g, ''))//We replace all spaces since a user can type something like Facebook.com which ends up with spaces in the end
                .done(function (data) {
                    var feedEntries = [];//Array of feed entries

                    var queryResult = data.responseData;
                    if (!!queryResult) {
                        var feedUrl = queryResult.url;
                        var feed = feedUrl;//'http://feeds.feedburner.com/techcrunch/social?format=xml';

                        $('#feed').feeds({
                            feeds: {
                                feed1: feed
                            },
                            preprocess: function (e) {
                                try {
                                    feedEntries.push(this.title + " - " + this.content);
                                } catch (error) {
                                    alert(error);
                                }
                            },
                            onComplete: function () {
                                try {
                                    feedEntriesBeingReadIndex = 0;
                                    feedEntriesNoModifyCurrent = feedEntries;
                                    speakFeedEntriesRecursively(feedEntries, feedEntriesBeingReadIndex);
                                } catch (e) {
                                    alert(e);
                                }
                            }
                        });
                    }
                });
        }, function (arg) {
            alert('Sorry, we are speechless! ' + arg.toString());
        });
    } catch (e) {
        alert(e);
    }
}

function speakFeedEntriesPrevious() {
    //We decrement the feed's feedEntriesBeingReadIndex by one. We avoid doing so if it is 0 being rea
    if (feedEntriesNoModifyCurrent.length >= 1) {
        //First we stop everything
        unspeakFeed();
        speakFeedEntriesRecursively(feedEntriesNoModifyCurrent, feedEntriesBeingReadIndex--);
    } else {

    }

}

function speakFeedEntriesNext() {
    //We increment the feed's feedEntriesBeingReadIndex by one, if it has that length;
    if (feedEntriesNoModifyCurrent.length <= feedEntriesBeingReadIndex + 1) {
        //First we stop everything
        unspeakFeed();
        speakFeedEntriesRecursively(feedEntriesNoModifyCurrent, feedEntriesBeingReadIndex++);
    }
}


function speakFeedEntriesRecursively(feedEntries, feedEntriesBeingReadIndex) {
    try {
        if (feedEntries.length == feedEntriesBeingReadIndex) {
            $('#feedNowSpeaking').empty();
            $('#feedNowSpeaking').html(feedEntries[feedEntriesBeingReadIndex]);
            window.plugins.tts.speak(feedEntries[feedEntriesBeingReadIndex],
                function (arg) {
                    feedEntries.shift(); //We are done, lets get rid of this entry
                    speakFeedEntriesRecursively(feedEntries, feedEntriesBeingReadIndex);
                    feedEntriesBeingReadIndex++;
                }, function (arg) {
                    alert(arg);
                });
        }
    } catch (e) {
        alert(e);
    }
}

var discoverFeedUrlFor = function (pageURL) {
    var baseApiUrl = "http://ajax.googleapis.com/ajax/services/feed/lookup?v=1.0";
    var jQueryJsonpToken = "&callback=?"; // tells jQuery to treat it as JSONP request
    var pageUrlParameter = "&q=" + pageURL;
    var requestUrl = baseApiUrl + jQueryJsonpToken + pageUrlParameter;
    return $.getJSON(requestUrl);
};