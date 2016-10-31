// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function () {
  "use strict";
var ionicApp = angular.module('mainApp', ['ionic', 'ngCordova', 'ion-floating-menu', 'ui.sortable', 'services','firebase','ngCordovaOauth' , 'angular-timeline','angular-scroll-animate', 'tabSlideBox', 'ui.scroll'])

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

            .state('food', {
                    url: '/food',
                    templateUrl: 'templates/food/food.html',
                    controller: function($scope) {
                        $scope.setTitle('飲食管理');
                    }
            })

            .state('fooditem', {
                url: '/fooditem',
                templateUrl: 'templates/food/fooditem.html',
                controller: function($scope) {
                    //  $scope.setTitle( $scope.basedata.food_list[$scope.fid].fname ); 
                    $scope.setTitle('飲食記錄');
                }

            })

            .state('addfooditem', {
                url: '/addfooditem',
                templateUrl: 'templates/food/addfooditem.html',
                controller: function($scope) {
                    //  $scope.setTitle( $scope.basedata.food_list[$scope.fid].fname ); 
                    $scope.setTitle('新增記錄');
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
                  $scope.setTitle('計劃列表');
              }
          }) 
          .state('plan', {
              url: '/plan',
              templateUrl: 'templates/activity/plan.html',
              controller: function($scope) {
                  $scope.setTitle($scope.basedata.plan_list[$scope.k][$scope.pid].pname);
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
          plan_list : {},    //  計劃列表
          food_list : []     //  飲食
        }
      //button-style
        $scope.butsty = {
          'padding': 0,
          'text-align': 'left',
          'font-size' : '16px',
          'font-family':'微軟正黑體',
          'color': '',
        }

      // ----------------- sport-data ----------------- 

        $scope.sl= [];       //資料列表
        $scope.sl_f= [];     //強度列表
        $scope.s_tabs = {};  //運動分類

        //取得JSON資料
        $http.get('sl.json').success(function(data) { 
            console.log("success!");
            $scope.sl = data.table1;
            $scope.sl_f = data.table2;
            for (var i = 0; i < $scope.sl.length; i++) {
                 $scope.s_tabs[$scope.sl[i].type] = $scope.sl[i].type;        
            };  
        });
           
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
            plan_list : {},
            food_list : [] 
          }
        }, function(error) {
          // An error happened.
        });
        $scope.toggleLeftSideMenu();
      }      

 
    // ----------------- basedata function ----------------- 
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
            if(index === 0)  $scope.basedata.sex = 'Male';            
            if(index === 1)  $scope.basedata.sex = 'Female';
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

    // -------------  radio but controll ------------- 
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
            day: false,
            start_s: null,
            end_s: null,
            total_s: null,
            total_c: false,
            First: 0
        }
        $scope.timeFocus = function() {
            var t = $scope.timedata
            t.total_c = true;
        }
        $scope.timeBlur = function() {
            var t = $scope.timedata
            t.total_c = false;
        }
        $scope.timeBlur2 = function(value) {
            var t = $scope.timedata
            t.First = value;
        }
        $scope.timechange = function(value) {
            var t = $scope.timedata

            if ((t.start && t.total) || (t.start && t.end) || (t.total && t.end)) {

                if (!t.start) {
                    t.start = new Date(t.end.getTime() - (t.total * 60000));
                } else if (!t.end) {
                    t.end = new Date(t.start.getTime() + (t.total * 60000));
                } else if (!t.total && !t.total_c) {
                    $scope.timetotal();
                } else {
                    if (t.start != t.start_s) {
                        t.end = new Date(t.start.getTime() + (t.total * 60000));
                    } else if (t.total != t.total_s) {
                        $scope.timeFirst();
                        $scope.timetotalOver();
                    } else if (t.end != t.end_s) {
                        $scope.timetotal();
                    }
                };
                t.start_s = t.start;
                t.total_s = t.total;
                t.end_s = t.end;
                if(t.end.getDate()>t.start.getDate())
                  t.day =true;
                else
                  t.day =false;
                //console.log(t.day);
            }
             $scope.setMets();
        };

        $scope.timeFirst = function() {
           var t = $scope.timedata

            if (t.First === 0) 
                t.end = new Date(t.start.getTime() + (t.total * 60000));
            else if (t.First === 1) 
                t.start = new Date(t.end.getTime() - (t.total * 60000));            
        };
        $scope.timetotal = function() {
           var t = $scope.timedata
            if ( ((t.end - t.start) / 60000) >= 0 )
                t.total = (t.end - t.start) / 60000;
            else
                t.total = ((t.end - t.start) / 60000) + 1440; //24*60
            $scope.timetotalOver();
        }

        $scope.timetotalOver = function() {
           var t = $scope.timedata
            if (t.total >= 1440) {
                t.total = t.total - (Math.floor(t.total / 1440) * 1440);
                t.end = new Date(t.start.getTime() + (t.total * 60000));
            }
        }

  // ----------------- add_sport modal -----------------
    $scope.search = {
      name : ''
    }
    $scope.modal_show = function(){
        $scope.n = {
          n:true
        }
        $scope.clearadd_sport(0)
        $scope.search.name = null;
        $scope.modal.show();
 /*     $location.hash(id);
        $ionicScrollDelegate.anchorScroll();*/
    }

    $ionicModal.fromTemplateUrl('templates/activity/add_Sport.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });

  // -----------------  add_Sport  ----------------- 
    
    //選擇的運動項目
    $scope.sportoption = {
      s:null,
      f:{
        strength: null,
        feature:null,
        cost: null,
        mets: null,
      }
    };
    $scope.sport_selectoption = {
      f : null
    }
    // Set Mets
    $scope.setf = function(){
      var s =  $scope.sportoption.f;
      var select = $scope.sport_selectoption.f;
      var tmp = select.Remark;
      s.mets = select.Mets;
      s.feature = tmp;
    }
    $scope.setMets = function(){
        var s =  $scope.sportoption;
        s.f.cost = $scope.timedata.total;
        s.f.strength = s.s.feature;
        if (s.f.cost != null && s.f.feature != null) {
          var x = (s.f.feature / 1000.0) / (s.f.cost / 60.0);
            if (s.s.feature === "length") { 
              if (s.s.name = "跑步")  s.f.mets = 0.0022 * Math.pow(x,3) - 0.0688 * Math.pow(x,2) + 1.4548 * x - 0.1089;
                
              if (s.s.name = "散步")  s.f.mets = 0.0332 * Math.pow(x,3) - 0.3283 * Math.pow(x,2) + 1.5577 * x + 0.0102;             
              
              if (s.s.name = "散步爬坡")  s.f.mets = 0.0641 * Math.pow(x,2) + 0.7125 * x;
                          
              if (s.s.name = "騎自行車")  s.f.mets = 0.001 * Math.pow(x,3) - 0.0363 * Math.pow(x,2) + 0.6965 * x - 0.0893;
       
            }else if (s.s.feature === "Watt") 
              s.f.mets = 0.0000005 * Math.pow(x,3) - 0.0002 * Math.pow(x,2) + 0.0877 * x + 0.0481;   

        }
        if (s.s.feature === 'null') {
              var d2 = $scope.sl_f;
              for (var i = 0; i < d2.length-1; i++) {
                if ( d2[i].name === s.s.name ) 
                  s.f.mets = d2[i].Mets;
              }                                                           
        }
        if (s.f.mets <= 0) s.f.mets = 0;
    }

    //Set 計劃日期、$index
    $scope.to_p = function(k,pid,d) {
      $scope.k = k;
      $scope.pid = pid;
      $scope.pd = d;
      console.log($scope.timedata.end+1)
      $state.go('plan');
    }  
    // 清除選項資料
    $scope.clearadd_sport = function(v){
      $scope.timedata.start = null;
      $scope.timedata.end = null;
      $scope.timedata.total = null;
      $scope.sportoption.f = {
        feature:null,
        cost: null,
        mets: null,
      }
      if (v != 1) 
          $scope.sportoption.s = null;
    }

    //------- slidetab function --------

    $scope.slideChange = function(v) {
      $scope.sptab.v = v ;
    }    
    $scope.nextb = function(){
      if ( !$scope.sportoption.s) {
        var alertPopup = $ionicPopup.alert({
           template: '<h3 class=" center ">你尚未選擇運動項目</h3>',
           okText: '確定',
           okType: 'button button-calm'
        });
      }else{
          $scope.n.n = !$scope.n.n;
          $scope.clearadd_sport(1);
      }
    }
    //-------slidetab function end------

    //  新增活動
    $scope.add_activity = function() {
      var t = $scope.timedata;
      var so = $scope.sportoption;

      if (t.start && t.end && t.total && so.s ) {
        //  如果計劃不存在
        if ($scope.k == null) {
          var sp = {
            pname : '運動計劃 ',
            pdate : new Date(),
            pbr_in : '',
            p_total_cal : 0,
            psplist : [],
          }
          $scope.init_plan(sp);

        };
        $scope.init_activity($scope.k,$scope.pid,so);
        if (t.dat) {

        };

        $scope.modal.hide(); 
        $state.go('plan')      
      }else {
        var alertPopup = $ionicPopup.alert({
           template: '<h3 class=" center ">你尚未選擇輸入資料</h3>',
           okText: '確定',
           okType: 'button button-calm'
        });
      }
    }

    $scope.init_activity = function( k, pid, so) {
        var t = $scope.timedata;
        var y = $scope.basedata.plan_list[k][pid].pdate.getFullYear();
        var m = $scope.basedata.plan_list[k][pid].pdate.getMonth();
        var d = $scope.basedata.plan_list[k][pid].pdate.getDate();
        t.start.setFullYear(y,m,d);
        t.end.setFullYear(y,m,d);
        $scope.basedata.plan_list[k][pid].psplist.push({
          sname : so.s.name,
          sstart : t.start,
          send :  t.end,
          sfeature : so.f,
          scal :　(so.f.cost/60) * so.f.mets * $scope.basedata.weight
        });
        $scope.basedata.plan_list[k][pid].p_total_cal += (so.f.cost/60) * so.f.mets * $scope.basedata.weight;   
    }

    //  新增計劃
    $scope.add_plan = function() {
      $scope.selectSp = {
        pname : '運動計劃 ',
        pdate : new Date(),
        pbr_in : '',
        p_total_cal : 0,
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
                $scope.init_plan($scope.selectSp );
              }
            }
          ]
        });  
    };

    $scope.init_plan = function(sp) {
      var bd = $scope.basedata;
      var ym = '';
      if ((sp.pdate.getMonth()+1) < 10) 
          ym = sp.pdate.getFullYear() + ' / 0' + (sp.pdate.getMonth()+1)        
      else
          ym = sp.pdate.getFullYear() + ' / ' + (sp.pdate.getMonth()+1)    

      if (sp.pname && sp.pdate) {
            if (bd.plan_list[ym]) {
              for (var i = 0; i < bd.plan_list[ym].length-1; i++) {
                if (bd.plan_list[ym][i].pdate === sp.pdate) 
                  alert('此日期的計劃已存在');
                else
                  bd.plan_list[ym].push(sp)  
              };                  
            }else{                 
                bd.plan_list[ym] = [];  //   a = { 'ym' : [] }
                bd.plan_list[ym].push(sp);
            };        
      };  

          var ym = '';
          if ((sp.pdate.getMonth()+1) < 10) 
            ym = sp.pdate.getFullYear() + ' / 0' + (sp.pdate.getMonth()+1)        
          else
            ym = sp.pdate.getFullYear() + ' / ' + (sp.pdate.getMonth()+1)
          $scope.k = ym;
          $scope.pid = $scope.basedata.plan_list[$scope.k].length-1;
          $scope.pd = sp.pdate;            

    }
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

            //-------------------Food-------------------------
            //
            $scope.addfoodM = function() {

                if ($scope.findValue(new Date())) {
                    $scope.basedata.food_list.push({
                        fdate: new Date(),
                        fcaltotal: 0,
                        fitem: []
                    })
                }

                $scope.appfitem($scope.fid, '便當');
                $scope.appfdetails($scope.fid, $scope.fitemid, '青菜', 100);
                $scope.appfdetails($scope.fid, $scope.fitemid, '白飯', 200);

                $scope.appfitem($scope.fid, '晚餐-便當');
                $scope.appfdetails($scope.fid, $scope.fitemid, '白飯', 200);
                $scope.appfdetails($scope.fid, $scope.fitemid, '雞腿', 400);

            };

            $scope.findValue = function(date) {
                var boolean = true;

                $scope.fid = $scope.basedata.food_list.length;

                for (var i = $scope.basedata.food_list.length - 1; i >= 0; i--) {
                    if ($scope.basedata.food_list[i].fdate.getDate() === date.getDate()) {
                        $scope.fid = i;
                        boolean = false;
                    }
                }
                return boolean;
            };

            $scope.appfcaltotal = function(fid, cal) {
                $scope.basedata.food_list[fid].fcaltotal += cal;
            };

            $scope.appfitemcal = function(fid, fitemid, cal) {
                $scope.basedata.food_list[fid].fitem[fitemid].cal += cal;
                $scope.appfcaltotal($scope.fid, cal);
            };

            $scope.appfitem = function(fid, iname) {
                $scope.fitemid = $scope.basedata.food_list[fid].fitem.length;
                $scope.basedata.food_list[fid].fitem.push({
                    name: iname,
                    cal: 0,
                    fdetails: []
                });
            };

            $scope.appfdetails = function(fid, fitemid, iname, ical) {
                $scope.basedata.food_list[fid].fitem[fitemid].fdetails.push({
                    name: iname,
                    cal: ical,
                });
                $scope.appfitemcal(fid, fitemid, ical);
            };

            $scope.to_f = function(fid, fitemid) {
                $scope.fid = fid;
                $scope.fitemid = fitemid;
                $state.go('fooditem');
            }
    }])
})();

