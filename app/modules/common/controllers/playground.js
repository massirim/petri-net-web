(function() {
    'use strict';

    /** TODO
     * @ngdoc controller
     * @name petriNet.common.controller:PlaygroundController
     * @description Playground controller
     **/
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
            petriUiService.newPlace();
            petriUiService.newPlace();
            petriUiService.newPlace();
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.controller:PlaygroundController
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addPlace() {
            var tokens = window.prompt('Tokens quantity:', '1');
            if( tokens !== null) {
                tokens = tokens - 0; // String to number
                petriUiService.newPlace(tokens);
            }
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.controller:PlaygroundController
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addTransition() {
            petriUiService.newTransition();
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.controller:PlaygroundController
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addArc() {
            petriUiService.activateConnect();
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.controller:PlaygroundController
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function remove() {
            petriUiService.toggleRemoveEvent();
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.controller:PlaygroundController
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
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

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.controller:PlaygroundController
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function clear() {
            petriUiService.newDraw('Paper');
        }
    }

    angular.module('petriNet.common').controller('PlaygroundController', playgroundController);
})();
