(function() {
    'use strict';

    var settings = {
        enviroment: 'DEV',
        api: 'http://localhost:3000',
        html5Mode: false
    };

    angular.module('petriNet').constant('settings', settings);
})();
