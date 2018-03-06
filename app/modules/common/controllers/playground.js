(function() {
    'use strict';

    /** TODO
     * @ngdoc controller
     * @name petriNet.common.controller:PlaygroundController
     * @description Playground controller
     **/
    playgroundController.$inject = ['$scope', 'petriUiService'];
    function playgroundController($scope, petriUiService) {
        var vm = this;

        vm.addPlace = addPlace;
        vm.addTransition = addTransition;
        vm.addArc = addArc;
        vm.remove = remove;
        vm.help = help;
        vm.clear = clear;

        vm.backgroundText = 'PetriNet Playground';
        vm.toolMessage = "";

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
            var label = window.prompt('Place label (Leave it blank for no label)');
            if( label !== null) {
                var tokens = window.prompt('Tokens quantity', '1');
                if( tokens !== null) {
                    tokens = tokens - 0; // String to number
                    petriUiService.newPlace(label, tokens);
                }
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
            var label = window.prompt('Transition label (Leave it blank for no label)');
            if( label !== null) {
                petriUiService.newTransition(label);
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
        function addArc() {
            vm.toolMessage = "Click on an element to be the SOURCE...";
            petriUiService.activateConnect(function firtClick() {
                vm.toolMessage = "Click on a diferent type of element to be the TARGET...";
                $scope.$digest();
            }, function secondClick() {
                vm.toolMessage = "";
                $scope.$digest();
            }, function wrongClick() {
                vm.toolMessage = "The source and target cannot be the same type!";
                $scope.$digest();
            });
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
