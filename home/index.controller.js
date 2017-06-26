(function () {
	//console.log('index');
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller( AuthenticationService ) {
        var vm = this;

        initController();

        function initController() {
        	AuthenticationService.getProfile()
        		.then(function (response) {
        			vm.username = response.data.name;
        			vm.email = response.data.email;
        			vm.created_at = response.data.created_at;
           	});
        	
        }
        
    }

})();