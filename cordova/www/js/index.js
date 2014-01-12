const $feedNowSpeaking = $('#feedNowSpeaking');
const $feedsList = $('#feedsList');
const $itemTemplate = $('.itemTemplate');
const $genderItemTemplate = $('.genderItemTemplate');
const $countryItemTemplate = $('.countryItemTemplate');
const $industryItemTemplate = $('.industryItemTemplate');
const $genderList = $('.genderList');
const $countryList = $('.countryList');
const $industryList = $('.industryList');
const $FeedSetupGenders = $('.FeedSetupGenders');
const $FeedSetupCountries = $('.FeedSetupCountries');
const $FeedSetupIndustries = $('.FeedSetupIndustries');
const $Loader = $(".Loader");
const $FeedSetup = $(".FeedSetup");
const $FeedInterface = $(".FeedInterface");

const clsItemTitle = '.itemTitle';
const clsItemDescription = '.itemDescription';
const clsItemBookmark = '.itemBookmark';
const clsItemAdvanced = '.itemAdvanced';
const clsItemHide = '.itemHide';


const strId = "id";


const flag_super_friend = "flag_super_friend";
const flag_app_launched = "flag_app_launched";

const endpointYawn = "http://23.253.36.42:40200";
const endpointScream = "http://23.253.36.42:30200";
const endpointStalk = "http://23.253.36.42:16285";
const endpointSuperFriend = "http://23.253.36.42:20200";
const endpointGuardian = "http://23.253.36.42:50200";

var humanId;


const Country_Global_ABC = 'http://feeds.abcnews.com/abcnews/internationalheadlines';
const Industry_Technology_Y_Combinator = 'https://news.ycombinator.com/rss';

