/*http://plnkr.co/edit/3AfFfo?p=preview*/

/*var myapp in angular is a - namespace*/
/*Adding ngRoute dependency*/
/*Including appController controller inside the module*/
/*Creating a controller to handle registration*/
(function() {
    var myApp = angular.module('myApp', ['firebase', 'ngAnimate']);
    //Basic Filter to reverse array Elements of Firebase
    myApp.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    }); //reverseFunction

    //Defining two services - geolocation and initializerGoogleMaps
    angular.module('myApp').factory('geoLocationService', ['$q', '$window', geoLocationService]);

    function geoLocationService($q, $window) {
        return {
            getCurrentPosition: getCurrentPosition,
            watchCurrentPosition: watchCurrentPosition,
            setDestinationPosition: setDestinationPosition
        };
        //Function to get the Current Location of the device
        function getCurrentPosition() {
            var deferred = $q.defer();
            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                //getCurrentPosition can take two arguments both which are function, one for success and another for error
                $window.navigator.geolocation.getCurrentPosition(
                    function(position) {
                        deferred.resolve(position);
                    },
                    function(err) {
                        deferred.reject(err);
                    });
            }
            return deferred.promise;
        } //end:getCurrentPosition

        function setDestinationPosition() {
            var deferred = $q.defer();
            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                //getCurrentPosition can take two arguments both which are function, one for success and another for error
                $window.navigator.geolocation.getCurrentPosition(
                    function(position) {
                        deferred.resolve(position);
                    },
                    function(err) {
                        deferred.reject(err);
                    });
            }
            return deferred.promise;
        } //end:setDestinationPosition

        //Function to get the Keep track of the device
        function watchCurrentPosition() {
            var deferred = $q.defer();
            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                //watchCurrentPosition can take two arguments both which are function, one for success and another for error
                $window.navigator.geolocation.watchPosition(
                    function(position) {
                        deferred.resolve(position);
                    },
                    function(err) {
                        deferred.reject(err);
                    });
            }
            return deferred.promise;
        } //end:watchCurrentPosition
    } //end:geoLocationService

    // Google async initializer needs global function, so we use $window
    angular.module('myApp')
        .factory('initializerGoogleMaps', ['$window', '$q', function($window, $q) {
            return {
                // usage: initializerGoogleMaps.mapsInitialized.then(callback)
                mapsInitialized: mapsInitialized
            };
            //function mapsInitialized
            function mapsInitialized() {
                var mapsDefer = $q.defer();
                // Google's url for async maps initialization accepting callback function
                var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCSL5fxrTbT-3BnC_g-evmuGtJo9UuwF5U&callback=';
                // async loader
                var asyncLoad = function(asyncUrl, callbackName) {
                    var script = document.createElement('script');
                    //script.type = 'text/javascript';
                    script.src = asyncUrl + callbackName;
                    document.body.appendChild(script);
                };
                // callback function - resolving promise after maps successfully loaded
                $window.googleMapsInitialized = function() {
                    mapsDefer.resolve();
                };
                // loading google maps
                asyncLoad(asyncUrl, 'googleMapsInitialized');
                return mapsDefer.promise;
            } //end:mapsInitialized
        }]); //end:factory

    /*musicController for jQuery audio plugin*/
    myApp.controller('musicController', ['$scope', musicController]);

    function musicController($scope) {
        var vm = $scope;
        vm.playMusic = function() {
            // debugger;
            console.log("Playing Music");
            $.mbAudio.sounds = {
                backgroundMusic: {
                    id: "backgroundMusic",
                    mp3: "audio/AjeebDastan.mp3",
                    sprite: {
                        intro: {
                            id: "intro",
                            start: 80,
                            end: 116.975,
                            loop: true
                        },
                        levelIntro: {
                            id: "levelIntro",
                            start: 3.4,
                            end: 22,
                            loop: true
                        },
                        tellStory: {
                            id: "tellStory",
                            start: 80,
                            end: 116.975,
                            loop: true
                        },
                        level1: {
                            id: "level1",
                            start: 5,
                            end: 13,
                            loop: true
                        },
                        level2: {
                            id: "level2",
                            start: 40,
                            end: 56,
                            loop: true
                        },
                        level3: {
                            id: "level3",
                            start: 120,
                            end: 136.030,
                            loop: true
                        }
                    }
                }
            };
            $.mbAudio.play('backgroundMusic', 'levelIntro');
        }; //end:playMusic()
    } //end:musicController

    myApp.controller('formController', ['$scope', function($scope) {}]); /*end controller: formController*/

    /*Controller to read Firebase data*/
    myApp.controller('firebaseController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
        /*Setup Angular JS model*/
        var vm = $scope;
        vm.formInput = {
            myname: "",
            comment: ""
        };
        vm.thankYou = false;
        angular.extend($scope, {
            items: [],
            name: '',
            date: '',
            comment: '',
            id: 0
        }); /*model*/

        var ref = new Firebase('https://gagaandreshmi.firebaseio.com/chatbox');
        vm.chats = $firebaseArray(ref);
        vm.chatListObject = $firebaseObject(ref);

        vm.addComment = function(inputObj) {
            // console.log(vm.myname);
            vm.chats.$add({
                comment: inputObj.comment,
                date: Firebase.ServerValue.TIMESTAMP,
                like: 0,
                name: inputObj.myname
            });
            vm.chats.$save();
            vm.formInput = {
                myname: "",
                comment: ""
            };
            vm.thankYou = true;
        }; /*end function:addMeeting*/

        vm.updateLike = function(inputObj) {
            var currentLikeValue = inputObj.like;
            console.log('Current Like value of this is: ', currentLikeValue);
            vm.chatListObject[inputObj.$id].like = currentLikeValue + 1;
            vm.chatListObject.$save();
        }; /*end function:updateLike*/

        vm.displayDate = function(value) {
            var myDate = new Date(value);
            var formatedTime = myDate.toDateString();
            return formatedTime;
        }; //end:displayDate
        //console.log(vm.chats);
    }]); /*End controller: firebaseController*/

    /*Controller for geolocation*/
    angular.module('myApp').controller('geoLocationController', ['$scope', 'geoLocationService', 'initializerGoogleMaps', geoLocationController]);

    function geoLocationController($scope, geoLocationService, initializerGoogleMaps) {
        var vm = $scope;
        debugger;
        vm.title = "Venue Map";
        vm.geoLocationText = "";
        vm.geoTimeStamp = "";
        vm.isLoadedMap = "false";
        var geoCurrPosService = geoLocationService.getCurrentPosition();
        geoCurrPosService.then(function(data) {
            // if(Object.prototype.toString.call(data) === '[object Geolocation]'){
            var latitude = data.coords.latitude;
            var longitude = data.coords.longitude;
            if (data.timestamp) {
                var mydate = new Date(data.timestamp);
                vm.geoTimeStamp = mydate;
            } //endif
            vm.geoLocationText = "Latitude: " + latitude + " , Longitude: " + longitude;
            vm.showMap(data.coords); // Invoke the Google Map here
            // }else{
            // vm.geoLocationText = "Value returned is not an Object";
            // }
        }); //then()

        vm.showMap = function(coords) {
            //showMap will now load from googleMapLoaderService
            var googleMapLoaderService = initializerGoogleMaps.mapsInitialized();
            googleMapLoaderService.then(function(data) {
                // googleMapLoaderService has loaded the google map API script
                //12.9378649,77.518271 - theclub
                var theClubLatLong = {
                    lat: 12.9378649,
                    lng: 77.518271
                };
                //Centre Location on the Map same as the marker - 12.939019, 77.517242
                var googleLatLong = new google.maps.LatLng(12.941148, 77.517305);//12.939019, 77.517242
                //Specify Google map with Properties
                var mapOptions = {
                    zoom: 14,
                    center: googleLatLong,
                    mapTypeId: 'roadmap'
                };
                var mapDiv = document.getElementById('mapArea');
                var myGoogleMap = new google.maps.Map(mapDiv, mapOptions);
                //INFO:Setting a Marker to the Methodist Church
                var markerTheClub = new google.maps.Marker({
                    position: theClubLatLong,
                    map: myGoogleMap,
                    title: 'Wedding Methodist Church',
                    clickable: true
                });

                //Setting InfoWindow for Methodist Church
                var infoWindowTheClub = new google.maps.InfoWindow({
                    maxWidth: 200,
                });
                infoWindowTheClub.setContent('<h5><strong>The Club:</strong></h5><p>Mysore Road, Nayandahalli, SLV layout, Phase 3, Nayanda Halli, Bengaluru, Karnataka 560039</p><p>Landmark: <strong>Opposite Gopalan Arcade Mall, RR Nagar</strong></p><p><a target="_blank" href="https://www.google.co.in/maps/place/The+Club/@12.9378649,77.518271,16.25z/data=!4m8!1m2!2m1!1sthe+club+bangalore!3m4!1s0x3bae3e5f6bc2128d:0x437c5198bb807145!8m2!3d12.9365023!4d77.5173459?hl=en">Open in Google Maps</a></p>');
                infoWindowTheClub.open(myGoogleMap, markerTheClub);
            }); //then()
            //Fading out the Loading Bar in Geolocation
            $(".loadingMap").fadeOut("slow");
        }; //end:showMap
    } //end:geoLocationController
    /*end:Controller for geolocation*/


}()); //IIFE
