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
            reset: reset,
            startSimulation: startSimulation
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
        function startSimulation(callback) {
            var fireableTransitions = [];
            for (var transitionId in _transitions) {
                var transition = _transitions[transitionId];
                if( _isFireable(transition) ) {
                    fireableTransitions.push(transitionId);
                }
            }
            _triggerTransitions(fireableTransitions);
            callback(fireableTransitions);
        }

        function _isFireable(transition) {
            var fireable = true;
            angular.forEach(transition.inputs, function (arcId) {
                var arc = _arcs[arcId];
                var source = _places[arc.sourceId];
                if (source.tokens < arc.value)
                    fireable = false;
            });
            return fireable;
        };

        function _triggerTransitions(fireableTransitions) {
            // Trigger all inputs, then all outputs
            angular.forEach(fireableTransitions, function (transitionId) {
                var transition = _transitions[transitionId];
                angular.forEach(transition.inputs, function (arcId) {
                    var arc = _arcs[arcId];
                    var source = _places[arc.sourceId];
                    source.tokens -= arc.value;
                });
            });
            // Outputs
            angular.forEach(fireableTransitions, function (transitionId) {
                var transition = _transitions[transitionId];
                angular.forEach(transition.outputs, function (arcId) {
                    var arc = _arcs[arcId];
                    var target = _places[arc.targetId];
                    target.tokens += arc.value;
                });
            });
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
            _log('addPlace')
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
            data.inputs = data.inputs || [];
            data.outputs = data.outputs || [];
            _transitions[id] = data;
            _log('addTransition')
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
            if (_transitions[data.sourceId]) {
                _transitions[data.sourceId].outputs.push(id);
            } else {
                _transitions[data.targetId].inputs.push(id);
            }
            _log('addArc')
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
            if (sourceType == 'arc') isValid = false;
            if (targetType == 'arc') isValid = false;

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
                case 'place':
                    elementList = _places;
                    isNode = true;
                    break;
                case 'transition':
                    elementList = _transitions;
                    isNode = true;
                    break;
                case 'arc':
                    elementList = _arcs;
                    isNode = false;
                    break;
            }

            delete elementList[elementId];

            // If element is'n a node, theres no arc to remove
            if (isNode) {
                var arcsToRemove = [];
                angular.forEach(_arcs, function (arc, arcId) {
                    if (arc.sourceId === elementId || arc.targetId === elementId) {
                        arcsToRemove.push(arcId);
                        delete _arcs[arcId];
                        _removeArcReferences(arcId)
                    }
                });
                _log('Remove node')
                return arcsToRemove;
            } else {
                _removeArcReferences(elementId)
                _log('Remove arc')
                return [];
            }
        }

        function _removeArcReferences(id) {
            angular.forEach(_transitions, function (transition) {
                angular.forEach(transition.inputs, function (arcId, index) {
                    if (arcId == id)
                        transition.inputs.splice(index, 1);
                });
                angular.forEach(transition.outputs, function (arcId, index) {
                    if (arcId == id)
                        transition.outputs.splice(index, 1);
                });
            });
        }

        function _log(str) {
            console.log('----------'+ str +'----------');
            console.log('_places', _places);
            console.log('_transitions', _transitions);
            console.log('_arcs', _arcs);
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
            _places = {};
            _transitions = {};
            _arcs = {};
        }
    }

    angular.module('petriNet.common').service('petriLogicService', petriLogicService);
})();
