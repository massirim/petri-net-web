(function() {
    'use strict';

    /** TODO
     * @ngdoc controller
     * @name petriNet.common.controller:PlaygroundController
     * @description Playground controller
     **/
    playgroundController.$inject = ['$scope', '$timeout', 'petriGraphicService', 'settings'];
    function playgroundController($scope, $timeout, petriGraphicService, settings) {
        var vm = this;

        vm.addPlace = addPlace;
        vm.addTransition = addTransition;
        vm.addArc = addArc;
        vm.remove = remove;
        vm.help = help;
        vm.clear = clear;

        vm.backgroundText = 'PetriNet Playground';
        vm.toolMessage = {};

        var _activeTool = '';

        _init();

        ///// Functions /////
        function _init() {
            petriGraphicService.newDraw('Paper');
            if (settings.enviroment === 'PRD') {
                _mock();
            }
        }

        function _mock() {
            $timeout(function () {
                var p1 = petriGraphicService.newPlace('P1', 3);
                var p2 = petriGraphicService.newPlace('P2');
                var t1 = petriGraphicService.newTransition('T1');

                p1.parent().cx(p1.parent().x() - 130);
                p2.parent().cx(p2.parent().x() + 130);

                petriGraphicService.newArc(p1, t1);
                petriGraphicService.newArc(t1, p2);
            }, 100);
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
                var tokens = window.prompt('Tokens quantity', '0');
                if( tokens !== null) {
                    tokens = tokens - 0; // String to number
                    petriGraphicService.newPlace(label, tokens);
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
                petriGraphicService.newTransition(label);
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
            vm.toolMessage.type = _activeTool = 'arc';
            vm.toolMessage.text = 'Click on an element to be the SOURCE...';
            petriGraphicService.activateConnect(function firtClick() {
                vm.toolMessage.text = 'Click on a diferent type of element to be the TARGET...';
                $scope.$digest();
            }, function secondClick() {
                vm.toolMessage.text = '';
                $scope.$digest();
            }, function wrongClick() {
                vm.toolMessage.text = 'The source and target cannot be the same type! Select another element...';
                _activeTool = '';
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
            vm.toolMessage.type = 'remove';
            if(_activeTool === 'remove') {
                _activeTool = '';
                vm.toolMessage.text = '';
            }
            else {
                _activeTool = 'remove';
                vm.toolMessage.text = 'Click on an element to DELETE it';
            }

            petriGraphicService.toggleRemove();
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
            petriGraphicService.newDraw('Paper');
        }
    }

    angular.module('petriNet.common').controller('PlaygroundController', playgroundController);
})();
