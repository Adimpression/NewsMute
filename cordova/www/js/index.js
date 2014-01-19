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
const Gender_Female_Elle = 'http://www.elle.com/rss/';
const Gender_Male_Elle = 'http://feeds.feedburner.com/TrendHunter/Fashion-for-Men';



const clones = new Array(35);
for (var j = 0; j < 35; j++) {
    clones[j] = $itemTemplate.clone();
}

const countries = [
    {'title': 'Don\'t care                   ', 'feeds': [Country_Global_ABC]},
    {'title': 'Afghanistan                   ', 'feeds': ['http://feeds.feedburner.com/khaama']},
    {'title': 'Albania                       ', 'feeds': ['http://topics.nytimes.com/top/news/international/countriesandterritories/albania/?rss=1']},
    {'title': 'Algeria                       ', 'feeds': ['http://www.aps.dz/spip.php?page=backend&id_rubrique=32']},
    {'title': 'Andorra                       ', 'feeds': ['http://topics.nytimes.com/top/news/international/countriesandterritories/andorra/']},
    {'title': 'Angola                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Antigua & Deps                ', 'feeds': [Country_Global_ABC]},
    {'title': 'Argentina                     ', 'feeds': ['http://www.argentinaindependent.com/category/currentaffairs/newsfromargentina/feed/']},//
    {'title': 'Armenia                       ', 'feeds': ['http://news.am/arm/rss/', 'http://www.tert.am/rss/?language=am']},//
    {'title': 'Australia                     ', 'feeds': ['http://www.abc.net.au/news/feeds/rss/']},//
    {'title': 'Austria                       ', 'feeds': ['http://rss.skynews.com.au/c/34485/f/628636/index.rss', 'http://feeds.news.com.au/public/rss/2.0/theaus_TWAM_13_3314.xml', 'http://feeds.news.com.au/public/rss1/2.0/theaus_wish_3072.xml', 'http://feeds.news.com.au/public/rss1/2.0/theaus_dealmag_3074.xml']},//
    {'title': 'Azerbaijan                    ', 'feeds': ['http://www.today.az/rss.php']},
    {'title': 'Bahamas                       ', 'feeds': ['http://www.bahamaspress.com/?feed=rss2', 'http://www.bna.bh/portal/main_rss/ar/feed.rss']},
    {'title': 'Bahrain                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bangladesh                    ', 'feeds': ['http://www.banglanews24.com/rss/rss.xml']},
    {'title': 'Barbados                      ', 'feeds': ['http://www.barbadostoday.bb/feed/']},
    {'title': 'Belarus                       ', 'feeds': ['http://naviny.by/rss/alls.xml']},
    {'title': 'Belgium                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Belize                        ', 'feeds': ['http://www.belizenewspost.com/feed/']},
    {'title': 'Benin                         ', 'feeds': ['http://allafrica.com/tools/headlines/rdf/benin/headlines.rdf']},
    {'title': 'Bhutan                        ', 'feeds': ['http://www.bhutannewsservice.com/feed/']},
    {'title': 'Bolivia                       ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bosnia Herzegovina            ', 'feeds': [Country_Global_ABC]},
    {'title': 'Botswana                      ', 'feeds': [Country_Global_ABC]},
    {'title': 'Brazil                        ', 'feeds': ['http://www.brazilsun.com/index.php/rss/24437442923341f1']},
    {'title': 'Brunei                        ', 'feeds': [Country_Global_ABC]},
    {'title': 'Bulgaria                      ', 'feeds': ['http://www.bgnewsnet.com/rssbnn20.xml']},
    {'title': 'Burkina                       ', 'feeds': ['http://allafrica.com/tools/headlines/rdf/burkinafaso/headlines.rdf']},
    {'title': 'Burundi                       ', 'feeds': ['http://allafrica.com/tools/headlines/rdf/burundi/headlines.rdf']},
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
    {'title': 'Don\'t care                      ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Agriculture                      ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Beverage & Tobacco               ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Accounting                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Advertising                      ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Aerospace                        ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Aircraft                         ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Airline                          ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Apparel & Accessories            ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Automotive                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Banking                          ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Broadcasting                     ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Brokerage                        ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Biotechnology                    ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Pension Funds                    ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Call Centers                     ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Cargo Handling                   ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Chemical                         ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Computer                         ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Consulting                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Consumer Products                ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Cosmetics                        ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Defense                          ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Department Stores                ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Software                         ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Education                        ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Sports                           ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Electronics                      ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Energy                           ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Entertainment & Leisure          ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Television                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Executive Search                 ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Financial Services               ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Food                             ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Grocery                          ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Health Care                      ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Internet Publishing              ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Investment Banking               ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Legal                            ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Manufacturing                    ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Motion Picture & Video           ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Music                            ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Newspaper Publishers             ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Online Auctions                  ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Pharmaceuticals                  ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Private Equity                   ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Publishing                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Real Estate                      ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Retail & Wholesale               ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Securities & Commodity Exchanges ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Service                          ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Soap & Detergent                 ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Technology                       ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Telecommunications               ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Transportation                   ', 'feeds': [Industry_Technology_Y_Combinator]},
    {'title': 'Venture Capital                  ', 'feeds': [Industry_Technology_Y_Combinator]}
];

