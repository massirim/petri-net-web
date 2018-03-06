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
            var width = configFactory.get().nodeSize.transition.width;
            var height = configFactory.get().nodeSize.transition.height;
            var style = configFactory.get().nodeStyle.transition;
            var hasShadow = configFactory.get().nodeStyle.transition.shadow;

            var transitionElement = container
                .group()
                .draggy()
                .rect(width, height)
                .move(x, y)
                .attr(style);

            svgAssetsFactory.addLabel(transitionElement, label);
            if (hasShadow)
                svgAssetsFactory.addDropShadow(transitionElement);

            return transitionElement;
        }
    }

    angular.module('petriNet.common').factory('transitionFactory', transition);
})();
