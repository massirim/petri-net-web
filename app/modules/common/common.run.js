(function() {
    'use strict';

    run.$inject = [];
    function run() {
        console.log((new Date) - a + "ms");
    }

    angular.module('petriNet.common').run(run);
})();
