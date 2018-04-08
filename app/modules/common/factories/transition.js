(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:transition
     * @description
     * description...
     **/
    transition.$inject = ['$q', 'configFactory', 'svgAssetsFactory'];
    function transition($q, configFactory, svgAssetsFactory) {
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

            // Properties
            transition.petriType = 'transition'
            transition.inputs = [];
            transition.outputs = [];
            // Methods
            transition.tokenAnimation = tokenAnimation;

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

            /**
             * Triggers the animations of input arcs and then output ones
             **/
            function tokenAnimation() {
                var deferred = $q.defer();

                _animateArcs(transition.inputs)
                    .then(function() {
                        _animateArcs(transition.outputs)
                        .then(function() {
                            deferred.resolve();
                        });
                    });

                return deferred.promise;
            }

            function _animateArcs(arcs) {
                var deferred = $q.defer();

                angular.forEach(arcs, function (arc, index) {
                    arc.tokenAnimation()
                        .then(function () {
                            if (index === arcs.length - 1)
                                deferred.resolve();
                        });
                });

                return deferred.promise;
            }
        }
    }

    angular.module('petriNet.common').factory('transitionFactory', transition);
})();
