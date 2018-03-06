(function() {
    'use strict';

    /** TODO
     * @ngdoc controller
     * @name petriNet.common.controller:ControllerSampleController
     * @description Main controller
     **/
    controllerSampleController.$inject = [];
    function controllerSampleController() {
        var vm = this;

        vm.foo = 'Lorem Ipsum';

        vm.bar = bar;

        _init();

        ///// Function /////
        function _init() {

        }

        function bar() {
            console.log('Lorem Ipsum');
        }
    }

    angular.module('petriNet.common').controller('ControllerSampleController', controllerSampleController);
})();
