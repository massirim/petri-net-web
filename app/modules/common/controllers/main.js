(function() {
    'use strict';

    mainController.$inject = [];
    function mainController() {
        var vm = this;

        vm.title = 'Petri Net';

        _init();

        ///// Function /////
        function _init() {

        }
    }

    angular.module('petriNet.common').controller('MainController', mainController);
})();
