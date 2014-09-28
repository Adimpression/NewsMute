Vue.config('debug', true);


Vue.component('home', {
    template: '<h1>Home</h1><div class="content"><content/></div>',
    created: function () {
        console.log('Created Home');
    }
});

Vue.component('page1', {
    template: '<h1>Page1</h1><div class="content"><content/></div>',
    created: function () {
        console.log('Created Page1');
    }
});

Vue.component('Oh404', {
    template: '<h1>404 oh!</h1>',
    created: function () {
        console.log('Created 404');
    }
});

//    Vue.component('home', home);
//    Vue.component('page1', page1);
//
//    $.getScript("content/newspapers-part-daily-life.js", function (data, textStatus, jqxhr) {
//        alert('loaded');
//        page1.template = data;
//    });


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

