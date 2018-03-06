(function() {
    'use strict';

    /** TODO
     * @ngdoc service
     * @name petriNet.common.factory:config
     * @description
     * Main config object
     **/
    config.$inject = [];
    function config() {
        var factory = {
            get: get
        };

        var _config = {};

        _init();

        return factory;

        ///// Functions /////
        function _init() {
            _config = {
                zoom: {
                    zoomMin: 1,
                    zoomMax: 1
                },
                nodeSize: {
                    place: {
                        diameter: 50
                    },
                    transition: {
                        width: 10,
                        height: 50
                    }
                },
                nodeStyle: {
                    place: {
                        fill: '#FFF',
                        stroke: '#9C9C9C',
                        'stroke-width': '0.5px',
                        shadow: true
                    },
                    transition: {
                        fill: '#000',
                        shadow: true
                    },
                    arc: {
                        'stroke-width': '3px'
                    }
                }
            };
        }
        /**
         * @ngdoc method
         * @name get
         * @methodOf petriNet.common.factory:config
         * @returns {Object} Config object
         * @description
         * Returns the config object.
         **/
        function get() {
            return _config;
        }
    }

    angular.module('petriNet.common').factory('configFactory', config);
})();
