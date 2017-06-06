/**
 * Created by jkearney on 6/2/2017.
 *
 * Includes all the service methods for the app.
 */
angular.module("myApp")
    .service('ajaxService', function ($http, $state) {
        this.checkLoggedIn = function (isHome, $scope) {
            $http({
                method : "GET",
                url : "checkLoggedIn"
            }).then(function mySuccess(response) {
                if (response.data) {
                    if (response.data.username) {
                        if (!isHome)
                            $state.go('home');
                        $scope.username = response.data.username;
                        $scope.getData();

                    } else {
                        if (isHome)
                            $state.go('signIn');
                    }
                } else {
                    console.log("ERROR: no data found on response");
                    $state.go('signIn');
                }
            });
        };
        this.tryRegister = function ($scope, current) {
            var JSONObject = {username:current.username,password:current.password_1};
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
        this.trySignIn = function ($scope, current) {
            var JSONObject = {username:current.username,password:current.password_1};
            console.log('ok');
            $http({
                method: "POST",
                url: "tryLogIn",
                dataType: 'JSON',
                data: JSON.stringify(JSONObject)
            }).then(function mySuccess(response) {
                if (response.data.status === "success") {
                    $scope.error_message = "";
                    $scope.getData();
                    $state.go('home');
                } else {
                    $scope.error_message = response.data.status
                }

            });
        };
        this.logout = function ($scope) {
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
        this.getData = function ($scope) {
            $http({
                method : "POST",
                url : "getData",
                dataType:'JSON'
            }).then(function mySuccess(response) {
                $scope.username = response.data.username;
                if (response.data.username === null)
                    $state.go('signIn');
                else {
                    $scope.passList = response.data.passList;
                    var param = $scope.sortedBy;
                    $scope.sortedBy = "";
                    $scope.sortBy(param);
                }
            });
        };
        this.saveEdits = function ($scope) {
            $scope.checkUrl(function() {
                if ($scope.error_message !== "")
                    return;
                var JSONObject = {
                    accountName: $scope.edit.name,
                    password: $scope.edit.pass,
                    url: $scope.edit.url? $scope.edit.url : "",
                    urlAlias: $scope.edit.url?$scope.edit.urlAlias:"",
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
                        $scope.edit.urlAlias = "";
                        $scope.cancel();
                    } else {
                        $scope.error_message = response.data.status;
                    }
                    $scope.getData();
                });
            });
        };
        this.remove = function ($scope, current) {
            var JSONObject = {id:current.entry.id};
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
        this.saveNew = function ($scope) {
            $scope.checkUrl(function () {
                if ($scope.error_message !== "")
                    return;

                var JSONObject = {
                    accountName: $scope.new.name,
                    password: $scope.new.pass,
                    url: $scope.new.url,
                    urlAlias:$scope.new.urlAlias
                };
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
                        $scope.new.urlAlias = "";
                        $scope.cancel();
                    } else {
                        $scope.error_message = response.data.status;
                    }
                    $scope.getData();
                });
            });
        };
        this.checkUrl = function ($scope, callback) {
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
        this.editUsername = function ($scope) {
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
        this.editPassword = function ($scope) {
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
    })


    .service('commonService', function ($state) {
        this.editEntry = function ($scope, value) {
            $scope.error_message = "";
            $scope.urlField = {'background-color':''};
            $scope.showEditForm = true;
            $scope.showAddForm = false;
            $scope.edit = {name: value.accountName, pass:value.password,
                url: value.url?value.url:"", urlAlias: value.urlAlias?value.urlAlias:""};
            $scope.editId = value.id;
        };
        this.addEntry = function ($scope) {
            $scope.error_message = "";
            $scope.urlField = {'background-color':''};
            $scope.showAddForm = true;
            $scope.showEditForm = false;
            $scope.new = {name:"", pass:"", url: "", urlAlias: ""};
        };
        this.cancel = function ($scope) {
            $scope.error_message = "";
            $scope.showEditForm = false;
            $scope.showAddForm = false;
            $scope.error_message = "";
            $scope.urlField = {'background-color':''};
        };
        this.sortBy = function ($scope, param) {
            if ($scope.sortedBy == param) {
                $scope.passList.sort(function (a, b) {
                    return (b[param]?b[param]:"").localeCompare((a[param]?a[param]:""));
                });
                $scope.sortedBy = "";
            } else {
                $scope.passList.sort(function (a, b) {
                    return (a[param]?a[param]:"").localeCompare((b[param]?b[param]:""));
                });
                $scope.sortedBy = param;
            }
        };
        this.popup = function ($scope, current, modalService, $window) {
            var url = current.url;
            var urlAlias = current.urlAlias?current.urlAlias:url;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Go to ' + urlAlias,
                headerText: 'Leave this site?',
                bodyText: 'Are you sure you want to go to [' + url + '] ?'
            };

            modalService.showModal({}, modalOptions)
                .then(function () {
                    $window.open(url, '_self');
                });
        };
        this.back = function () {
            $state.go('home');
        };
        this.profile = function () {
            $state.go('profile');
        };
        this.resetUsername = function (child, $scope) {
            child.username = $scope.username
        };
        this.clearPassword = function (child, $scope) {
            child.$parent.newPassword;
        };
    })


    .service('modalService',['$uibModal',
        function ($uibModal) {

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '../templates/popup.html'
            };

            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };

            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $uibModalInstance.close(result);
                        };
                        $scope.modalOptions.close = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    };
                }
                return $uibModal.open(tempModalDefaults).result;
            };
        }]);



