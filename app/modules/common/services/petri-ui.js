(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.service:petriUiService
     * @description
     * description...
     **/
    petriUiService.$inject = ['petriLogicService', 'configFactory', 'placeFactory', 'svgAssetsFactory', 'transitionFactory', 'arcFactory'];
    function petriUiService(petriLogicService, configFactory, placeFactory, svgAssetsFactory, transitionFactory, arcFactory) {
        var service = {
            newDraw: newDraw,
            newPlace: newPlace,
            newTransition: newTransition,
            toggleRemove: toggleRemove,
            activateConnect: activateConnect
        };

        // Groups
        var _draw = {};
        var _elements = {};
        var _nodes = {};
        var _places = {};
        var _transitions = {};
        var _arcs = {};

        // Aux
        var _isRemoveOn = false;
        var _connectClicksCount = 0;
        var _sourceElement = {};
        var _targetElement = {};
        var _firstClickCallback = function() {};
        var _secondClickCallback = function() {};
        var _wrongClickCallback = function() {};

        return service;

        ///// Functions /////

        /**
         * @ngdoc method
         * @name newDraw
         * @methodOf petriNet.common.service:petriUiService
         * @param {String} element ID of the html element to insert the SVG element.
         * @param {int | string} width Width to spawn the SVG element.
         * @param {int | string} height Height to spawn the SVG element.
         * @description
         * Starts a new SVG element or resets an existing one.
         **/
        function newDraw(element, width, height) {
            if ( angular.equals(_draw, {}) ) {
                _draw = SVG(element).size(width || '100%', height || '100%').panZoom(configFactory.get().zoom);
                _checkGroups();
            }
            else
                _resetService();
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriUiService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newPlace(label, tokens) {
            _checkGroups();
            _resetTools();
            tokens = tokens || 0;

            var center = _centerPosition();
            var newPlaceElement = placeFactory.newPlace(_places, center.x, center.y, label, tokens);
            // Informs the logic service that a new place was created
            petriLogicService.addPlace(newPlaceElement.node.id, {
                tokens: tokens
            });
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriUiService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newTransition(label) {
            _checkGroups();
            _resetTools();

            var center = _centerPosition();
            var transitionElement = transitionFactory.newTransition(_transitions, center.x, center.y, label);
            // Informs the logic service that a new transition was created
            petriLogicService.addTransition(transitionElement.node.id, {});
        }

        /**
         * @ngdoc method
         * @name _initialPosition
         * @methodOf petriNet.common.service:petriUiService
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

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriUiService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function toggleRemove(activeCallback, inactiveCallback) {
            _resetTools();
            if (_isRemoveOn) {
                _elements.off('click');
                _elements.off('touchend');
                _isRemoveOn = false;
            } else {
                _elements.click(_removeHandler);
                _elements.touchend(_removeHandler);
                _isRemoveOn = true;
                console.log('deactivated')
            }
        }

        function _removeHandler(event) {
            var elementId = event.target.id;
            var elementType = event.target.tagName;
            var element = SVG.get(elementId);
            element.remove();

            var arcsToRemove = petriLogicService.remove(elementType, elementId);

            if (arcsToRemove.length > 0) {
                angular.forEach(arcsToRemove, function (arcId) {
                    var arcElem = SVG.get(arcId);
                    arcElem.remove();
                });
            }
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriUiService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function activateConnect(firstClickCallback, secondClickCallback, wrongClickCallback) {
            _resetTools();
            _firstClickCallback = firstClickCallback;
            _secondClickCallback = secondClickCallback;
            _wrongClickCallback = wrongClickCallback;
            _nodes.click(_connectHandler);
            _nodes.touchend(_connectHandler);
        }

        function _connectHandler(event) {
            // Select the first element to avoid clicks on labels or tokens
            var clickTarget = SVG.get(event.target.id).parent().first();

            if (_connectClicksCount === 0) { // Click on source element
                // Only circles and rects can be connected
                if (clickTarget.node.tagName === 'circle' || clickTarget.node.tagName === 'rect') {
                    _sourceElement = clickTarget;
                    _connectClicksCount++;
                    _firstClickCallback();
                }
            } else { // Click on target element
                // Same type elements cannot be connected
                if (clickTarget.node.tagName === _sourceElement.node.tagName) {
                    _wrongClickCallback();
                }
                else {
                    _targetElement = clickTarget;
                    _newArc();

                    _secondClickCallback();
                    _nodes.off('click');
                    _nodes.off('touchend');
                }
            }
        }

        function _newArc() {
            var sourceType = _sourceElement.node.localName;
            var sourceId = _sourceElement.node.id;
            var targetType = _targetElement.node.localName;
            var targetId = _targetElement.node.id;

            if( petriLogicService.isValidArc(sourceType, targetType) ) {
                var newConn = arcFactory.newArc(_arcs, _sourceElement, _targetElement);

                petriLogicService.addArc(newConn.element.node.id, {
                    sourceId: sourceId,
                    targetId: targetId,
                    value: 1
                });
            }
        }

        function _resetService() {
            if ( angular.equals(_draw, {}) ) return;

            _centerView();
            _draw.zoom(1);
            _draw.clear();
            _nodes = {};
            _places = {};
            _transitions = {};
            _arcs = {};

            _resetTools();

            petriLogicService.reset();
        }

        function _resetTools() {
            _isRemoveOn = false;
            _connectClicksCount = 0;
            _sourceElement = {};
            _targetElement = {};
            _firstClickCallback = function() {};
            _secondClickCallback = function() {};
            _wrongClickCallback = function() {};

            _elements.off('click');
            _elements.off('touchend');
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

        function _checkGroups() {
            if ( angular.equals(_draw, {}) ) return;
            if ( angular.equals(_elements, {}) ) _elements = _draw.group();
            if ( angular.equals(_nodes, {}) ) _nodes = _elements.group();
            if ( angular.equals(_places, {}) ) _places = _nodes.group();
            if ( angular.equals(_transitions, {}) ) _transitions = _nodes.group();
            if ( angular.equals(_arcs, {}) ) _arcs = _elements.group();
        }
    }

    angular.module('petriNet.common').service('petriUiService', petriUiService);
})();
