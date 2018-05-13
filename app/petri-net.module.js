(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name petriNet
     * @description Primary module
     **/
    var dependencies = [
        'ui.router',
        'ngFileUpload',
        'petriNet.common'
    ];

    angular.module('petriNet', dependencies);
})();
