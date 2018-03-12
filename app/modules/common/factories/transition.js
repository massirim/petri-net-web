(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:transition
     * @description
     * description...
     **/
    transition.$inject = ['configFactory', 'svgAssetsFactory'];
    function transition(configFactory, svgAssetsFactory) {
        var factory = {
            newTransition: newTransition
        };
        return factory;

        ///// Functions /////
        /** TODO
         * @ngdoc method
         * @name newTransition
         * @methodOf petriNet.common.factory:transition
         * @param {type} param description...
         * @returns {type} description...
         * @description
         * description...
         **/
        function newTransition(container, x, y, label) {
            var transition = _drawTransition();

            _init();

            return transition;

            ///// Functions /////
            function _init() {
                svgAssetsFactory.addLabel(transition, label);
                var hasShadow = configFactory.get().nodeStyle.transition.shadow;
                if (hasShadow)
                    svgAssetsFactory.addDropShadow(transition);
            }

            /**
             * Draw an transition element in the SVG and returns it
             **/
            function _drawTransition() {
                var width = configFactory.get().nodeSize.transition.width;
                var height = configFactory.get().nodeSize.transition.height;
                var style = configFactory.get().nodeStyle.transition;

                var transitionElement = container
                    .group()
                    .draggy()
                    .rect(width, height)
                    .move(x, y)
                    .attr(style)
                    .addClass('transition');

                return transitionElement;
            }
        }
    }

    angular.module('petriNet.common').factory('transitionFactory', transition);
})();
