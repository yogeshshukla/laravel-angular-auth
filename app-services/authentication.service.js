(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', Service)
        
        .constant('config', {  
			apiUrl: 'http://localhost/laravel-passport/public',
			baseUrl: '/',
			enableDebug: true
		})
		.factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
		return {
			response: function(response){
				if (response.status === 401) {
					console.log("Response 401");
				}
				return response || $q.when(response);
			},
			responseError: function(rejection) {
				if (rejection.status === 401) {
					//console.log("Response Error 401",rejection);
					//$location.path('/login').search('returnTo', $location.path());
				}
				return $q.reject(rejection);
			}
		}
	}])
	.config(['$httpProvider',function($httpProvider) {
		//Http Intercpetor to check auth failures for xhr requests
		$httpProvider.interceptors.push('authHttpResponseInterceptor');
	}]);

    function Service($http, $localStorage, config) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.Register = Register;
		service.getProfile = getProfile;
        return service;
		var data = {
			grant_type : 'password',
			client_id : 1,
			client_secret : 'AcEhDMnFSPawawnQ3c5cMPkcvs7FSLdtzi1Tqzqk',
			username : username,
			password : password,
			scope : '*',
		}
        function Login(username, password, callback) {
        	var data = {
				grant_type : 'password',
				client_id : 1,
				client_secret : 'AcEhDMnFSPawawnQ3c5cMPkcvs7FSLdtzi1Tqzqk',
				username : username,
				password : password,
				scope : '*',
			}
            $http.post(config.apiUrl+'/oauth/token', data)
                .success(function (response, status) {
                	console.log(response);
                    // login successful if there's a token in the response
                    if (response.access_token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        $localStorage.currentUser = { username: username, token: response.access_token };

                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.access_token;

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                    	console.log('else');
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                }).error(function () {
            		callback(false);
        		});
                
        }
        function Register(name, username, password, password_confirmation, callback) {
            $http.post(config.apiUrl+'/api/register', { name: name, email: username, password: password, password_confirmation: password_confirmation})
                .success(function (response, status) {
                	// login successful if there's a token in the response
                    if (status==200) {
                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                });
        }
		function getProfile( ){
			return $http.get(config.apiUrl+'/api/user')
                .success(function (response, status, callback) {
                	
                	// login successful if there's a token in the response
                    if (status==200) {
                    	//console.log(response.email);
                        // execute callback with true to indicate successful login
                         return response;
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                });
			console.log(ret_response) ;
		}
        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
        }
    }
})();