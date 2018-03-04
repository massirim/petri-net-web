(function() {
    'use strict';

    var routes = [
        {
            state: 'main',
            config: {
                abstract: true,
                controller: 'MainController as vm',
                templateUrl: 'modules/common/views/main.html'
            }
        },
        {
            state: 'playground',
            config: {
                url: '/',
                controller: 'PlaygroundController as vm',
                templateUrl: 'modules/common/views/playground.html'
            }
        }
    ];

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        angular.forEach(routes, function(route, key){
            $stateProvider.state(route.state, route.config);
        });
        $urlRouterProvider.otherwise('/');
    }

    angular.module('petriNet.common').config(config);
})();
