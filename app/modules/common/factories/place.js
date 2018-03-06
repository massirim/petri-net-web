(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:places
     * @description
     * description...
     **/
    places.$inject = ['configFactory', 'svgAssetsFactory'];
    function places(configFactory, svgAssetsFactory) {
        var factory = {
            newPlace: newPlace,
            setTokens: setTokens
        };

        return factory;

        ///// Functions /////
        /** TODO
         * @ngdoc method
         * @name newPlace
         * @methodOf petriNet.common.factory:places
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newPlace(container, x, y, label, tokens) {
            var diameter = configFactory.get().nodeSize.place.diameter;
            var style = configFactory.get().nodeStyle.place;
            var hasShadow = configFactory.get().nodeStyle.place.shadow;

            var placeElement = container
                .group()
                .draggy()
                .circle(diameter)
                .move(x, y)
                .attr(style);

            setTokens(placeElement, tokens);
            svgAssetsFactory.addLabel(placeElement, label);
            if (hasShadow)
                svgAssetsFactory.addDropShadow(placeElement);

            return placeElement;
        }

        /** TODO
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.factory:svgAssetsFactory
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * Set the visual of the place to the specified number of tokens
         **/
        function setTokens(place, qty) {
            var tokensCount = _countTokens(place);

            // Stops for invalid quantity values
            if(qty < 0 || tokensCount === qty || typeof qty !== 'number') return;

            // Less than 4 means dot tokens should be drawn
            // otherwise number tokens
            if ( qty <= 4 ) {
                if ( tokensCount > 4 ) {
                    // Remove text token inside
                    _getTokens(place).remove();
                } else if (tokensCount > qty) {
                    // Dot Tokens should be removed
                    // _drawDotTokens will only adust position
                    var tokensToRemoved = tokensCount - qty;
                    var tokensList = _getTokens(place);
                    while(tokensToRemoved-- > 0) {
                        tokensList[tokensToRemoved].remove();
                    }
                }
                // Draw dot token
                _drawDotTokens(place, qty);
            } else {
                if ( tokensCount > 0 && tokensCount <= 4 ) {
                    // Remove dot tokens inside
                    _getTokens(place)
                    .forEach(function (token) {
                    token.remove();
                    });
                } else if (tokensCount >= 5) {
                    // Remove text token inside
                    _getTokens(place).remove();
                }
                _drawNumberToken(place, qty);
            }
        }

        function _drawDotTokens(place, qty) {
            var tokensCount = _countTokens(place);

            // Draw more dots if needed
            for (var i = qty - tokensCount; i > 0; i--) {
                place.parent()
                    .circle(10)
                    .addClass('token-dot')
                    .fill('#000')
                    .cx(place.cx())
                    .cy(place.cy());
            }

            // Filter the tokens elements only
            var tokens = place.parent()
                .children().filter(function(child, i) {
                    return i && child.type == 'circle';
                });

            // Adjust token element position
            tokens.forEach(function(token, i) {
                var position = _getTokenPosition(token, place, i, qty);
                token
                    .animate(100)
                    .cx(position.cx)
                    .cy(position.cy);
            });
        }

        function _drawNumberToken(place, number) {
            place.parent()
                .text(number+"")
                .attr({
                    'font-weight': 600,
                    'font-size': 20
                })
                .style('user-select', 'none')
                .addClass('token-number')
                .cx(place.cx())
                .cy(place.cy());
        }

        function _countTokens(place) {
            var tokens = _getTokens(place);
            var tokensCount;
            if(tokens) {
                tokensCount = (tokens.length > 0)? tokens.length : 0
                return tokensCount || tokens.text() - 0;
            }
            else
                return 0;
        }

        function _getTokens(place) {
            var tokensDot = place.parent().select('.token-dot').members;
            var tokentext = place.parent().select('.token-number').members['0'];

            if (tokensDot.length > 0) {
                return tokensDot;
            } else {
                return tokentext;
            }
        }

        function _getTokenPosition(token, place, index, total) {
            var position;
            var margin = 2;

            switch (total) {
                case 1:
                    position =  {
                        cx: place.cx(),
                        cy: place.cy()
                    };
                    break;
                case 2:
                    if (index == 0) {
                        position =  {
                            cx: place.cx() - (token.width()/2+margin),
                            cy: place.cy()
                        };
                    } else if (index == 1) {
                        position =  {
                            cx: place.cx() + (token.width()/2+margin),
                            cy: place.cy()
                        };
                    }
                    break;
                case 3:
                    if (index == 0) {
                        position =  {
                            cx: place.cx(),
                            cy: place.cy() - (token.height()/2+margin)
                        };
                    } else if (index == 1) {
                        position =  {
                            cx: place.cx() - (token.width()/2+margin),
                            cy: place.cy() + (token.height()/2+margin)
                        };
                    } else if (index == 2) {
                        position =  {
                            cx: place.cx() + (token.width()/2+margin),
                            cy: place.cy() + (token.height()/2+margin)
                        };
                    }
                    break;
                case 4:
                    if (index == 0) {
                        position =  {
                            cx: place.cx() - (token.width()/2+margin),
                            cy: place.cy() - (token.height()/2+margin)
                        };
                    } else if (index == 1) {
                        position =  {
                            cx: place.cx() + (token.width()/2+margin),
                            cy: place.cy() - (token.height()/2+margin)
                        };
                    } else if (index == 2) {
                        position =  {
                            cx: place.cx() - (token.width()/2+margin),
                            cy: place.cy() + (token.height()/2+margin)
                        };
                    } else if (index == 3) {
                        position =  {
                            cx: place.cx() + (token.width()/2+margin),
                            cy: place.cy() + (token.height()/2+margin)
                        };
                    }
                    break;
            }

            return position;
        }
    }

    angular.module('petriNet.common').factory('placeFactory', places);
})();
