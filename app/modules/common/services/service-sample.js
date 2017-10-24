(function() {
    'use strict';

    serviceSampleService.$inject = [];
    function serviceSampleService() {
        var service = {
            foo: foo
        };
        return service;

        ///// Functions /////
        function foo() {
            console.log('Service says: Hello world!');
        }
    }

    angular.module('petriNet.common').service('serviceSampleService', serviceSampleService);
})();
