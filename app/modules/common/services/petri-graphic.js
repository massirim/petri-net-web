(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.service:petriGraphicService
     * @description
     * description...
     **/
    petriGraphicService.$inject = ['petriLogicService', 'configFactory', 'placeFactory', 'svgAssetsFactory', 'transitionFactory', 'arcFactory'];
    function petriGraphicService(petriLogicService, configFactory, placeFactory, svgAssetsFactory, transitionFactory, arcFactory) {
        var service = {
            newDraw: newDraw,
            newPlace: newPlace,
            newTransition: newTransition,
            newArc: newArc,
            getElementById: getElementById,
            getElements: getElements,
            getNodes: getNodes,
            remove: remove
        };

        // Groups
        var _draw = {};
        var _elements = {}; // Places, transitions and arcs
        var _nodes = {}; // Only places and transitions
        var _places = {};
        var _transitions = {};
        var _arcs = {};

        return service;

        ///// Functions /////

        /**
         * @ngdoc method
         * @name newDraw
         * @methodOf petriNet.common.service:petriGraphicService
         * @param {String} element ID of the html element to insert the SVG element.
         * @param {int | string} width Width to spawn the SVG element.
         * @param {int | string} height Height to spawn the SVG element.
         * @description
         * Starts a new SVG element or resets an existing one.
         **/
        function newDraw(element, width, height) {
            if ( angular.equals(_draw, {}) ) {
                // New SVG and groups of elements
                _draw = SVG(element).size(width || '100%', height || '100%').panZoom(configFactory.get().zoom);
            } else {
                _centerView();
                _draw.zoom(1);
                _draw.clear();
                // Clean all data in logic service
                petriLogicService.reset();
            }
            _elements = _draw.group();
            _nodes = _elements.group();
            _places = _nodes.group();
            _transitions = _nodes.group();
            _arcs = _elements.group();
        }

        function _centerView() {
            if ( angular.equals(_draw, {}) ) return;
            if ( angular.isUndefined(_draw.node.attributes.viewBox) ) return;

            var viewBox = _draw.node.attributes.viewBox.value || '0 0 0 0';
            viewBox = viewBox.split(' ');
            viewBox[0] = '0';
            viewBox[1] = '0';
            viewBox = viewBox.join(' ');
            _draw.node.attributes.viewBox.value = viewBox;
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriGraphicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newPlace(label, tokens) {
            var center = _centerPosition();
            tokens = tokens || 0;

            var placeElement = placeFactory.newPlace(_places, center.x, center.y, label, tokens);
            // Informs the logic service that a new place was created
            petriLogicService.addPlace(placeElement.node.id, {
                tokens: tokens
            });

            return placeElement;
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriGraphicService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newTransition(x, y, label) {
            var center = _centerPosition();

            var transitionElement = transitionFactory.newTransition(_transitions, center.x, center.y, label);
            // Informs the logic service that a new transition was created
            petriLogicService.addTransition(transitionElement.node.id, {});

            return transitionElement;
        }

        /**
         * @ngdoc method
         * @name _initialPosition
         * @methodOf petriNet.common.service:petriGraphicService
         * @returns {Object} Coordinates to the center of the SVG element
         * @description
         * Evaluate the coordinates to the SVG element center position
         **/
        function _centerPosition() {
            var svgViewBox = _draw.node.viewBox.baseVal;
            var svgWidth = _draw.node.width.baseVal.value;
            var svgHeight = _draw.node.height.baseVal.value;

            return {
                x: svgViewBox.x + svgWidth / 2,
                y: svgViewBox.y + svgHeight / 2
            };
        }

        function newArc(source, target, value) {
            source = source.parent().first();
            target = target.parent().first();
            var sourceType = source.node.localName;
            var sourceId = source.node.id;
            var targetType = target.node.localName;
            var targetId = target.node.id;

            if( petriLogicService.isValidArc(sourceType, targetType) ) {
                var newConn = arcFactory.newArc(_arcs, source, target, value);

                petriLogicService.addArc(newConn.node.id, {
                    sourceId: sourceId,
                    targetId: targetId,
                    value: value
                });

                return newConn;
            }
        }

        function getElementById(elementId) {
            return SVG.get(elementId);
        }

        function getElements() {
            return _elements;
        }

        function getNodes() {
            return _nodes;
        }

        function remove(element) {
            var elementId = element.node.id;
            var elementType = element.node.tagName;

            if(elementType == 'circle' || elementType == 'rect' || elementType == 'path') {
                element.parent().remove();

                var arcsToRemove = petriLogicService.remove(elementType, elementId);
                if (arcsToRemove.length > 0) {
                    angular.forEach(arcsToRemove, function (arcId) {
                        var arcContainer = SVG.get(arcId).parent();
                        arcContainer.remove();
                    });
                }
            }
        }
    }

    angular.module('petriNet.common').service('petriGraphicService', petriGraphicService);
})();
