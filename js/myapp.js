/*http://plnkr.co/edit/3AfFfo?p=preview*/

/*var myapp in angular is a - namespace*/
/*Adding ngRoute dependency*/
/*Including appController controller inside the module*/
/*Creating a controller to handle registration*/
var myApp = angular.module('myApp', ['firebase','ngAnimate']);

myApp.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });//reverseFunction

myApp.controller('formController', ['$scope',function($scope){
}]);/*end controller: formController*/

/*Controller to read Firebase data*/
myApp.controller('firebaseController',['$scope','$firebaseObject','$firebaseArray',function($scope,$firebaseObject,$firebaseArray){
    /*Setup Angular JS model*/
    var vm = $scope;
    vm.formInput = {myname:"",comment:""};
    vm.thankYou = false;
    angular.extend($scope,{
        items: [],
        name:'',
        date:'',
        comment:'',
        id:0
    });/*model*/


    //var ref = new Firebase('https://prathikshawedding.firebaseio.com/chatbox');
    var ref = new Firebase('https://gagaandreshmi.firebaseio.com/chatbox');
    vm.chats = $firebaseArray(ref);
    vm.chatListObject = $firebaseObject(ref);

    vm.addComment = function(inputObj){
        // console.log(vm.myname);
        vm.chats.$add({
          comment:inputObj.comment,
          date: Firebase.ServerValue.TIMESTAMP,
          like:0,
          name:inputObj.myname
        });
        vm.chats.$save();
        vm.formInput = {myname:"",comment:""};
        vm.thankYou = true;
    };/*end function:addMeeting*/

    vm.updateLike = function(inputObj){
      var currentLikeValue = inputObj.like;
      console.log('Current Like value of this is: ', currentLikeValue);
      vm.chatListObject[inputObj.$id].like = currentLikeValue + 1;
      vm.chatListObject.$save();
    }/*end function:updateLike*/

    vm.displayDate = function(value){
        var myDate = new Date(value);
        var formatedTime=myDate.toDateString();
        return formatedTime;
    }

    //console.log(vm.chats);
}]);/*End controller: firebaseController*/
