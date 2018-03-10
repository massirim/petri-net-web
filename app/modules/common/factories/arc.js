(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:arcFactory
     * @description
     * description...
     **/
    arcFactory.$inject = ['configFactory'];
    function arcFactory(configFactory) {
        var factory = {
            newArc: newArc
        };
        return factory;

        ///// Functions /////
        /**
         * @ngdoc method
         * @name newArc
         * @methodOf petriNet.common.factory:arcFactory
         * @param {SVG.Element} source element to be used as arc source
         * @param {SVG.Element} target element to be used as arc target
         * @returns {Object} Arc object w/ the source, target an path element
         * @description
         * Creates an arrow between two elements.
         **/
        function newArc(container, source, target, value) {
            /// Disclaimer ///
            // The arc creation had to be encapsulated like a class to avoid
            // unnecessary complexity
            var arc = {};

            // Properties
            arc.source = source;
            arc.target = target;
            arc.element = null;
            arc.valueBox = null;
            arc.value = null;

            _init();

            return arc;

            /////

            function _init() {
                _drawArc();

                source.parent().on('dragmove', _drawArc);
                target.parent().on('dragmove', _drawArc);
            }

            function _drawArc() {
                var coordinates = _getCoordinates();

                var linePath = ["M", coordinates.x1, coordinates.y1, "L", coordinates.x2, coordinates.y2].join(' ');

                // Create the arc element or update it
                if(!arc.element){
                    arc.element = container
                        .group()
                        .path(linePath)
                        .stroke('#000')
                        .attr(configFactory.get().nodeStyle.arc)
                        .addClass('arc');
                    arc.element.marker('end', 10, 6, function (add) {
                        add.path("M 0 0 L 6 3 L 0 6 z");
                    });

                    if (value > 1) _createValueBox();
                } else {
                    arc.element.plot(linePath);
                    if (arc.valueBox) _updateValueBoxPosition();
                }
            }

            function _getCoordinates() {
                var sourceParent = arc.source.parent();
                var targetParent = arc.target.parent();

                var coordinates = {
                    x1: sourceParent.cx(),
                    y1: sourceParent.cy() - (sourceParent.rbox().height / 2) + (source.rbox().height / 2),
                    x2: targetParent.cx(),
                    y2: targetParent.cy() - (targetParent.rbox().height / 2) + (target.rbox().height / 2)
                };
                var tempPath = ["M", coordinates.x1, coordinates.y1, "L", coordinates.x2, coordinates.y2].join(' ');
                tempPath = container.path(tempPath);
                var pointStart =  tempPath.pointAt((source.rbox().height / 2));
                var pointEnd =  tempPath.pointAt(tempPath.length() - (source.rbox().height / 1.7));
                tempPath.remove();
                coordinates.x1 = pointStart.x;
                coordinates.y1 = pointStart.y;
                coordinates.x2 = pointEnd.x;
                coordinates.y2 = pointEnd.y;

                return coordinates;
            }

            function _createValueBox() {
                var assetsContainer = container.group();
                arc.valueBox = assetsContainer
                    .rect(20,20)
                    .stroke('#000')
                    .fill('#fff');
                arc.value = assetsContainer
                    .text(value+"")
                    .attr({'style': 'user-select:none;'});
                _updateValueBoxPosition();
            }

            function _updateValueBoxPosition() {
                var arcCenter = arc.element.pointAt(arc.element.length()/2);
                arc.valueBox.cx(arcCenter.x).cy(arcCenter.y);
                arc.value.cx(arcCenter.x).cy(arcCenter.y)
            }
        }
    }

    angular.module('petriNet.common').factory('arcFactory', arcFactory);
})();
