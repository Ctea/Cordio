// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function () {
  "use strict";
var ionicApp = angular.module('mainApp', ['ionic', 'ngCordova', 'ion-floating-menu', 'ui.sortable', 'services','firebase','ngCordovaOauth' , 'angular-timeline','angular-scroll-animate', 'tabSlideBox'])

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
          .state('plan_list', {
              url: '/plan_list',
              templateUrl: 'templates/activity/plan_list.html',
              controller: function($scope) {
                  $scope.setTitle('Plan');
              }
          }) 
          .state('plan', {
              url: '/plan',
              templateUrl: 'templates/activity/plan.html',
              controller: function($scope) {
                  $scope.setTitle($scope.basedata.plan_list[$scope.pid].pname);
                  $scope.timedata.start = null;
                  $scope.timedata.end = null;
                  $scope.timedata.total = null;
              }
          })  
          .state('add_Sport', {
              url: '/add_Sport',
              templateUrl: 'templates/activity/add_Sport.html',
              controller: function($scope) {
                  $scope.setTitle("選擇時段與活動");
            
              }
          })  
          .state('basedata', {
              url: '/basedata',
              templateUrl: 'templates/data/basedata.html',
              controller: function($scope) {
                  $scope.setTitle('基本資料');
                  $scope.getBMI();
                  $scope.getBMR();
              }

          })
          .state('basedata_edit', {
              url: '/basedata_edit',
              templateUrl: 'templates/data/basedata_edit.html',
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
.controller ("mainController", ['$scope', '$http', '$state', '$cordovaOauth', '$rootScope', '$ionicPopover', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$ionicPopup', '$ionicModal', '$timeout', '$ionicLoading', '$ionicActionSheet', '$ionicTabsDelegate', '$ionicScrollDelegate', '$location', function($scope, $http, $state, $cordovaOauth, $rootScope, $ionicPopover, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicPopup, $ionicModal, $timeout, $ionicLoading, $ionicActionSheet, $ionicTabsDelegate, $ionicScrollDelegate, $location) {

      // ----------------- base-data ----------------- 
        $scope.basedata = {
          sex : '',          //  性別
          age : '',          //  年齡
          height : '',       //  身高
          weight : '',       //  體重
          BMI : '',          //  BMI
          min_BMR : '',      //  基礎代謝率
          max_BMR : '',      //
          plan_list : [],
        }
      //button-style
        $scope.butsty = {
          'padding': 0,
          'text-align': 'left',
          'font-size' : '16px',
          'font-family':'微軟正黑體',
          'color': '',
        }

        $scope.events = [{
          badgeClass: 'info',
          badgeIconClass: './img/ionic.png',
          title: 'First heading',
          content: 'Some awesome content.'
        }, {
          badgeClass: 'warning',
          badgeIconClass: 'glyphicon-credit-card',
          title: 'Second heading',
          content: 'More awesome content.'
        }];
      // ----------------- sport-data ----------------- 
        $scope.sportlist = [
          {sname: '慢走',units: '4公里/時', cal: 3.5},
          {sname: '快走、健走',units: '6.0公里/時', cal: 5.5},
          {sname: '上樓梯', units: '', cal: 8.4},
          {sname: '慢跑',units: '8公里/時', cal: 8.2},
          {sname: '快跑',units: '12公里/時' , cal: 12.7},
          {sname: '騎腳踏車',units: '10公里/時' , cal: 4},
        ];
           
      // ----------------- login -----------------
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
             $scope.$apply();
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
            plan_list : [],
          }
        }, function(error) {
          // An error happened.
        });
        $scope.toggleLeftSideMenu();
      }      

 
    // ----------------- data function ----------------- 
       $scope.showsex = function() {
   
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

    // ----------- angular-scroll-animate -----------
        $scope.animateElementIn = function($el) {
          $el.removeClass('timeline-hidden');
          $el.addClass('bounce-in');
        };

       
        $scope.animateElementOut = function($el) {
          $el.addClass('timeline-hidden');
          $el.removeClass('bounce-in');
        };

    // -----------------  radio but controll ----------------- 
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

    $scope.showSelectValue = function(selectSp) {
        $scope.selectSp = JSON.parse(selectSp);
        //console.log();
    }
    
    // ----------------- time ----------------- 
    $scope.timedata = {
        start: null,
        end: null,
        total: null,
        start_s: null,
        end_s: null,
        total_s: null,
        total_c: false,
        First : 0
    }
    $scope.timeFocus = function () {
        var t = $scope.timedata
        t.total_c = true;
    }
    $scope.timeBlur = function () {
        var t = $scope.timedata
        t.total_c = false;
    }
    $scope.timeBlur2 = function (value) {
        var t = $scope.timedata
        t.First = value;
    }
    $scope.timechange = function(value) {
        var t = $scope.timedata
            if ((t.start && t.total) || (t.start && t.end) || (t.total && t.end)) {
                if (!t.start) {
                    $scope.timedata.start = angular.copy(t.end);
                    $scope.timedata.start.setMinutes(t.end.getMinutes() - t.total);
                    t.start_s = t.start;
                    t.total_s = t.total;
                    t.end_s = t.end;
                }
                else if (!t.end) {
                    $scope.timedata.end = angular.copy(t.start);
                    $scope.timedata.end.setMinutes(t.start.getMinutes() + t.total);
                    t.start_s = t.start;
                    t.total_s = t.total;
                    t.end_s = t.end;
                }
                else if (!t.total && !t.total_c) {
                    $scope.timedata.total = (t.end - t.start) / 60000
                    t.start_s = t.start;
                    t.total_s = t.total;
                    t.end_s = t.end;
                }
                else {
                    if (t.start != t.start_s) {
                        $scope.timedata.end = angular.copy(t.start_s);
                        $scope.timedata.end.setMinutes(t.start.getMinutes() + t.total);
                        t.start_s = t.start;
                        t.end_s = t.end;
                    } else if (t.total != t.total_s) {
                        if (t.First === 0) {
                            $scope.timedata.end = angular.copy(t.start_s);
                            $scope.timedata.end.setMinutes(t.start.getMinutes() + $scope.timedata.total);
                        } else if(t.First === 1) {
                            $scope.timedata.start = angular.copy(t.end);
                            $scope.timedata.start.setMinutes(t.end.getMinutes() - t.total);
                        }
                        t.start_s = t.start;
                        t.total_s = t.total;
                        t.end_s = t.end;
                    } else if (t.end != t.end_s) {
                        $scope.timedata.total = (t.end - t.start) / 60000
                        t.total_s = t.total;
                        t.end_s = t.end;
                    }
                }
            };
    }

    

  // ----------------- add_sport modal ----------------- 
    $scope.modal_show = function(){
        $scope.timedata.start = null;
        $scope.timedata.end = null;
        $scope.timedata.total = null;    
        $scope.modal.show();
 /*     $location.hash(id);
        $ionicScrollDelegate.anchorScroll();*/
    }
    $ionicModal.fromTemplateUrl('templates/activity/add_Sport.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });

  // -----------------  add_Sport radiobutton ----------------- 
    $scope.sportoption = {
      s:null,
    };
    $scope.sptab = {
      v : '腿部運動'
    }
    $scope.sl= [];
    $http.get('sl.json').success(function(data) { 
        console.log("success!");
        $scope.sl = data.table1;
    });
    $scope.to_p = function(pid) {
      $scope.pid = pid;
      $state.go('plan');
    }  
    $scope.slideChange = function(v) {
      $scope.sptab.v = v ;
    }
     
    $scope.add_activity = function() {
      var t = $scope.timedata;
      var s = $scope.sportoption.s;
      if (t.start && t.end && t.total && s) {
        $scope.basedata.plan_list[$scope.pid].psplist.push({
          sname : s.sname,
          scal : s.scal,
          sstart : t.start,
          send :  t.end,
          stotal : t.total
        });
      };
      $scope.modal.hide();
      $state.go('plan')
    }
    $scope.add_plan = function() {
      $scope.selectSp = {
        pname : (new Date().getMonth()+1)+"/"+new Date().getDate()+' 的計劃',
        pdate : new Date(),
        pbr_in : '',
        psplist : [],
      }

        var myPopup = $ionicPopup.show({
          cssClass: '',
          templateUrl: 'templates/activity/addS.html',
          title: '<h3>設定名稱與日期</h3>',
          subTitle: 'Create a plan and choose a day',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Add</b>',
              type: 'button-positive',
              onTap: function(e) {
                if ($scope.selectSp.pname && $scope.selectSp.pdate) {
                  $scope.basedata.plan_list.push($scope.selectSp)   
                };              
              }
            }
          ]
        });
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
    // ----------------- Other -----------------   
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
      
      $scope.cleartext = function(id) {
        document.getElementById(id).value = '';
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

      
   


}])


 /*  $http.get('http://localhost/data')
      .success(function(response) {
        $scope.locate = response;
      });*/
      
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
})();