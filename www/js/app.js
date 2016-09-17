// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('mainApp', ['ionic', 'ngCordova', 'ion-floating-menu', 'ui.sortable', 'services','firebase','ngCordovaOauth'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})
.config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'templates/home.html',
              controller: function($scope) {
                  $scope.setTitle('健康管理');
              }
          })
          .state('about', {
              url: '/about',
              templateUrl: 'templates/about.html',
              controller: function($scope) {
                  $scope.setTitle("About");
                  $scope.getBMI();
                  $scope.getBMR();
              }
          })    
          .state('test', {
              url: '/test',
              templateUrl: 'templates/test.html',
              controller: function($scope) {
                  $scope.setTitle("test");
              }
          })  
          .state('sport', {
              url: '/sport',
              templateUrl: 'templates/sport.html',
              controller: function($scope) {
                  $scope.setTitle('Sport');
              }
          })
          .state('database', {
              url: '/database',
              templateUrl: 'templates/menu/database.html',
              controller: function($scope) {
                  $scope.setTitle('基本資料');
                  $scope.getBMI();
                  $scope.getBMR();
              }

          })
          .state('database_edit', {
              url: '/database',
              templateUrl: 'templates/menu/database_edit.html',
              controller: function($scope) {
                  $scope.setTitle('基本資料');

              }
          })
          /*.state('map', {
              url: '/map',
              templateUrl: 'templates/map.html',
              controller: 
              function($scope) {    
                var mapdiv = document.getElementById('map');  
                google.maps.event.addDomListener(mapdiv, 'load', $scope.initialize());
              }
          })*/
       $urlRouterProvider.otherwise('/');
})

