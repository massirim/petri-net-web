(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:factorySample
     * @description
     * description...
     **/
    factorySample.$inject = [];
    function factorySample() {
        var factory = {
            bar: bar
        };
        return factory;

        ///// Functions /////
        /** TODO
         * @ngdoc method
         * @name bar
         * @methodOf petriNet.common.factory:factorySample
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function bar() {
            console.log('Factory says: Hello world!');
        }
    }

    angular.module('petriNet.common').factory('factorySampleFactory', factorySample);
})();