const countries = [
    {'title': 'Don\'t care                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Afghanistan                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Albania                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Algeria                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Andorra                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Angola                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Antigua & Deps                ', 'feeds': [Country_Global_ABC]},
    {'title': 'Argentina                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Armenia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Australia                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Austria                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Azerbaijan                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bahamas                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bahrain                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bangladesh                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Barbados                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Belarus                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Belgium                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Belize                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Benin                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bhutan                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bolivia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bosnia Herzegovina            ', 'feeds': [Country_Global_ABC]},
    {'title': 'Botswana                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Brazil                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Brunei                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bulgaria                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Burkina                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Burundi                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Cambodia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Cameroon                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Canada                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Cape Verde                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Central African Rep           ', 'feeds': [Country_Global_ABC]},
    {'title': 'Chad                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Chile                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'China                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Colombia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Comoros                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Congo                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Congo {Democratic Rep}        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Costa Rica                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Croatia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Cuba                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Cyprus                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Czech Republic                ', 'feeds': [Country_Global_ABC]},
    {'title': 'Denmark                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Djibouti                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Dominica                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Dominican Republic            ', 'feeds': [Country_Global_ABC]},
    {'title': 'East Timor                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Ecuador                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Egypt                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'El Salvador                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Equatorial Guinea             ', 'feeds': [Country_Global_ABC]},
    {'title': 'Eritrea                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Estonia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Ethiopia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Fiji                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Finland                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'France                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Gabon                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Gambia                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Georgia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Germany                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Ghana                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Greece                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Grenada                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Guatemala                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Guinea                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Guinea-Bissau                 ', 'feeds': [Country_Global_ABC]},
    {'title': 'Guyana                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Haiti                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Honduras                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Hungary                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Iceland                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'India                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Indonesia                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Iran                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Iraq                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Ireland {Republic}            ', 'feeds': [Country_Global_ABC]},
    {'title': 'Israel                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Italy                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Ivory Coast                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Jamaica                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Japan                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Jordan                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Kazakhstan                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Kenya                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Kiribati                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Korea North                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Korea South                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Kosovo                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Kuwait                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Kyrgyzstan                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Laos                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Latvia                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Lebanon                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Lesotho                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Liberia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Libya                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Liechtenstein                 ', 'feeds': [Country_Global_ABC]},
    {'title': 'Lithuania                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Luxembourg                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Macedonia                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Madagascar                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Malawi                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Malaysia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Maldives                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Mali                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Malta                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Marshall Islands              ', 'feeds': [Country_Global_ABC]},
    {'title': 'Mauritania                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Mauritius                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Mexico                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Micronesia                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Moldova                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Monaco                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Mongolia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Montenegro                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Morocco                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Mozambique                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Myanmar, {Burma}              ', 'feeds': [Country_Global_ABC]},
    {'title': 'Namibia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Nauru                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Nepal                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Netherlands                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'New Zealand                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Nicaragua                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Niger                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Nigeria                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Norway                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Oman                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Pakistan                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Palau                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Panama                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Papua New Guinea              ', 'feeds': [Country_Global_ABC]},
    {'title': 'Paraguay                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Peru                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Philippines                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Poland                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Portugal                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Qatar                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Romania                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Russian Federation            ', 'feeds': [Country_Global_ABC]},
    {'title': 'Rwanda                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'St Kitts & Nevis              ', 'feeds': [Country_Global_ABC]},
    {'title': 'St Lucia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Saint Vincent & the Grenadines', 'feeds': [Country_Global_ABC]},
    {'title': 'Samoa                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'San Marino                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Sao Tome & Principe           ', 'feeds': [Country_Global_ABC]},
    {'title': 'Saudi Arabia                  ', 'feeds': [Country_Global_ABC]},
    {'title': 'Senegal                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Serbia                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Seychelles                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Sierra Leone                  ', 'feeds': [Country_Global_ABC]},
    {'title': 'Singapore                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Slovakia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Slovenia                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Solomon Islands               ', 'feeds': [Country_Global_ABC]},
    {'title': 'Somalia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'South Africa                  ', 'feeds': [Country_Global_ABC]},
    {'title': 'Spain                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Sri Lanka                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Sudan                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Suriname                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Swaziland                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Sweden                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Switzerland                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Syria                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Taiwan                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Tajikistan                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Tanzania                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Thailand                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Togo                          ', 'feeds': [Country_Global_ABC]},
    {'title': 'Tonga                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Trinidad & Tobago             ', 'feeds': [Country_Global_ABC]},
    {'title': 'Tunisia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Turkey                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Turkmenistan                  ', 'feeds': [Country_Global_ABC]},
    {'title': 'Tuvalu                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Uganda                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Ukraine                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'United Arab Emirates          ', 'feeds': [Country_Global_ABC]},
    {'title': 'United Kingdom                ', 'feeds': [Country_Global_ABC]},
    {'title': 'United States                 ', 'feeds': [Country_Global_ABC]},
    {'title': 'Uruguay                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Uzbekistan                    ', 'feeds': [Country_Global_ABC]},
    {'title': 'Vanuatu                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Vatican City                  ', 'feeds': [Country_Global_ABC]},
    {'title': 'Venezuela                     ', 'feeds': [Country_Global_ABC]},
    {'title': 'Vietnam                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Yemen                         ', 'feeds': [Country_Global_ABC]},
    {'title': 'Zambia                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Zimbabwe                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Rest of the world             ', 'feeds': [Country_Global_ABC]}
];


const industries = [
    {'title': 'Don\'t care                      ', 'feeds': []},
    {'title': 'Agriculture                      ', 'feeds': []},
    {'title': 'Beverage & Tobacco               ', 'feeds': []},
    {'title': 'Accounting                       ', 'feeds': []},
    {'title': 'Advertising                      ', 'feeds': []},
    {'title': 'Aerospace                        ', 'feeds': []},
    {'title': 'Aircraft                         ', 'feeds': []},
    {'title': 'Airline                          ', 'feeds': []},
    {'title': 'Apparel & Accessories            ', 'feeds': []},
    {'title': 'Automotive                       ', 'feeds': []},
    {'title': 'Banking                          ', 'feeds': []},
    {'title': 'Broadcasting                     ', 'feeds': []},
    {'title': 'Brokerage                        ', 'feeds': []},
    {'title': 'Biotechnology                    ', 'feeds': []},
    {'title': 'Pension Funds                    ', 'feeds': []},
    {'title': 'Call Centers                     ', 'feeds': []},
    {'title': 'Cargo Handling                   ', 'feeds': []},
    {'title': 'Chemical                         ', 'feeds': []},
    {'title': 'Computer                         ', 'feeds': []},
    {'title': 'Consulting                       ', 'feeds': []},
    {'title': 'Consumer Products                ', 'feeds': []},
    {'title': 'Cosmetics                        ', 'feeds': []},
    {'title': 'Defense                          ', 'feeds': []},
    {'title': 'Department Stores                ', 'feeds': []},
    {'title': 'Software                         ', 'feeds': []},
    {'title': 'Education                        ', 'feeds': []},
    {'title': 'Sports                           ', 'feeds': []},
    {'title': 'Electronics                      ', 'feeds': []},
    {'title': 'Energy                           ', 'feeds': []},
    {'title': 'Entertainment & Leisure          ', 'feeds': []},
    {'title': 'Television                       ', 'feeds': []},
    {'title': 'Executive Search                 ', 'feeds': []},
    {'title': 'Financial Services               ', 'feeds': []},
    {'title': 'Food                             ', 'feeds': []},
    {'title': 'Grocery                          ', 'feeds': []},
    {'title': 'Health Care                      ', 'feeds': []},
    {'title': 'Internet Publishing              ', 'feeds': []},
    {'title': 'Investment Banking               ', 'feeds': []},
    {'title': 'Legal                            ', 'feeds': []},
    {'title': 'Manufacturing                    ', 'feeds': []},
    {'title': 'Motion Picture & Video           ', 'feeds': []},
    {'title': 'Music                            ', 'feeds': []},
    {'title': 'Newspaper Publishers             ', 'feeds': []},
    {'title': 'Online Auctions                  ', 'feeds': []},
    {'title': 'Pharmaceuticals                  ', 'feeds': []},
    {'title': 'Private Equity                   ', 'feeds': []},
    {'title': 'Publishing                       ', 'feeds': []},
    {'title': 'Real Estate                      ', 'feeds': []},
    {'title': 'Retail & Wholesale               ', 'feeds': []},
    {'title': 'Securities & Commodity Exchanges ', 'feeds': []},
    {'title': 'Service                          ', 'feeds': []},
    {'title': 'Soap & Detergent                 ', 'feeds': []},
    {'title': 'Technology                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Telecommunications               ', 'feeds': []},
    {'title': 'Transportation                   ', 'feeds': []},
    {'title': 'Venture Capital                  ', 'feeds': []}
];

const genders = [
    {'title': 'Don\'t care', 'feeds': []},
    {'title': 'Male       ', 'feeds': []},
    {'title': 'Female     ', 'feeds': []}
];


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
                                                        initialSetup();
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

        //initialSetup();
        WakeUp();
        justVisiting();
        section($FeedInterface)
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
                            clone.attr(strId, id);
                            clone.find(clsItemTitle).text(item.title);
                            //clone.find('.itemTitle').attr('href', item.link);
                            clone.find(clsItemTitle).attr("title", item.link);
                            clone.find(clsItemTitle).attr("style", "font-size: 40px; text-decoration: underline;color: #271aad;");
                            clone.find(clsItemTitle).click(
                                function(){
                                    $('.itemTemplate:not(#'+ id + ')').animate({opacity:0.2});
                                    window.localStorage.setItem('lastVisited', this.title);
                                    setTimeout("openLink(window.localStorage.getItem('lastVisited'))", 1000);
                                }
                            );
                            //clone.find('.itemDescription').html(item.description.replace(/<(?:.|\n)*?>/gm, ''));
                            clone.find(clsItemDescription).html(item.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<iframe\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/iframe>/gi, ''));
                            //clone.find('.itemDescription').html(item.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''));
                            //Without the script replacement, Chris Brogan blog renders elements wrong
                            //Without the iframe replacement, Pinterest gives the following error "Application Error - There was a network error. (file://instagram.com/p/iosdfadsf/embed). This comes as a Android alert.

                            {//itemBookmark
                                clone.find(clsItemBookmark).attr("title", item.link);
                                clone.find(clsItemBookmark).click(
                                    function(){
                                        $(this).fadeTo('fast', 0.5).fadeIn('fast',
                                            function(){
                                                share($(this).attr('title'));
                                            });
                                    });
                            }

                            {//itemAdvanced
                                clone.find(clsItemAdvanced).attr("title", item.source);
                            }

                            {//itemHide
                                clone.find(clsItemHide).attr("title", item.link);
                                clone.find(clsItemHide).click(
                                    function(){
                                        $(this).fadeOut('fast', function(){
                                            hide($(this).attr('title'));
                                        });
                                    });
                            }

                            $feedsList.append(clone);
                            if(i < 5){
                                clone.animate({opacity:0.0});
                                clone.animate({opacity:1.0}, {duration: i * 300, complete: function(){
                                    for( i = 0 ; i < 1 ; i++ ) {
                                        clone.fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                                    }
                                }});
                            }
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
        $("#" + id).animate({opacity:0.1}, {duration: 100, complete: function(){
            $("#" + id).slideUp(300);
        }});
    } catch (e) {
        alert(e);
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
        return rgHttpUrl.test(url);
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

    try {
        section($Loader);

        for (var i = 0; i < countries.length; i++) {
            (function (i, j) {
                try {
                    var item = countries[i];
                    var clone = $countryItemTemplate.clone();
                    clone.find('.title').text(item.title);
                    clone.click(
                        function () {
                            alert(item.title);
                            item.feeds.forEach(function (value) {
                                alert(value);
                                _internal_screamLink(value);
                            });

                            $FeedSetupCountries.fadeOut("fast");
                            $FeedSetupGenders.fadeIn("slow");

                        }
                    );
                    $countryList.append(clone);
                    if (i < 20) {
                        clone.animate({opacity: 0.0});
                        clone.animate({opacity: 1.0}, {duration: i * 200, complete: function () {
                            for (i = 0; i < 1; i++) {
                                clone.fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                            }
                        }});
                    }

                    if(i + 1 == j){
                        $FeedSetupGenders.hide();
                        $FeedSetupIndustries.hide();
                        section($FeedSetup);
                    }

                } catch (e) {
                    alert(e);
                }
            })(i, countries.length);
        }

        for (var ig = 0; ig < genders.length; ig++) {
            (function (ig, j) {
                try {
                    var item = genders[ig];
                    var clone = $genderItemTemplate.clone();
                    clone.find('.title').text(item.title);
                    clone.click(
                        function () {
                            alert(item.title);
                            item.feeds.forEach(function (value) {
                                alert(value);
                                _internal_screamLink(value);
                            });
                            $FeedSetupGenders.fadeOut("fast");
                            $FeedSetupIndustries.fadeIn("slow");
                        }
                    );
                    $genderList.append(clone);
                    if (ig < 20) {
                        clone.animate({opacity: 0.0});
                        clone.animate({opacity: 1.0}, {duration: ig * 200, complete: function () {
                            for (ig = 0; ig < 1; ig++) {
                                clone.fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                            }
                        }});
                    }

                    if(ig + 1 == j){
                    }

                } catch (e) {
                    alert(e);
                }
            })(ig, genders.length);
        }
        for (var ii = 0; ii < industries.length; ii++) {
            (function (ii, j) {
                try {
                    var item = industries[ii];
                    var clone = $industryItemTemplate.clone();
                    clone.find('.title').text(item.title);
                    clone.click(
                        function () {
                            alert(item.title);
                            item.feeds.forEach(function (value) {
                                alert(value);
                                _internal_screamLink(value);

                            });

                            $FeedSetupCountries.fadeOut("fast");
                            $FeedSetupGenders.fadeIn("slow");


                            alert("Tap 'pink nm' to add RSS feed or share link.\n " +
                                "We added some for you.\n" +
                                "Click the asterisks to remove feed.");
                            postSession();

                        }
                    );
                    $industryList.append(clone);
                    if (ii < 20) {
                        clone.animate({opacity: 0.0});
                        clone.animate({opacity: 1.0}, {duration: ii * 200, complete: function () {
                            for (ii = 0; ii < 1; ii++) {
                                clone.fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                            }
                        }});
                    }

                    if(ii + 1 == j){
                    }

                } catch (e) {
                    alert(e);
                }
            })(ii, industries.length);
        }
    } catch (e) {
        alert(e);
    }

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

