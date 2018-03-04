(function() {
    'use strict';

    playgroundController.$inject = ['svgService'];
    function playgroundController(svgService) {
        var vm = this;

        vm.addPlace = addPlace;
        vm.addTransition = addTransition;
        vm.addArc = addArc;
        vm.remove = remove;
        vm.help = help;
        vm.clear = clear;

        vm.backgroundText = 'PetriNet Playground';

        _init();

        ///// Functions /////
        function _init() {
            svgService.newDraw('Paper');
            //_mock();
        }

        function _mock() {
            svgService.newPlace(100);
            svgService.newPlace(100);
            svgService.newPlace(100);
        }

        function addPlace() {
            svgService.newPlace(100);
        }

        function addTransition() {
            svgService.newTransition(50, 100);
        }

        function addArc() {
            svgService.activateConnect();
        }

        function remove() {
            svgService.toggleRemoveEvent();
        }

        function help() {
            alert(
                '>> Resize:\n' +
                '- Pinch w/ 2 fingers\n' +
                '- Mouse scroll\n\n' +
                '>> Move\n' +
                '- Hold with 2 fingers and move\n' +
                '- Click on background and drag'
            );
        }

        function clear() {
            svgService.newDraw('Paper');
        }
    }

    angular.module('petriNet.common').controller('PlaygroundController', playgroundController);
})();
