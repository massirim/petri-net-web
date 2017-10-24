(function() {
    'use strict';

    homeController.$inject = ['serviceSampleService', 'factorySampleFactory'];
    function homeController(serviceSampleService, factorySampleFactory) {
        var vm = this;

        vm.title = 'Home';

        _init();

        //// Function /////
        function _init() {
            serviceSampleService.foo();
            factorySampleFactory.bar();
        }
    }

    angular.module('petriNet.common').controller('HomeController', homeController);
})();
