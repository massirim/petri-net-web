(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.service:serviceSampleService
     * @description
     * description...
     **/
    serviceSampleService.$inject = [];
    function serviceSampleService() {
        var service = {
            foo: foo
        };
        return service;

        ///// Functions /////
        /** TODO
         * @ngdoc method
         * @name foo
         * @methodOf petriNet.common.service:serviceSampleService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function foo() {
            console.log('Service says: Hello world!');
        }
    }

    angular.module('petriNet.common').service('serviceSampleService', serviceSampleService);
})();
