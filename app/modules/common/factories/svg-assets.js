(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:svgAssetsFactory
     * @description
     * Handles the visual assets of svg petri net's elements
     **/
    svgAssetsFactory.$inject = [];
    function svgAssetsFactory() {
        var factory = {
            addLabel: addLabel,
            addDropShadow: addDropShadow
        };
        return factory;

        ///// Functions /////
        /**
         * @ngdoc method
         * @name addLabel
         * @methodOf petriNet.common.factory:svgAssetsFactory
         * @param {SVG.Element} element Element to put a label on
         * @param {String} text Label text
         * @description
         * Adds a text label bellow the element.
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

        /**
         * @ngdoc method
         * @name methodName
         * @methodOf petriNet.common.factory:svgAssetsFactory
         * @param {SVG.Element} element Element to style with a drop-shadow
         * @description
         * Adds a shadow style behind the element.
         **/
        function addDropShadow(element) {
            element.filter(function(add) {
                var blur = add
                    .offset(1, 2)
                    .in(add.sourceAlpha)
                    .gaussianBlur(2);
                add.blend(add.source, blur);

                this.size('200%','200%').move('-50%', '-50%');
            });
        }
    }

    angular.module('petriNet.common').factory('svgAssetsFactory', svgAssetsFactory);
})();