const genders = [
    {'title': 'Don\'t care', 'feeds': []},
    {'title': 'Male       ', 'feeds': [Gender_Male_Elle]},
    {'title': 'Female     ', 'feeds': [Gender_Female_Elle]}
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
                //DEBUGalert('Got data');
                var json = JSON.parse(response);

                var data = json.returnValue.data;

                    data.sort(function (a, b) {//http://stackoverflow.com/questions/4222690/sorting-a-json-object-in-javascript
                            var a1st = -1; // negative value means left item should appear first
                            var b1st = 1; // positive value means right item should appear first
                            var equal = 0; // zero means objects are equal

                            //DEBUGtry { // compare your object's property values and determine their order
                                if (b.shocks < a.shocks) {
                                    return b1st;
                                }
                                else if (a.shocks < b.shocks) {
                                    return a1st;
                                }
                                else {
                                    return equal;
                                }
                            //DEBUG} catch (e) {
                            //DEBUG    alert("Error comparing " + JSON.stringify(a) + " \nWith\n " + JSON.stringify(b));
                            //DEBUG}
                        }
                    );

                data.reverse();

                var length = data.length;

                //DEBUGvar start = new Date().getTime();

                var feedListDocumentFragment = document.createDocumentFragment();


                    for (var i = 0; i < length && i < clones.length; i++) {
                    (function(i){
                        const item = data[i];
                        if (item.link != "null" && item.link != "") {//@TODO remove me, temp fix until server fixed
                            const clone = clones[i];
                            const id = crc32(item.link);
                            const feedItemTitle = clone.find(clsItemTitle);
                            const feedItemBookmark = clone.find(clsItemBookmark);
                            const feedItemHide = clone.find(clsItemHide);

                            clone.attr(strId, id);
                            feedItemTitle.text(item.title);
                            //clone.find('.itemTitle').attr('href', item.link);
                            feedItemTitle.attr("title", item.link);
                            feedItemTitle.attr("style", "font-size: 40px; text-decoration: underline;color: #271aad;");
                            feedItemTitle.click(
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
                                feedItemBookmark.attr("title", item.link);
                                feedItemBookmark.click(
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
                                feedItemHide.attr("title", item.link);
                                feedItemHide.click(
                                    function(){
                                        $(this).fadeOut('fast', function(){
                                            hide($(this).attr('title'));
                                        });
                                    });
                            }

                            clone.appendTo(feedListDocumentFragment);
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
                $feedsList.append(feedListDocumentFragment);
                //DEBUG=alert('Completed in ' + (new Date().getTime() - start ));
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
        var id = crc32(url);
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

        var countryListDocumentFragment = document.createDocumentFragment();
        for (var i = 0; i < countries.length; i++) {
            (function (i, j) {
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
                    clone.appendTo(countryListDocumentFragment);
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

            })(i, countries.length);
        }
        $countryList.append(countryListDocumentFragment);

        var genderListDocumentFragment = document.createDocumentFragment();
        for (var ig = 0; ig < genders.length; ig++) {
            (function (ig, j) {
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
                    clone.appendTo(genderListDocumentFragment);
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

            })(ig, genders.length);
        }
        $genderList.append(genderListDocumentFragment);

        var industryListDocumentFragment = document.createDocumentFragment();
        for (var ii = 0; ii < industries.length; ii++) {
            (function (ii, j) {
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
                    clone.appendTo(industryListDocumentFragment);
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

            })(ii, industries.length);
        }
        $industryList.append(industryListDocumentFragment);
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




/*
 ===============================================================================
 Crc32 is a JavaScript function for computing the CRC32 of a string
 ...............................................................................

 Version: 1.2 - 2006/11 - http://noteslog.com/category/javascript/

 -------------------------------------------------------------------------------
 Copyright (c) 2006 Andrea Ercolino
 http://www.opensource.org/licenses/mit-license.php
 ===============================================================================
 */

(function() {
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

    /* Number */
    crc32 = function( /* String */ str, /* Number */ crc ) {
        if( crc == window.undefined ) crc = 0;
        var n = 0; //a number between 0 and 255
        var x = 0; //an hex number

        crc = crc ^ (-1);
        for( var i = 0, iTop = str.length; i < iTop; i++ ) {
            n = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
            x = "0x" + table.substr( n * 9, 8 );
            crc = ( crc >>> 8 ) ^ x;
        }
        return crc ^ (-1);
    };
})();
