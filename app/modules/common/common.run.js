(function() {
    'use strict';

    run.$inject = ['$transitions'];
    function run($transitions) {
        $transitions.onSuccess({ }, _onSuccess);
    }

    function _onSuccess(transition) {
        if (transition.from().name === '') {
            console.log("App load time: "+ ((new Date)-initTime)/1000 +"s");
        }
    }

    angular.module('petriNet.common').run(run);
})();
