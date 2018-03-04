(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name petriNet
     * @description Primary module
     **/
    var dependencies = [
        'ui.router',
        'petriNet.common'
    ];

    angular.module('petriNet', dependencies);
})();