.controller("mainController", function($scope, $http, $state, $cordovaOauth, $rootScope, $ionicPopover, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicPopup, $timeout, $ionicLoading, $ionicActionSheet, $ionicTabsDelegate) {
        $scope.userinfo = {
                  name : '未登入帳號',
                  photoURL : '/img/ionic.png'
                };

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {        
            //getUserinfo
             var user = firebase.auth().currentUser;
              if (user != null) {
                var info = {
                  providerId : user.providerId,
                  uid : user.uid,
                  name : user.displayName,
                  email : user.email,
                  photoURL : user.photoURL
                };
                $scope.userinfo = info;
              }
             $scope.loging = true;
             $scope.$digest();
          } else {
            $scope.loging = false;
          }
        });

      $scope.googleLogin = function() {
          var provider = new firebase.auth.GoogleAuthProvider();
          if(ionic.Platform.isWebView()){
                      return $cordovaOauth.google('662838886053-vk5k4s29d3065s98b6hvt8dp2lp6kqge.apps.googleusercontent.com' + '&include_profile=true', ["email", "profile"]).then(function (result) {
                          var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                          return firebase.auth().signInWithCredential(credential);
                      });
          } else{  
              firebase.auth().signInWithRedirect(provider).then(function(result) {    
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              })     
          }


      }

      $scope.signOut = function() {
        firebase.auth().signOut().then(function() {
           $scope.userinfo = {
                  name : '未登入帳號',
                  photoURL : '/img/ionic.png'
                };
          $scope.basedata = {
            sex : '',          //  性別
            age : '',          //  年齡
            height : '',       //  身高
            weight : '',       //  體重
            BMI : '',          //  BMI
            min_BMR : '',      //  基礎代謝率
            max_BMR : '',      //
            selectedSport : [{name:'Monday', splist:[]}, {name:'Tuesday', splist:[]}, {name:'Wednesday', splist:[]}, {name:'Thursday', splist:[]}, {name:'Friday', splist:[]}, {name:'Saturday', splist:[]}, {name:'Sunday',splist:[]}]
          }
        }, function(error) {
          // An error happened.
        });
        $scope.toggleLeftSideMenu();
      }      

      //base-data
        $scope.basedata = {
          sex : '',          //  性別
          age : '',          //  年齡
          height : '',       //  身高
          weight : '',       //  體重
          BMI : '',          //  BMI
          min_BMR : '',      //  基礎代謝率
          max_BMR : '',      //
          selectedSport : [{name:'Monday', splist:[]}, {name:'Tuesday', splist:[]}, {name:'Wednesday', splist:[]}, {name:'Thursday', splist:[]}, {name:'Friday', splist:[]}, {name:'Saturday', splist:[]}, {name:'Sunday',splist:[]}]
        }
      //button-style
        $scope.butsty = {
          'padding': 0,
          'text-align': 'left',
          'font-size' : '16px',
          'font-family':'微軟正黑體',
          'color': '',
        }
      //sport-data
        $scope.sportlist = [
          {sname: '慢走',units: '4公里/時', cal: 3.5},
          {sname: '快走、健走',units: '6.0公里/時', cal: 5.5},
          {sname: '上樓梯', units: '', cal: 8.4},
          {sname: '慢跑',units: '8公里/時', cal: 8.2},
          {sname: '快跑',units: '12公里/時' , cal: 12.7},
          {sname: '騎腳踏車',units: '10公里/時' , cal: 4},
        ];
           
    // data function 
    $scope.getBMR = function(){
      var a = $scope.basedata.age;
      var h = $scope.basedata.height;
      var w = $scope.basedata.weight;
      var BMR;
        if ($scope.basedata.sex === 'Male') 
          BMR = 66+(13.7 * w)+(5 * h)-(6.8 * a);
        else if($scope.basedata.sex === 'Female')
          BMR = 655+(9.6 * w)+(1.7 * h)-(4.7 * a);
      $scope.basedata.min_BMR = BMR;
    }

    $scope.getBMI = function(){
      var h = $scope.basedata.height/100;
      var w = $scope.basedata.weight;
      $scope.basedata.BMI =  w/(h*h);
    };

   
    $scope.showSelectValue = function(selectSp) {
        $scope.selectSp = JSON.parse(selectSp);
        //console.log();
    }
    $scope.addSport = function(sid) {
      $scope.selectSp = '';
      $scope.sptime = {
        t : ''
      };
        var myPopup = $ionicPopup.show({
          cssClass: '',
          templateUrl: 'templates/addS.html',
          title: '選擇時段與運動',
          subTitle: 'Choose time and sport',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Add</b>',
              type: 'button-positive',
              onTap: function(e) {
                if ($scope.selectSp && ($scope.sptime.t > 0) && ($scope.sptime.t < 600)) {
                  $scope.basedata.selectedSport[sid].splist.push({
                      sname : $scope.selectSp.sname,
                      stime : $scope.sptime.t,
                      ecal : $scope.selectSp.cal * ($scope.sptime.t / 60.0) * $scope.basedata.weight
                  });
                  return true;
                }else {

                }    
              }
            }
          ]
        });
    };
   

    $scope.radshow = function(A) {
      if (A) {
        $scope.A = false;
      }else{
        $scope.A = true;
      };

    };

   $scope.show = function() {
   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<span class="button button-clear button-dark">Male</span>' },
       { text: '<span class="button button-clear button-dark">Female</span>' }
     ],
     
     titleText: '<span class="stitle">請選擇您的性別</span>',
     cancelText: '<span class="button button-clear button-dark">Cancel</span>',
     cancel: function() {
          
        },
     buttonClicked: function(index) {
      $scope.butsty.color = '#808080';
      if(index === 0) {
          $scope.basedata.sex = 'Male';
      }       
      if(index === 1) {
          $scope.basedata.sex = 'Female';
      }
        return true;
     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 3000);

    };

      $scope.selected = 0;
        $scope.isSelected = function (id) {
          return ($scope.selected === id) ? 'active tab-item' : 'tab-item';
      };

      $scope.t = function (n , btnid) {
        $scope.selected = btnid;
        $scope.testlist = [];
        for (var i = 0; i < n; i++) {
          $scope.testlist.push(i);
        };
      };

      $scope.setTitle = function(title) {
          $scope.title = title;
      };
      $scope.isActive = function (viewLocation) { 
          return viewLocation === $location.path();
      };
      $scope.isObject = function(input) {
          return angular.isObject(input);
      };
      /*  sortable  */
      $scope.sortableOptions = {
          'ui-floating': true, 
          opacity: 0.7,  
          connectWith: '.container',
          handle: '.myHandle'
      };
      /*  fab  */
      $scope.newTrip = function() {
         $state.go('about');
      };



      $scope.showPopup = function() {
        var myPopup = $ionicPopup.show({
          cssClass: '',
          templateUrl: 'templates/fabadd.html',
          title: '創建新的行程',
          subTitle: '',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                  //e.preventDefault();
                  var tmpNewTrip = {
                    name: document.getElementById('tname').value,
                    date: document.getElementById('tdate').value,
                    triplist: [{locatelist:[],route:[]}]
                    };
                  $scope.trip = tmpNewTrip;
                  $scope.alltrip.push(tmpNewTrip);
                  return true;
              }
            }
          ]
        });

        myPopup.then(function(res) {
          if (res) {
              $state.go('about');
            }
          console.log('Tapped!', res);
        });

