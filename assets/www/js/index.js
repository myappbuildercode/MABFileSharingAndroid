var app = angular.module('MABFiles',['ionic','controllers']);
app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider.state('login',{
        url: '/login',
        templateUrl: 'login.html',
        controller: 'loginCtrl'
    });

    $stateProvider.state('register',{
        url: '/register',
        templateUrl: 'register.html',
        controller: 'registerCtrl'
    });

    $stateProvider.state('home',{
        url: '/home',
        templateUrl: 'home.html',
        controller: 'homeCtrl'
    });

    $stateProvider.state('filesList',{
        url: '/filesList',
        templateUrl: 'filesList.html',
        controller: 'filesListCtrl'
    });

    $stateProvider.state('subfilesList',{
        url: '/subfilesList',
        templateUrl: 'subfilesList.html',
        controller: 'subfilesListCtrl'
    });

    $stateProvider.state('subfilesList1',{
        url: '/subfilesList1',
        templateUrl: 'subfilesList1.html',
        controller: 'subfilesList1Ctrl'
    });

    $stateProvider.state('subfilesList2',{
        url: '/subfilesList2',
        templateUrl: 'subfilesList2.html',
        controller: 'subfilesList2Ctrl'
    });

    $urlRouterProvider.otherwise('/login');
});


/*document.addEventListener('deviceready', function () {
    console.log("cordova.plugins.email is now available");
    cordova.plugins.email.isAvailable(
        function (isAvailable) {
            
        }
    );
}, false);*/


function relative_time(date_str) {
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    var parsed_date = new Date(date_str);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
    delta=(delta<2)?2:delta;
    var r = '';
    if (delta < 60) {
    r = delta + ' secs ago';
    } else if(delta < 120) {
    r = 'a min ago';
    } else if(delta < (45*60)) {
    r = (parseInt(delta / 60, 10)).toString() + ' mins ago';
    } else if(delta < (2*60*60)) {
    r = 'an hr ago';
    } else if(delta < (24*60*60)) {
    r = '' + (parseInt(delta / 3600, 10)).toString() + ' hrs ago';
    } else if(delta < (48*60*60)) {
    r = 'a day ago';
    } else {
    r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
    return '' + r;
}

function exitout(button) {
    if (button == 1) {
       navigator.app.exitApp();
    }else{
                   
    }
}




