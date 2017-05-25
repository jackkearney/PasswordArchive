
var app = angular.module("myApp",['ui.router']);

app.controller("myCtrl", function ($scope, $interval, $http, $state) {
    $scope.tryRegister = function () {
        var JSONObject = {username:this.username,password:this.password_1};
        var str = JSON.stringify(JSONObject);
        console.log(str);
        console.log(this.username);
        console.log(this);
        $http({
            method : "POST",
            url : "tryRegister",
            dataType:'JSON',
            data:str
        }).then(function mySuccess(response) {
            if (response.data) {
                if (response.data.status === "success") {
                    //noinspection JSCheckFunctionSignatures
                    $state.go('home');
                } else {
                    $scope.error_message = response.data.status
                }
            } else {
                console.log("ERROR: no data found on response");
            }
        }, function myError(response) {
            console.log(response);
        });
    };
    $scope.trySignIn = function () {
        var JSONObject = {username:this.username,password:this.password_1};
        $http({
            method : "POST",
            url : "tryLogIn",
            dataType:'JSON',
            data:JSON.stringify(JSONObject)
        }).then(function mySuccess(response) {
            if (response.data) {
                if (response.data.status === "success") {
                    $scope.error_message = "";
                    $scope.getData();
                    $state.go('home');
                } else {
                    $scope.error_message = response.data.status
                }
            } else {
                console.log("ERROR: no data found on response");
            }
        }, function myError(response) {
            console.log(response);
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
        $scope.showEditForm = true;
        $scope.showAddForm = false;
        $scope.edit = {name: value.accountName, pass:value.password, url: value.url};
        $scope.editId = value.id;
    };
    $scope.addEntry = function () {
        $scope.error_message = "";
        $scope.showAddForm = true;
        $scope.showEditForm = false;
        $scope.new = {name:"", pass:"", url: ""};
    };
    $scope.cancel = function () {
        $scope.error_message = "";
        $scope.showEditForm = false;
        $scope.showAddForm = false;
    };
    $scope.saveEdits = function () {
        $scope.checkUrl(function() {
            if ($scope.error_message !== "")
                return;
            var JSONObject = {
                accountName: $scope.edit.name,
                password: $scope.edit.pass,
                url: $scope.edit.url,
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
                    $scope.error_message = "";
                    $scope.edit.name = "";
                    $scope.edit.pass = "";
                    $scope.edit.url = "";
                    $scope.urlField = {'background-color':''};
                    $scope.getData();
                    $scope.cancel();
                } else {
                    $scope.error_message = response.data.status;
                }
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
                    $scope.error_message = "";
                    $scope.new.pass = "";
                    $scope.new.name = "";
                    $scope.new.url = "";
                    $scope.urlField = {'background-color':''};
                    $scope.getData();
                    $scope.cancel();
                } else {
                    $scope.error_message = response.data.status;
                }
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
                $scope.getData();
            } else {
                $scope.editError = response.data.status;
            }
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
    $interval(function() {
        if ($state.is("home"))
            $scope.getData()
    }, 1000);
});

//-- *****  APP CONFIG ***** --//
app.config(function($stateProvider) {
    var registerState = {
        name: 'reg',
        url: '/reg',
        template:registerPageTemplate()
    };
    var signInState = {
        name: 'signIn',
        url: '/',
        template:signInPageTemplate()
    };
    var loggedInState = {
        name: 'home',
        url: '/home',
        template: loggedInTemplate()
    };
    $stateProvider.state(loggedInState);
    $stateProvider.state(registerState);
    $stateProvider.state(signInState);
});

var registerPageTemplate = function() {
    //language=HTML
    return '<h1> Register for a new account </h1>'+
        '<p> Username and password must be between 4 and 10 characters</p>'+
        '<form>'+
        'Username : <input class="input-field" data-ng-model="username"  maxlength="10"/><br>'+
        'Password : <input type="password" class="input-field" data-ng-model="password_1"  maxlength="10"/>'+
        '<br>'+
        'Please re-enter your password.'+
        '<br>'+
        'Password : <input type="password" class="input-field" data-ng-model="password_2"/>'+
        '<br>'+
        '<button  data-ng-disabled="password_1.length < 4 || username.length < 4 || password_1 != password_2" data-ng-click="tryRegister()" > Register </button>'+
        '</form>'+
        '<div style="color: #cc0000">'+
        '{{error_message}}'+
        '</div>'+
        '<p> already have an account? </p>'+
        '<button data-ui-sref="signIn">Sign In </button>'
};

var signInPageTemplate = function() {
    //language=HTML
    return '<h1> Sign in to your account </h1>'+
        '<form>'+
        'Username : <input class="input-field" data-ng-model="username" /><br>'+
        'Password : <input type="password" class="input-field" data-ng-model="password_1"/>'+
        '<br>'+
        '<button data-ng-disabled="password_1.length < 4 || username.length < 4"  data-ng-click="trySignIn()" > SignIn </button>'+
        '</form>'+
        '<div style="color: #cc0000">'+
        '{{error_message}}'+
        '</div>'+

        '<p> don\'t have an account? </p>'+
        '<button data-ui-sref="reg">Register </button>'
};

var loggedInTemplate = function() {
    //language=HTML
    return  '<p> Welcome: <span data-ng-bind="username"></span>!</p>'+
        '<table>'+
        '<tr> <th> Account </th> <th> Password </th><th> url </th></tr>' +
        '<tr data-ng-repeat="entry in passList">'+
        '<td data-ng-bind="entry.accountName"></td>'+
        '<td data-ng-bind="entry.password"></td>'+
        '<td data-ng-bind="entry.url"></td>'+
        '<td> <button data-ng-click="editEntry(entry)"> edit </button>  </td>'+
        '<td> <button data-ng-click="remove()"> remove </button></td>'+
        '</tr>'+
        '</table>'+
        '<br>'+
        '<button data-ng-click="addEntry()"> Add New Password Entry </button>'+
        '<br><br>'+
        '<button data-ng-click="logout()"> log out </button>'+
        '<button data-ng-click="getData()"> refresh </button>'+
        '<form data-ng-show="showEditForm">'+
        '<h3 >Edit Existing User:</h3>'+
        '<br>'+
        '<label>Account:</label>'+
        '<input placeholder="(required)"  data-ng-model="edit.name">'+
        '<br>'+
        '<label>Password:</label>'+
        '<input placeholder="(required)"  data-ng-model="edit.pass">'+
        '<br>'+
        '<label>URL:</label>'+
        '<input placeholder="(optional)" name="url" data-ng-model="edit.url" data-ng-style="urlField" > '+
        '<br>'+
        '<div>'+
        '{{error_message}}'+
        '</div>'+
        '<br>'+
        '<button data-ng-click="saveEdits()" data-ng-disabled="edit.name.length == 0 || edit.pass.length > 100 || edit.pass.length == 0 || edit.name.length > 100 ">&#10004; Save Changes</button>'+
        '<button data-ng-click="cancel()">&#x2717; Cancel</button>'+
        '<button data-ng-click="checkUrl()">&#x2719; check url </button>'+
        '</form>'+
        '<form name="myForm" data-ng-show="showAddForm" >'+
        '<h3 >Add New User:</h3>'+
        '<label>Account:</label>'+
        '<input placeholder="(required)"  data-ng-model="new.name">'+
        '<br>'+
        '<label>Password:</label>'+
        '<input placeholder="(required)"  data-ng-model="new.pass">'+
        '<br>'+
        '<label>URL:</label>'+
        '<input placeholder="(optional)" name="url" data-ng-model="new.url" data-ng-style="urlField" > '+
        '<br>'+'{{validUrl}}'+
        '<div >'+
        '{{error_message}}'+
        '</div>'+
        '<br>'+
        '<button  data-ng-click="saveNew()" data-ng-disabled="new.name.length == 0 || new.pass.length > 100 || new.pass.length == 0 || new.name.length > 100 ">&#10004; Save Changes</button>'+
        '<button data-ng-click="cancel()">&#x2718; Cancel</button>'+
        '<button data-ng-click="checkUrl()">&#x2719; check url </button>'+
        '</form>'

};

