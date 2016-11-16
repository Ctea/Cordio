// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function () {
  "use strict";
  var db = null;
var ionicApp = angular.module('mainApp', ['ionic', 'ngCordova', 'ion-floating-menu', 'ui.sortable', 'services','firebase','ngCordovaOauth' , 'angular-timeline','angular-scroll-animate', 'tabSlideBox', 'ui.scroll'])
.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      $ionicPopup.confirm({
        title: 'System warning',
        template: 'are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);

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
    
    // SQLite
    if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "my.db" }); //device
      console.log("Android");
    }else{
      db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
      console.log("browser");
    }
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");

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
                  $scope.setTitle($scope.basedata.plan_list[$scope.key.k][$scope.key.pid].pname);
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
.controller ("mainController", ['$scope', '$http', '$state', '$cordovaOauth', '$rootScope', '$ionicPopover', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$ionicPopup', '$ionicModal', '$timeout', '$ionicLoading', '$ionicActionSheet', '$ionicTabsDelegate', '$ionicScrollDelegate', '$location', '$cordovaSQLite',function($scope, $http, $state, $cordovaOauth, $rootScope, $ionicPopover, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicPopup, $ionicModal, $timeout, $ionicLoading, $ionicActionSheet, $ionicTabsDelegate, $ionicScrollDelegate, $location, $cordovaSQLite) {
  
  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };
  
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  
  $scope.items = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },];

       $scope.insert = function(firstname, lastname) {
            var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
            $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        }
     
        $scope.select = function(lastname) {
            var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
            $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
                if(res.rows.length > 0) {
                    console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
                } else {
                    console.log("No results found");
                }
            }, function (err) {
                console.error(err);
            });
        }

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

      $scope.write = function(){
            var v = firebase.database().ref('user_data/aa/')
            v.on('value', function(data){
                console.log(data.val().age)
            })
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
        $scope.se.k = null;
        $scope.se.m = null;
        $scope.search.name = null;
        $scope.clearadd_sport(0)
        $scope.modal.show();
 /*     $location.hash(id);
        $ionicScrollDelegate.anchorScroll();*/
    }
    $scope.$on('modal.hidden', function() {
      $scope.if_edit = false;
    });

    $ionicModal.fromTemplateUrl('templates/activity/add_Sport.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });

  // -----------------  add_Sport  ----------------- 
      $scope.key = {
        k : null,
        pid : null,
        pd : null,
      }
    //Set 計劃日期、$index
    $scope.to_p = function(k,pid,d) {
      $scope.key = {
        k : k,
        pid : pid,
        pd : d,
      }
      $scope.se.k = k;
      $scope.se.m = $scope.basedata.plan_list[$scope.key.k][pid];
      $state.go('plan');
    }  
    // 清除選項資料
    $scope.clearadd_sport = function(v){
      $scope.sportoption.f = {
        feature:null,
        cost: null,
        mets: null,
      }
  
      if (v != 1) {
        $scope.sportoption.s = null;
        $scope.timedata.start = null;
        $scope.timedata.end = null;
        $scope.timedata.total = null;
        $scope.se.k = null;
        $scope.se.m = null;
      }          
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
    $scope.se = {
      k : null,
      m : null,
    }

    $scope.setpid = function(){
      if ($scope.se.k != null & $scope.se.m != null) {
        $scope.key.k = $scope.se.k.$key;
        $scope.key.pd = $scope.se.m.pdate;
        $scope.key.pid = $scope.basedata.plan_list[$scope.key.k].indexOf($scope.se.m);
      };
    }
    // Set Mets
    $scope.setf = function(){
      var f =  $scope.sportoption.f;
      var select = $scope.sport_selectoption.f;
      var tmp = select.Remark;
      f.mets = select.Mets;
      f.feature = tmp;
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


    //  新增活動
    $scope.add_activity = function() {
        var t = $scope.timedata;
        var so = $scope.sportoption;  
        if (t.start && t.end && t.total && so.s ) {
          if (!$scope.if_edit) {
              $scope.setpid();
                
                //  如果計劃不存在
                if ($scope.key.k === null) {
                  var sp = {
                    pname : '運動計劃 ',
                    pdate : new Date(),
                    pbr_in : '',
                    p_total_mets : 0,
                    psplist : [],
                  }
                  $scope.init_plan(sp);
                };
                var pdate = $scope.basedata.plan_list[$scope.key.k][$scope.key.pid].pdate;
                var y = pdate.getFullYear();
                var m = pdate.getMonth();
                var d = pdate.getDate();
                var z = pdate.getTimezoneOffset();
                var ndt = new Date(y,m,d,z/(-60),0,0);
                
                if (t.day) {
                  var e_total = (t.end.getHours()*60 + t.end.getMinutes());
                  var s_total = (t.total - e_total);  
                  $scope.init_activity($scope.key.k, $scope.key.pd, so, new Date(t.start.getTime()+ndt.getTime()), new Date(t.start.getTime()+s_total*60000+ndt.getTime()), s_total);          
                  $scope.actOver(t, so, e_total, ndt)
                }else{
                  $scope.init_activity($scope.key.k, $scope.key.pd, so,new Date(t.start.getTime()+ndt.getTime()), new Date(t.end.getTime()+ndt.getTime()), t.total)
                }

                $scope.modal.hide(); 
          }else{ 
                $scope.basedata.plan_list[$scope.key.k][$scope.key.pid].psplist[$scope.tmp.aid] = {
                  sname : so.s.name,
                  sstart : t.start,
                  send :  t.end,
                  sfeature : so.f,
                  smets :　(so.f.cost/60) * so.f.mets 
                } 
                $scope.basedata.plan_list[$scope.key.k][$scope.key.pid].p_total_mets += (so.f.cost/60) * so.f.mets ; 
                $scope.modal.hide(); 
          }                    
        }else {
            var alertPopup = $ionicPopup.alert({
               template: '<h3 class=" center ">你尚未選擇輸入資料</h3>',
               okText: '確定',
               okType: 'button button-calm'
            });
        }
   

    }

    $scope.init_activity = function( k, pd, so, start, end, total) {
        var t = $scope.timedata;
        var tmpso = angular.copy(so);
        tmpso.f.cost = total; 
        for (var i = 0; i < $scope.basedata.plan_list[k].length; i++) {
          if ($scope.basedata.plan_list[k][i].pdate.getDate() === pd.getDate()) {
            $scope.basedata.plan_list[k][i].psplist.push({
              sname : so.s.name,
              sstart : start,
              send :  end,
              sfeature : tmpso.f,
              smets :　(tmpso.f.cost/60) * tmpso.f.mets 
            });
            $scope.basedata.plan_list[k][i].p_total_mets += (tmpso.f.cost/60) * tmpso.f.mets ; 
            return true;
          };
        };   
    }

    $scope.actOver = function(t, so, total, ndt){              
          var date = new Date(ndt.getTime() + (1000*60*60*24));
          var ym = '';
            if ((date.getMonth()+1) < 10) 
                ym = date.getFullYear() + ' / 0' + (date.getMonth()+1)        
            else
                ym = date.getFullYear() + ' / ' + (date.getMonth()+1)
          var sp = {
            pname : '運動計劃 ',
            pdate : date,
            pbr_in : '',
            p_total_mets : 0,
            psplist : [],
          }
          $scope.init_plan(sp);
          $scope.init_activity(ym, date, so, new Date(t.end.getTime()+ndt.getTime()-(total*60000)), new Date(t.end.getTime()+ndt.getTime()), total);              
    }

    //  新增計劃
    $scope.add_plan = function() {
      $scope.selectSp = {
        pname : '運動計劃 ',
        pdate : new Date(),
        pbr_in : '',
        p_total_mets : 0,
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
      var ym = '';
      if ((sp.pdate.getMonth()+1) < 10) 
          ym = sp.pdate.getFullYear() + ' / 0' + (sp.pdate.getMonth()+1)        
      else
          ym = sp.pdate.getFullYear() + ' / ' + (sp.pdate.getMonth()+1)    

      if (sp.pname && sp.pdate) {
            if ($scope.basedata.plan_list[ym]) {
              var t = false;
              for (var i = 0; i <= $scope.basedata.plan_list[ym].length-1; i++) {    
                if ($scope.basedata.plan_list[ym][i].pdate.getDate() === sp.pdate.getDate()) {
                  console.log('此日期的計劃已存在');           
                  t = true;
                  return true;
                }              
              }; 
              if(!t) {
                  $scope.basedata.plan_list[ym].push(sp);
              }                   
            }else{             
                $scope.basedata.plan_list[ym] = [];  //   a = { 'ym' : [] }
                $scope.basedata.plan_list[ym].push(sp);           
            };        
      };

        $scope.key.k = ym;
        $scope.key.pid = $scope.basedata.plan_list[ym].length-1;
        $scope.key.pd = sp.pdate;
    
    }

    $scope.if_edit = false;
    $scope.edit_plan = function(k , pid) {
        var plan = $scope.basedata.plan_list[k][pid];
        $scope.selectSp = {
            pname : plan.pname,
            pdate : plan.pdate,
            pbr_in : plan.pbr_in,
            p_total_mets : plan.p_total_mets,
            psplist : plan.psplist,
        }
        var myPopup = $ionicPopup.show({
          cssClass: '',
          templateUrl: 'templates/activity/addS.html',
          title: '<h3>設定名稱與日期</h3>',
          subTitle: 'Edit a plan and choose a day',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Edit</b>',
              type: 'button-positive',
              onTap: function(e) {
                var ym = '';
                if (($scope.selectSp.pdate.getMonth()+1) < 10) 
                    ym = $scope.selectSp.pdate.getFullYear() + ' / 0' + ($scope.selectSp.pdate.getMonth()+1)        
                else
                    ym = $scope.selectSp.pdate.getFullYear() + ' / ' + ($scope.selectSp.pdate.getMonth()+1)    
                
                var tmps = {
                    pname : $scope.selectSp.pname,
                    pdate : $scope.selectSp.pdate,
                    pbr_in : $scope.selectSp.pbr_in,
                    p_total_mets : $scope.selectSp.p_total_mets,
                    psplist : $scope.selectSp.psplist,
                } 
                if ( ym === k) {
                  $scope.basedata.plan_list[ym][pid] = tmps;
                }else{
                  $scope.basedata.plan_list[k].splice(pid,1);
                  console.log($scope.basedata.plan_list)
                  if ($scope.basedata.plan_list[k].length === 0) {
                    delete  $scope.basedata.plan_list[k];
                  };

                  $scope.basedata.plan_list[ym] = [];
                  $scope.basedata.plan_list[ym].push(tmps);              
                }
              }
            }
          ]
        });  
    }

    $scope.edit_activity = function(aid) {
        $scope.tmp = {
            aid : aid,
        } 
        $scope.if_edit = true;

        var k = $scope.key.k;
        var pid = $scope.key.pid;
        var plan = $scope.basedata.plan_list[k][pid];
        $scope.modal.show();

        $scope.n = {
          n:false
        }
        $scope.se.k = null;
        $scope.se.m = null;
        $scope.search.name = null;
        for (var i = 0; i < $scope.sl.length; i++) {
          if ($scope.sl[i].name === plan.psplist[aid].sname) {
            $scope.sportoption.s = $scope.sl[i];
            return true;
          };
        };
        $scope.timedata.start = plan.psplist[aid].sstart;
        $scope.timedata.end = plan.psplist[aid].send;
        $scope.timedata.total = plan.psplist[aid].sfeature.cost;
        for (var i = 0; i < $scope.sl_f.length; i++) {
          if ($scope.sl_f[i].Remark === plan.psplist[aid].sfeature.feature) {
              sport_selectoption.f = $scope.sl_f[i];
              $scope.setf();
              return true;
          };
        };
        $scope.basedata.plan_list[k][i].p_total_mets -= (plan.psplist[aid].sfeature.cost/60) * plan.psplist[aid].sfeature.mets ; 
    
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

