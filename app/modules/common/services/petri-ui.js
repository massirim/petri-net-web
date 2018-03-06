(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.service:petriUiService
     * @description
     * description...
     **/
    petriUiService.$inject = ['petriLogicService', 'configFactory', 'placeFactory', 'svgAssetsFactory'];
    function petriUiService(petriLogicService, configFactory, placeFactory, svgAssetsFactory) {
        var service = {
            newDraw: newDraw,
            newPlace: newPlace,
            newTransition: newTransition,
            toggleRemoveEvent: toggleRemoveEvent,
            activateConnect: activateConnect
        };

        // Groups
        var _draw = {};
        var _nodes = {};
        var _places = {};
        var _transitions = {};
        var _arcs = {};
        var _markers = {};

        // Aux
        var _isRemoveOn = false;
        var _connectClicksCount = 0;
        var _sourceElement = {};
        var _targetElement = {};

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
                _reset();
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
        function newPlace(tokens) {
            _checkGroups();
            tokens = tokens || 0;

            var center = _centerPosition();
            var newPlaceElement = placeFactory.newPlace(_places, center.x, center.y, tokens);
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
        function newTransition() {
            _checkGroups();

            var newTransitionElement = _transitions
                .group()
                .rect(configFactory.get().nodeSize.transition.width, configFactory.get().nodeSize.transition.height)
                .attr(configFactory.get().nodeStyle.transition)
                .draggy();
            svgAssetsFactory.addDropShadow(newTransitionElement);

            petriLogicService.addTransition(newTransitionElement.node.id, {});
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
        function toggleRemoveEvent() {
            if (_isRemoveOn) {
                _nodes.off('click');
                _nodes.off('touchend');
                _isRemoveOn = false;
            } else {
                _nodes.click(_removeHandler);
                _nodes.touchend(_removeHandler);
                _isRemoveOn = true;
            }
        }

        function _removeHandler(event) {
            var elementId = event.target.id;
            var elementType = event.target.localName;
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
        function activateConnect() {
            _nodes.click(_connectHandler);
            _nodes.touchend(_connectHandler);
        }

        function _connectHandler(event) {
            if (_connectClicksCount === 0) {
                _sourceElement = SVG.get(event.target.id);
                _connectClicksCount++;
            } else {
                _targetElement = SVG.get(event.target.id);
                _connect();
                _connectClicksCount = 0;
                _nodes.off('click');
                _nodes.off('touchend');
            }
        }

        function _connect() {
            var sourceType = _sourceElement.node.localName;
            var sourceId = _sourceElement.node.id;
            var targetType = _targetElement.node.localName;
            var targetId = _targetElement.node.id;

            if( petriLogicService.isValidArc(sourceType, targetType) ) {
                var newConn = _sourceElement.connectable({
                    sourceAttach: 'perifery',
                    targetAttach: 'perifery',
                    type: 'default',
                    container: _arcs,
                    markers: _markers,
                }, _targetElement);

                newConn.setMarker('default', _markers);
                newConn.connector.attr(configFactory.get().nodeStyle.arc);

                petriLogicService.addArc(newConn.connector.node.id, {
                    sourceId: sourceId,
                    targetId: targetId,
                    value: 1
                });
            }

            _sourceElement = {};
            _targetElement = {};
        }

        function _reset() {
            if ( angular.equals(_draw, {}) ) return;

            _centerView();
            _draw.zoom(1);
            _draw.clear();
            _nodes = {};
            _places = {};
            _transitions = {};
            _arcs = {};
            _markers = {};

            _isRemoveOn = false;
            _connectClicksCount = 0;
            _sourceElement = {};
            _targetElement = {};

            petriLogicService.reset();
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
            if ( angular.equals(_nodes, {}) ) _nodes = _draw.group();
            if ( angular.equals(_places, {}) ) _places = _nodes.group();
            if ( angular.equals(_transitions, {}) ) _transitions = _nodes.group();
            if ( angular.equals(_arcs, {}) ) _arcs = _draw.group();
            if ( angular.equals(_markers, {}) ) _markers = _draw.group();
        }
    }

    angular.module('petriNet.common').service('petriUiService', petriUiService);
})();
