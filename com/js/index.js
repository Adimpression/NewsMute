$(document).ready(function ($) {

    Vue.config('debug', true);


    var home = Vue.extend({
        template: '<h1>Home</h1><div class="content"><content/></div>',
        created: function () {
            console.log('Created Home');
        }
    });

    var Oh404 = Vue.extend({
        template: '<h1>404 oh!</h1>',
        created: function () {
            console.log('Created 404');
        }
    });

    Vue.component('home', home);
    Vue.component('Oh404', Oh404);

    $.getScript("content/newspapers-part-daily-life.js", function (data, textStatus, jqxhr) {
    });


// simple routing
    var routes = ['home', 'page1', 'Oh404'];

    var app = new Vue({
        el: '#header',
        data: {
            routes: routes,
            currentView: getRoute()
        }
    });

    function getRoute() {
        var path = location.hash.replace(/^#!\/?/, '') || 'home';
        return routes.indexOf(path) > -1
            ? path
            : 'Oh404'
    }

    window.addEventListener('hashchange', function () {
        app.currentView = getRoute();
    });
});