/*        $timeout(function() {
           myPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);*/
       };

/*      $scope.initialize = function() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }*/
      
      $scope.cleartext = function(id) {
        document.getElementById(id).value = '';
      }

      $scope.viewT = function(index) {
        $scope.trip = $scope.alltrip[index];
        $state.go('about');
      }

      $scope.goSearch = function(tid) {
        $scope.tid = tid;
        $state.go('loc_s');
      }

      $scope.addOneDay = function() {
          var tmpt = $scope.trip;
          tmpt.triplist.push({locatelist:[],route:[]}); 
          $scope.trip = tmpt;
      }
/*      $scope.addloc = function(lname, llat, llng,lpid) {
       
        var tmpt = $scope.trip;
        var tmptid = $scope.tid;
        tmpt.triplist[tmptid].locatelist.push({
          pid: lpid,
          name: lname,
          lat: llat,
          lng: llng
        });
        $scope.trip = tmpt;
        $scope.getRoute($scope.trip, tmptid);
      }*/
     /* $scope.getRoute = function(tmpt, tmptid){
        var rlist = [];
        for (var i = 0; i < tmpt.triplist[tmptid].locatelist.length - 1; i++) {
            
            $http.get('http://localhost/hello?start='+tmpt.triplist[tmptid].locatelist[i].pid+'&end='+tmpt.triplist[tmptid].locatelist[i+1].pid)
            .success(function(response) {
              rlist.push(response.routes[0].legs[0].duration.text);
              console.log(rlist);
            }); 

        };
        
        if(rlist){
          tmpt.triplist[tmptid].route = rlist;
          $scope.trip = tmpt;
        };
      }*/
      
 /*     $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
      $scope.testc = function(){

        console.log("test");
      };*/
      $scope.currentChose = '';
      $scope.choise = {
        ed : ''
      }
      $scope.rbtn = function(v) {
          if ($scope.currentChose == v) {
            $scope.currentChose = '';
            $scope.choise.ed = ''; 
          } else {
            $scope.currentChose = v;
          }
      }

      /*  sidemenu  */
      $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
      $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step){
            input.push(i);
        };
        return input;
      };

/*      
      $http.get('http://localhost/data')
      .success(function(response) {
        $scope.locate = response;
      });*/
      

      var tmpList = [{day:0,l:[]}];
        
      for (var i = 1; i <= 6; i++){
          /*tmpList.push({
            text: 'Item ' + i,
            value: i
          });*/
          tmpList[0].l.push(i);
      };

      var tmpList2 = [];
        
      for (var i = 7; i <= 10; i++){
          tmpList2.push({
            text: 'Item ' + i,
            value: i
          });
      };
        
        
      $scope.list = tmpList;
      $scope.list2 = tmpList2;

     /* $scope.openGoogleMap = function() {
          $state.go('map');
      };

      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      var map;
      var inticor;
      $scope.setLatLng = function(lat, lng) {
        inticor= new google.maps.LatLng(lat, lng);
        $scope.openGoogleMap();
      }

      $scope.initialize = function() {
      
          directionsDisplay = new google.maps.DirectionsRenderer();
          var mapOptions =
                  {
                      zoom: 17,
                      center: inticor,
                      mapTypeId: google.maps.MapTypeId.ROADMAP,
                  };

          map = new google.maps.Map(document.getElementById('map'), mapOptions);
          directionsDisplay.setMap(map);

          var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
          var compiled = $compile(contentString)($scope);

          var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
          });

          var marker = new google.maps.Marker({
            position: inticor,
            map: map,
            title: 'Uluru (Ayers Rock)'
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });

          $scope.map = map;      
          
      }*/
      
/*
      $scope.calcRoute = function() {
        var start = "高雄市大樹區竹寮路149號";
        var end = "屏東縣屏東市屏東縣屏東市建南路182號1樓";
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
      }*/

})

/*.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
      function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      var mapdiv = document.getElementById('map');
      google.maps.event.addDomListener(mapdiv, 'unload', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
      $scope.testc = function(){

        console.log("test");
      };
    })
*/
