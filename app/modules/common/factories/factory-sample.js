(function() {
    'use strict';

    factorySample.$inject = [];
    function factorySample() {
        var factory = {
            bar: bar
        };
        return factory;

        ///// Functions /////
        function bar() {
            console.log('Factory says: Hello world!');
        }
    }

    angular.module('petriNet.common').factory('factorySampleFactory', factorySample);
})();
