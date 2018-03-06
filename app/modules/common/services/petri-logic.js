(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.service:petriLogicService
     * @description
     * description...
     **/
    petriLogicService.$inject = ['$interval'];
    function petriLogicService($interval) {
        var service = {
            addPlace: addPlace,
            addTransition: addTransition,
            addArc: addArc,
            isValidArc: isValidArc,
            remove: remove,
            reset: reset
        };

        var _places = {};
        var _transitions = {};
        var _arcs = {};

        return service;

        ///// Functions /////
        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function startSimulation() {

        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addPlace(id, data) {
            _places[id] = data;
            console.log(_places);
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addTransition(id, data) {
            _transitions[id] = data;
            console.log(_transitions);
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addArc(id, data) {
            _arcs[id] = data;
            console.log(_arcs);
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function isValidArc(sourceType, targetType) {
            var isValid = true;
            if (sourceType == targetType) isValid = false;
            if (sourceType == 'path') isValid = false;
            if (targetType == 'path') isValid = false;

            return isValid;
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * Remove the element from the list and if it's a node element, return
         * the id of all the arcs connected to it.
         **/
        function remove(elementType, elementId) {
            var elementList;
            var isNode;
            switch (elementType) {
                case 'circle':
                    elementList = _places;
                    isNode = true;
                    break;
                case 'rect':
                    elementList = _transitions;
                    isNode = true;
                    break;
                case 'path':
                    elementList = _arcs;
                    isNode = false;
                    break;
            }

            // If element is'n a node, theres no arc to remove
            if (isNode) {
                var arcsToRemove = [];
                angular.forEach(_arcs, function (arc, arcId) {
                    if (arc.sourceId === elementId || arc.targetId === elementId) {
                        arcsToRemove.push(arcId);
                        delete _arcs[arcId];
                    }
                });
                return arcsToRemove;
            } else {
                return [];
            }
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriLogicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * Reset the service state
         **/
        function reset() {
            _places = [];
            _transitions = [];
            _arcs = [];
        }
    }

    angular.module('petriNet.common').service('petriLogicService', petriLogicService);
})();
