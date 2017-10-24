(function() {
    'use strict';

    var settings = {
        api: 'https://petri-net-api.herokuapp.com',
        html5Mode: true
    };

    angular.module('petriNet').constant('settings', settings);
})();
