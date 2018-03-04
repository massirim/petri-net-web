(function() {
    'use strict';

    petriLogicService.$inject = [];
    function petriLogicService() {
        var service = {
            foo: foo
        };
        return service;

        ///// Functions /////
        function foo() {
            console.log('Service says: Hello world!');
        }
    }

    angular.module('petriNet.common').service('petriLogicService', petriLogicService);
})();
