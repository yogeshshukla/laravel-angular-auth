(function () {
    'use strict';
	angular
        .module('app')
        .controller('Register.IndexController', Controller);

    function Controller($location, AuthenticationService) {
        var vm = this;

        vm.register = register;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        };

        function register() {
            vm.loading = true;
            console.log(vm.username+vm.password+vm.password_confirmation);
            AuthenticationService.Register(vm.name, vm.username, vm.password, vm.password_confirmation, function (result) {
                if (result === true) {
                	console.log('result is true');
                	AuthenticationService.Login(vm.username, vm.password, function (result){
						if (result === true) {
							$location.path('/');
						}else {
							vm.error = 'Username or password is incorrect';
                    		vm.loading = false;
						}
					});
                    
                } else {
                    vm.error = 'Username or password is incorrect';
                    vm.loading = false;
                }
            });
        };
    }

})();