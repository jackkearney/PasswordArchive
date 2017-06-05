// /**
//  * Created by jkearney on 6/2/2017.
//  */
// app.service('authService', ['$resource', function ($resource) {
//     var loggedInUser = $resource(':controller/:action',
//         {controller: 'hello', action: 'checkLoggedIn'}, {
//             query: {method:'GET'}});
//
//     this.loggedInUser = function () {
//         return loggedInUser.query();
//     };
//     this.isAuthenticated = function () {
//         return false;
//     }
// }]);
