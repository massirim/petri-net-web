(function() {
    'use strict';

    config.$inject = ['$locationProvider', 'settings'];
    function config($locationProvider, settings) {
        // Remove (or not) '#' from URL
        $locationProvider.html5Mode(settings.html5Mode);
    }

    angular.module('petriNet').config(config);
})();
