(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:placesAssetsFactory
     * @description
     * Handles the visual assets of svg petri net's elements
     **/
    placesAssetsFactory.$inject = [];
    function placesAssetsFactory() {
        var factory = {
            getTokens: getTokens,
            setTokens: setTokens,
            addLabel: addLabel
        };
        return factory;

        ///// Functions /////

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.factory:placesAssetsFactory
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function setTokens(element, qty) {
            if (qty === 1) {
                _drawToken(place);
            } else if (qty < 5) {
                for (var i = qty; i > 0; i--) {
                    _drawToken(place);
                }
                var tokens = place.parent()
                    .children().filter(function(child, i) {
                        return i && child.type == 'circle';
                    });
                tokens.forEach(function(token, i) {
                    var position = _getTokenPosition(token, i, qty);
                    token
                        .cx(position.cx)
                        .cy(position.cy);
                });
            } else {
                _drawNumber(place, qty);
            }
        }

        function _drawToken(place) {
            place.parent()
                .circle(10)
                .fill('#000')
                .cx(place.cx())
                .cy(place.cy());
        }

        function _drawNumber(place, number) {
            place.parent()
                .text(number+"")
                .attr({
                    'font-weight': 600,
                    'font-size': 25,
                    'style': 'user-select:none;'
                })
                .cx(place.cx())
                .cy(place.cy());
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.factory:placesAssetsFactory
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function getTokens(place) {
            var tokens = place.parent()
                .children().filter(function(child, i) {
                    return i && child.type == 'circle';
                });
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.factory:placesAssetsFactory
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function addLabel(element, text) {
            var label = element.parent()
                .text(text)
                .attr({
                    'style': 'user-select:none;'
                })
                .cx(element.cx())
                .cy(element.cy() + element.height()/2 + 15);
        }
    }

    angular.module('petriNet.common').factory('placesAssetsFactory', placesAssetsFactory);
})();
