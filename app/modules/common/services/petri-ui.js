(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.service:petriUiService
     * @description
     * description...
     **/
    petriUiService.$inject = ['petriLogicService'];
    function petriUiService(petriLogicService) {
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

        // Config
        var _config = _defaultConfigValue();

        return service;

        ///// Functions /////
        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.service:petriUiService
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newDraw(element, width, height) {
            if ( angular.equals(_draw, {}) ) {
                _draw = SVG(element).size(width || '100%', height || '100%').panZoom(_config.zoom);
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

            var newPlaceElement = _places
                .group()
                .circle(_config.nodeSize.place.diameter)
                .attr(_config.nodeStyle.place)
                .draggy();
            _addDropShadow(newPlaceElement);

            petriLogicService.addPlace(newPlaceElement.node.id, {
                tokens: tokens || 0
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
                .rect(_config.nodeSize.transition.width, _config.nodeSize.transition.height)
                .attr(_config.nodeStyle.transition)
                .draggy();
            _addDropShadow(newTransitionElement);

            petriLogicService.addTransition(newTransitionElement.node.id, {});
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
                newConn.connector.attr(_config.nodeStyle.arc);

                petriLogicService.addArc(newConn.connector.node.id, {
                    sourceId: sourceId,
                    targetId: targetId,
                    value: 1
                });
            }

            _sourceElement = {};
            _targetElement = {};
        }

        function _defaultConfigValue() {
            return {
                zoom: {
                    zoomMin: .5,
                    zoomMax: 2
                },
                nodeStyle: {
                    place: {
                        fill: '#FFF',
                        stroke: '#9C9C9C',
                        'stroke-width': '0.5px'
                    },
                    transition: {
                        fill: '#000'
                    },
                    arc: {
                        'stroke-width': '2px'
                    }
                },
                nodeSize: {
                    place: {
                        diameter: 50
                    },
                    transition: {
                        width: 10,
                        height: 50
                    }
                }
            };
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

        function _addDropShadow(node) {
            node.filter(function(add) {
                var blur = add
                    .offset(1, 2)
                    .in(add.sourceAlpha)
                    .gaussianBlur(2);
                add.blend(add.source, blur);

                this.size('200%','200%').move('-50%', '-50%');
            });
        }
    }

    angular.module('petriNet.common').service('petriUiService', petriUiService);
})();
