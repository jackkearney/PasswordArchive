
var app = angular.module("myApp",['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    var registerState = {
        name: 'reg',
        url: '/reg',
        templateUrl:'../templates/register.html',
        controller: 'checkLoggedInOuter'
    };
    var signInState = {
        name: 'signIn',
        url: '/',
        templateUrl:'../templates/loggin.html',
        controller: 'checkLoggedInOuter'
    };
    var loggedInState = {
        name: 'home',
        url: '/home',
        templateUrl: '../templates/home.html',
        controller: 'checkLoggedInInner'
    };
    $stateProvider.state(loggedInState);
    $stateProvider.state(registerState);
    $stateProvider.state(signInState);
});

app.controller("checkLoggedInInner", function($scope, $state) {
    $scope.checkLoggedIn(true);
});
app.controller("checkLoggedInOuter", function($scope, $state) {
    $scope.checkLoggedIn(false);
});

//-- ***** Controller ***** --//
app.controller("myCtrl",  function ($scope, $interval, $http, $state) {
    $scope.checkLoggedIn = function (isHome) {
        $http({
            method : "GET",
            url : "checkLoggedIn"
        }).then(function mySuccess(response) {
            if (response.data) {
                if (response.data.username === null) {
                    if (isHome) {
                        $state.go('signIn');
                    }
                } else {
                    if (!isHome) {
                        $scope.username = response.data.username;
                        $scope.getData();
                        $state.go('home');
                    }
                }
            } else {
                console.log("ERROR: no data found on response");
            }
        });
    };

    $scope.tryRegister = function () {
        var JSONObject = {username:this.username,password:this.password_1};
        var str = JSON.stringify(JSONObject);
        $http({
            method : "POST",
            url : "tryRegister",
            dataType:'JSON',
            data:str
        }).then(function mySuccess(response) {
            if (response.data.status === "success") {
                $scope.error_message = "";
                $scope.addEntry();
                $scope.getData();
                $state.go('home');
            } else {
                $scope.error_message = response.data.status
            }
        });
    };
    $scope.trySignIn = function () {
        var JSONObject = {username:this.username,password:this.password_1};
        console.log('ok');
        $http({
            method: "POST",
            url: "tryLogIn",
            dataType: 'JSON',
            data: JSON.stringify(JSONObject)
        }).then(function mySuccess(response) {
            console.log('ajax trySignIn returned');
            console.log(response);
            if (response.data.status === "success") {
                $scope.error_message = "";
                $scope.getData();
                $state.go('home');
            } else {
                $scope.error_message = response.data.status
            }

        });
    };
    $scope.logout = function () {
        $http({
            method : "POST",
            url : "logout",
            dataType:'JSON'
        }).then(function mySuccess() {
            console.log('you have been logged out');
            $scope.error_message = "";
            $scope.username = "";
            $scope.password_1 = "";
            $scope.password_2 = "";
            $scope.passList = [];
            $scope.edit = null;
            $scope.new = null;
            $state.go('signIn');
        });
    };
    $scope.getData = function () {
        $http({
            method : "POST",
            url : "getData",
            dataType:'JSON'
        }).then(function mySuccess(response) {
            $scope.username = response.data.username;
            if (response.data.username === null)
                $state.go('signIn');
            else
                $scope.passList = response.data.passList;
        });
    };
    $scope.editEntry = function (value) {
        $scope.error_message = "";
        $scope.urlField = {'background-color':''};
        $scope.showEditForm = true;
        $scope.showAddForm = false;
        $scope.edit = {name: value.accountName, pass:value.password, url: value.url?value.url:""};
        $scope.editId = value.id;
    };
    $scope.addEntry = function () {
        $scope.error_message = "";
        $scope.urlField = {'background-color':''};
        $scope.showAddForm = true;
        $scope.showEditForm = false;
        $scope.new = {name:"", pass:"", url: ""};
    };
    $scope.cancel = function () {
        $scope.error_message = "";
        $scope.showEditForm = false;
        $scope.showAddForm = false;
        $scope.error_message = "";
        $scope.urlField = {'background-color':''};
    };
    $scope.saveEdits = function () {
        $scope.checkUrl(function() {
            if ($scope.error_message !== "")
                return;
            var JSONObject = {
                accountName: $scope.edit.name,
                password: $scope.edit.pass,
                url: $scope.edit.url? $scope.edit.url : "",
                id: $scope.editId ? $scope.editId : -1
            };
            $http({
                method: "POST",
                url: "editPassword",
                dataType: 'JSON',
                data: JSON.stringify(JSONObject)
            }).then(function mySuccess(response) {
                console.log(response.data.status);
                if (response.data.status === "success") {
                    $scope.edit.name = "";
                    $scope.edit.pass = "";
                    $scope.edit.url = "";
                    $scope.cancel();
                } else {
                    $scope.error_message = response.data.status;
                }
                $scope.getData();
            });
        });
    };
    $scope.saveNew = function () {
        $scope.checkUrl(function() {
            if ($scope.error_message !== "")
                return;

            var JSONObject = {accountName:$scope.new.name, password: $scope.new.pass, url: $scope.new.url};
            $http({
                method: "POST",
                url: "addPassword",
                dataType: 'JSON',
                data: JSON.stringify(JSONObject)
            }).then(function mySuccess(response) {
                if (response.data.status === "success") {
                    $scope.new.pass = "";
                    $scope.new.name = "";
                    $scope.new.url = "";
                    $scope.cancel();
                } else {
                    $scope.error_message = response.data.status;
                }
                $scope.getData();
            });
        });
    };
    $scope.remove = function () {
        var JSONObject = {id:this.entry.id};
        $http({
            method : "POST",
            url : "removePassword",
            dataType:'JSON',
            data:JSON.stringify(JSONObject)
        }).then(function mySuccess(response) {
            if (response.data.status === "success") {
                $scope.error_message = "";
            } else {
                $scope.editError = response.data.status;
            }
            $scope.getData();
        });
    };
    $scope.checkUrl = function (callback) {
        var url = $scope.showAddForm?$scope.new.url:$scope.edit.url;
        if (url === null || url === "") {
            $scope.urlField = {'background-color':''};
            $scope.error_message = "";
            if (callback)
                callback();
            return;
        }
        var JSONObject = {url:url};
        $http({
            method : "POST",
            url : "checkValidUrl",
            dataType:'JSON',
            data:JSON.stringify(JSONObject)
        }).then(function mySuccess(response) {
            if (response.data.status === "success") {
                $scope.urlField = {'background-color':'#bcffcc'};
                $scope.error_message = "";
                if (callback)
                    callback();
            } else {
                $scope.urlField = {'background-color':'#ffbcbc'};
                $scope.error_message = "Please enter a valid url";
                if (callback)
                    callback();
            }
        });
    };
});