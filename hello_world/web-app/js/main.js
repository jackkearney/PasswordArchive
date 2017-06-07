
angular.module("myApp",['ui.router', "ui.bootstrap"])
    .config(function($stateProvider, $urlRouterProvider) {
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
        var profile = {
            name: 'profile',
            url: '/profile',
            templateUrl: '../templates/profile.html',
            controller: 'checkLoggedInInner'
        };
        $stateProvider.state(profile);
        $stateProvider.state(loggedInState);
        $stateProvider.state(registerState);
        $stateProvider.state(signInState);
    })
    .controller("checkLoggedInInner", function($scope, ajaxService) {
        ajaxService.checkLoggedIn(true, $scope);
    })
    .controller("checkLoggedInOuter", function($scope, ajaxService) {
        ajaxService.checkLoggedIn(false, $scope);
    })
    .controller("myCtrl",  function ($scope, $interval, $http, $state, $window,
                                     ajaxService, commonService, modalService) {
        $scope.tryRegister = function () {
            ajaxService.tryRegister($scope, this);
        };
        $scope.trySignIn = function () {
            ajaxService.trySignIn($scope, this);
        };
        $scope.logout = function () {
            ajaxService.logout($scope);
        };
        $scope.getData = function () {
            ajaxService.getData($scope);
        };
        $scope.editEntry = function (value) {
            commonService.editEntry($scope, value);
        };
        $scope.addEntry = function () {
            commonService.addEntry($scope);
        };
        $scope.cancel = function () {
            commonService.cancel($scope);
        };
        $scope.saveEdits = function () {
            ajaxService.saveEdits($scope);
        };
        $scope.saveNew = function () {
            ajaxService.saveNew($scope);
        };
        $scope.remove = function () {
            ajaxService.remove($scope, this);
        };
        $scope.checkUrl = function (callback) {
            ajaxService.checkUrl($scope, callback);
        };
        $scope.sortBy = function (param) {
            commonService.sortBy($scope, param);
        };
        $scope.showPop = function () {
            commonService.popup($scope, this.entry, modalService, $window);
        };
        $scope.back = function () {
            commonService.back();
        };
        $scope.toProfile = function () {
            commonService.profile();
        };
        $scope.saveNewUsername =function () {
            ajaxService.saveNewUsername($scope);
        };
        $scope.saveNewPassword =function () {
            ajaxService.saveNewPassword($scope);
        };
        $scope.resetNewUsername = function () {
            commonService.resetUsername(this, $scope);
        };
        $scope.clearNewPassword = function () {
            commonService.clearPassword(this, $scope);
        };
        $scope.dismissMsg = function () {
            commonService.dismissMsg($scope);
        };

    });