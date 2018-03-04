(function() {
    'use strict';

    svgService.$inject = [];
    function svgService() {
        var service = {
            newDraw: newDraw,
            newPlace: newPlace,
            newTransition: newTransition,
            newArc: newArc,
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
        var _connectSourceElement = {};
        var _connectTargetElement = {};
        var _arcsList = [];

        // Config
        var _config = {
            zoom: {
                zoomMin: .5,
                zoomMax: 2
            },
            nodeStyle: {
                fill: '#FFF',
                stroke: '#9C9C9C',
                'stroke-width': '0.5px'
            }
        };

        return service;

        ///// Functions /////
        function newDraw(element, width, height) {
            if ( angular.equals(_draw, {}) ) {
                _draw = SVG(element).size(width || '100%', height || '100%').panZoom(_config.zoom);
                _checkGroups();
            }
            else
                _clear();
        }

        function newPlace(diameter, x, y) {
            _checkGroups();

            var newPlaceElement = _places
                .group()
                .attr(_config.nodeStyle)
                .circle(diameter)
                .move(x || 0, y || 0)
                .draggy();
            _addDropShadow(newPlaceElement);
            return newPlaceElement.node.id;
        }

        function newTransition(width, height, x, y) {
            _checkGroups();

            var newTransitionElement = _transitions
                .group().rect(width, height)
                .attr(_config.nodeStyle)
                .move(x || 0, y || 0)
                .draggy();
            _addDropShadow(newTransitionElement);
            return newTransitionElement.node.id;
        }

        function newArc(source, target) {
            var newConn = _connectSourceElement.connectable({
                sourceAttach: 'perifery',
                targetAttach: 'perifery',
                type: 'default',
                container: _arcs,
                markers: _markers,
            }, _connectTargetElement);

            newConn.setMarker('default', _markers);
            newConn.connector.attr({'stroke-width': '1px'});

            _arcsList.push({
                sourceId: _connectSourceElement.node.id,
                targetId: _connectTargetElement.node.id,
                connector: newConn
            });
        }

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

        function activateConnect() {
            _nodes.click(_connectHandler);
            _nodes.touchend(_connectHandler);
        }

        function _clear() {
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
            _connectSourceElement = {};
            _connectTargetElement = {};
            _arcsList = [];
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

        function _removeHandler(event) {
            var elementId = event.target.id;
            var element = SVG.get(elementId);
            element.remove();

            var keysToRemove = [];
            var arcsToRemove = _arcsList.filter(function (arc, key) {
                var bool = arc.sourceId === elementId || arc.targetId === elementId;
                if (bool) {
                    keysToRemove.push(key);
                }
                return bool;
            });

            angular.forEach(arcsToRemove, function (arc, key) {
                var arcElem = SVG.get(arc.connector.connector.node.id);
                arcElem.remove();

                _arcsList.splice(keysToRemove[key] - key, 1);
            });


        }

        function _connectHandler(event) {
            if (_connectClicksCount === 0) {
                _connectSourceElement = SVG.get(event.target.id);
                _connectClicksCount++;
            } else {
                _connectTargetElement = SVG.get(event.target.id);
                if ( _connectSourceElement.node.id !== _connectTargetElement.node.id)
                    newArc(_connectSourceElement, _connectTargetElement);
                _connectSourceElement = {};
                _connectTargetElement = {};
                _connectClicksCount = 0;
                _nodes.off('click');
                _nodes.off('touchend');
            }
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

    angular.module('petriNet.common').service('svgService', svgService);
})();
