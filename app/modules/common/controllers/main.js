(function() {
    'use strict';

    /** TODO
     * @ngdoc controller
     * @name petriNet.common.controller:MainController
     * @description Main controller
     **/
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
