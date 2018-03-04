(function() {
    'use strict';

    playgroundController.$inject = ['petriUiService'];
    function playgroundController(petriUiService) {
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
            petriUiService.newDraw('Paper');
            //_mock();
        }

        function _mock() {
            petriUiService.newPlace(100);
            petriUiService.newPlace(100);
            petriUiService.newPlace(100);
        }

        function addPlace() {
            petriUiService.newPlace(100);
        }

        function addTransition() {
            petriUiService.newTransition(50, 100);
        }

        function addArc() {
            petriUiService.activateConnect();
        }

        function remove() {
            petriUiService.toggleRemoveEvent();
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
            petriUiService.newDraw('Paper');
        }
    }

    angular.module('petriNet.common').controller('PlaygroundController', playgroundController);
})();
