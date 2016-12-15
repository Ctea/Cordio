(function () {
  "use strict";
  var db = null;
  var ionicApp = angular.module('mainApp', ['ionic', 'ngCordova', 'ion-floating-menu', 'ui.sortable', 'services','firebase','ngCordovaOauth' , 'angular-timeline','angular-scroll-animate', 'tabSlideBox', 'ui.scroll', 'chart.js', 'LocalStorageModule'])
  .run(function($ionicPlatform, $cordovaSQLite) {
      $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();
        /**
         * 退出app
         */
        function showConfirm() {
            $ionicPopup.confirm({
                title: '提示',
                subTitle: '確定要退出程式嗎？',
                okText: '退 出',
                okType: 'button-positive',
                cancelText: '取 消'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                } 
            })
        }

        /**
         *
         * @param title 标题
         * @param content 内容
         */
        // Is there a page to go back to?
        if ($ionicHistory.backView()) {
              $ionicHistory.goBack(-1);
        } else {
            // This is the last page: Show confirmation popup
            showConfirm();
        }
        return false;
    }, 101);

    $ionicPlatform.ready(function() {

      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
        cordova.plugins.backgroundMode.enable();
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      if (window.cordova) {
          document.addEventListener("deviceready", function() {
            window.plugin.notification.local.onadd = ionicApp.onReminderAdd;
            window.plugin.notification.local.onclick = ionicApp.onReminderClick;
            window.plugin.notification.local.oncancel = ionicApp.onReminderCancel;
            window.plugin.notification.local.ontrigger = ionicApp.onReminderTrigger;
         }, false);
      }

      ionicApp.onReminderAdd = function(id, state, json) {
        $timeout(function() {
          $rootScope.$broadcast('onReminderAdded', id, state, json);
        }, 100);
      }
      // SQLite
       /* if (window.cordova) {
          db = $cordovaSQLite.openDB({ name: "my.db" }); //device
        }else{
          db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
        }
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS userd (id integer primary key,username text,basedata text)");*/
    
    });
  })
  .config(function($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider) {
      var defaultOptions = {
        location: 'no',
        clearcache: 'no',
        toolbar: 'no'
      };

      document.addEventListener("deviceready", function () {
        $cordovaInAppBrowserProvider.setDefaultOptions(options)
      }, false);

      $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'templates/home.html',
              controller: function($scope) {
                  $scope.setTitle('健康管理');
                  $scope.get_recent_date();     
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
                    controller: function($scope) {}
           })
          .state('about', {
              url: '/about',
              templateUrl: 'templates/about.html',
              controller: function($scope) {
                  $scope.setTitle("About");
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
          .state('fitbit_list', {
                url: '/fitbit_list',
                templateUrl: 'templates/fitbit/Fitbit_list.html',
                controller: function($scope) {
                    $scope.setTitle('Fitbit');
                }
            })

            .state('fitbit_item', {
                url: '/fitbit_item',
                templateUrl: 'templates/fitbit/Fitbit_item.html',
                controller: function($scope) {
                    $scope.setTitle('Fitbit');
                }
            }) 
          /*.state('add_Sport', {
              url: '/add_Sport',
              templateUrl: 'templates/activity/add_Sport.html',
              controller: function($scope) {
                  $scope.setTitle("選擇時段與活動");
              }
          })  */
          .state('knowti', {
              url: '/knowti',
              templateUrl: 'templates/know/knowti.html',
              controller: function($scope) {
                  $scope.setTitle('小常識');
              }
          })
          .state('kn-co', {
              url: '/know-co',
              templateUrl: 'templates/know/kn-co.html',
              controller: function($scope) {
                  $scope.setTitle('小常識');
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
          .state('login', {
              url: '/login',
              templateUrl: 'templates/Login.html',
              controller: function($scope) {
    
              }
          })
       $urlRouterProvider.otherwise('/');
  })
  .controller ("mainController",['$scope', '$http', '$state', '$cordovaOauth', '$rootScope', '$ionicPopover', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$ionicPopup', '$ionicModal', '$timeout', '$ionicLoading', '$ionicActionSheet', '$ionicTabsDelegate', '$ionicScrollDelegate', '$location', '$cordovaSQLite', '$cordovaInAppBrowser', 'localStorageService', '$interval', function($scope, $http, $state, $cordovaOauth, $rootScope, $ionicPopover, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicPopup, $ionicModal, $timeout, $ionicLoading, $ionicActionSheet, $ionicTabsDelegate, $ionicScrollDelegate, $location, $cordovaSQLite, $cordovaInAppBrowser, localStorageService, $interval ) {
    $scope.addNotification = function(hd) {
      if (ionic.Platform.isAndroid()) {
        var s = hd.recent_sport.sstart.getHours() + ' 點 ' + hd.recent_sport.sstart.getMinutes() ;
        window.plugin.notification.local.add({
            id: 'MYLN',
            title:   '活動通知',
            message:  s +' 的 ' + hd.recent_sport.sname+' 活動要開始了喔！',
            icon:      'ion-android-walk',
            smallIcon: 'ion-android-walk',
        });
      };
    }
    
    $interval(function(){
      $scope.get_recent_sport();
    }, 1000 * 300);
            
    /*
    $scope.br = function(){
      var options = {
        location: 'no',
        clearcache: 'no',
        toolbar: 'no'
      };

      document.addEventListener("deviceready", function () {
        $cordovaInAppBrowser.open('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=227WLD&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800',  '_self', options)
          .then(function(event) {
          })
          .catch(function(event) {
            // error
          });
      }, false);
    }

    $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
      var token = event.url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
      var url = event.url.toString();
      $scope.fitbit_data = {
          t: token,
          uid : url.substring(url.indexOf('user_id=') + 8 ,url.indexOf('&',url.indexOf('user_id')))
      }
      $cordovaInAppBrowser.close();
    });

 
    $scope.getFit = function(){
      $http.get('https://api.fitbit.com/1/user/'+ $scope.fitbit_data.uid +'/activities/date/2016-12-03.json',{
        headers:{
          "Authorization": 'Bearer '+$scope.fitbit_data.t
        }
      }).success(function(data) { 
        console.log(data);
      });
    }*/
    
    // ----------- base-data ----------------- 
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

        /*
        plan_list
        { key : 
          [{ pname
             pdate
             pbr_in
             p_total_mets
             psplist : [{
                          sname
                          start
                          send
                          sfeature
                          smets
                       }]
          }]
        }*/

        //button-style
        $scope.butsty = {
          'padding': 0,
          'text-align': 'left',
          'font-size' : '16px',
          'font-family':'微軟正黑體',
          'color': '',
        }

    // ----------- basedata function ----------------- 
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
      };
      $scope.getBMI = function(){
        var h = $scope.basedata.height/100;
        var w = $scope.basedata.weight;
        $scope.basedata.BMI =  w/(h*h);
      };
      $scope.save_basedata = function(){
        var bd = $scope.basedata
        if(bd.age != '' && bd.sex != '' && bd.height != '' && bd.width != ''){
          $scope.getBMI();
          $scope.getBMR();
          $scope.set_basedata_Firebase();
          $state.go('basedata')
        }else {
          var alertPopup = $ionicPopup.alert({
                 template: '<h3 class=" center ">請選擇輸入完整的資料</h3>',
                 okText: '確定',
                 okType: 'button button-calm'
          });
        }
            
      }   

    // ----------- Home function -----------------
        $scope.get_recent_date = function(){
          var ym = '';
          if ((new Date().getMonth()+1) < 10) 
              ym = new Date().getFullYear() + '-0' + (new Date().getMonth()+1)        
          else
              ym = new Date().getFullYear() + '-' + (new Date().getMonth()+1)  
          var d = new Date().getDate();  
          var plan_list = angular.copy($scope.basedata.plan_list)

          var fc = null
          if(!findValue(new Date())){
              fc = angular.copy($scope.totalkcal($scope.fid))
          }

          if (plan_list[ym]) {
            for (var i = 0; i < plan_list[ym].length; i++) { 
              if (plan_list[ym][i].pdate.getDate() === d) {
                $scope.home_data = {
                    pm : ym,
                    pid : i,
                    pname : plan_list[ym][i].pname,
                    pdate : plan_list[ym][i].pdate,
                    pbr_in : plan_list[ym][i].pbr_in,
                    p_total_mets : plan_list[ym][i].p_total_mets,
                    psplist : plan_list[ym][i].psplist,
                    recent_sport : null,
                    food_c : fc
                }
              }else {
                $scope.home_data = {
                    pm : ym,
                    pid : null,
                    pname : '',
                    pdate : new Date(),
                    pbr_in : '',
                    p_total_mets : 0,
                    psplist : [],
                    recent_sport : null,
                    food_c : fc
                }
              }          
            };
          }else {
            $scope.home_data = {
                    pm : ym,
                    pid : null,
                    pname : '',
                    pdate : new Date(),
                    pbr_in : '',
                    p_total_mets : 0,
                    psplist : [],
                    recent_sport : null,
                    food_c : fc
                }
          }
          $scope.get_recent_sport();
        }


        $scope.get_recent_sport = function(){
          if ($scope.home_data.psplist != null) {
          var data = $scope.home_data.psplist;
            for (var i = 0; i < data.length; i++) {
              var time = data[i].sstart.getTime() - new Date().getTime() 
              if (time <= (1000 * 600) && time > (-1000*300)) {
                $scope.home_data.recent_sport = data[i];
                $scope.addNotification(angular.copy($scope.home_data));            
              };
            };
          };
        }
    // ----------- Friebace function -----------------
        $scope.savlocSQL = function(){
          var query = "SELECT basedata FROM userd WHERE username = ?";
          $cordovaSQLite.execute(db, query, ['admin']).then(function(res) {
            if(res.rows.length == 0) {  
              var insert = "INSERT INTO userd (username, basedata) VALUES (?,?)";
              $cordovaSQLite.execute(db, insert, ['admin', JSON.stringify($scope.basedata)]).then(function(res) { 
              }, function (err) {
                console.error(err);
              });
 
            } else {
              var updata = "UPDATE userd SET basedata = ? WHERE username = ?";
              $cordovaSQLite.execute(db, updata, [JSON.stringify($scope.basedata), 'admin']).then(function(res) {
              }, function (err) {
                console.error(err);
              }); 
            }
          }, function (err) {
            console.error(err);       
          });
            
        }
        $scope.sellocSQL = function(){
          var query = "SELECT basedata FROM userd WHERE username = ?";
          $cordovaSQLite.execute(db, query, ['admin']).then(function(res) {
            if(res.rows.length > 0) {
              $scope.basedata = JSON.parse(res.rows[0].basedata);
            } else {
               console.log("No results found");
            }
          }, function (err) {
            console.error(err);       
          });    
        }
        
        $scope.set_basedata_Firebase = function(){
          var user = firebase.auth().currentUser;
          if (user != null) {
            var userId = user.uid;
            var starCountRef ='user_data/'
            var bd = $scope.basedata;
            angular.forEach(bd, function(v, k){

              if (k != 'plan_list' & k != 'food_list') {
                if ( v ) {
                  var f = firebase.database().ref(starCountRef+userId+'/'+k).set(v)
                };
              };
            })
 
          } 
        }
        $scope.set_plan_Firebase = function(){
          var user = firebase.auth().currentUser;
          if (user != null) {
            var userId = user.uid;
            var starCountRef ='user_data/'
            var planlist = $scope.basedata.plan_list
              angular.forEach(planlist, function(pval, pkey){
                  for (var i = 0; i < pval.length; i++) {
                      firebase.database().ref(starCountRef+userId+'/plan_list/'+pkey+'/'+ i).update({
                        pname : pval[i].pname,
                        pdate : pval[i].pdate.getTime(),
                        pbr_in : pval[i].pbr_in,
                        p_total_mets : pval[i].p_total_mets,
                      });
                  };                    
              })  
          } 
        }


        $scope.set_activity_Firebase = function(k, pid){
          var user = firebase.auth().currentUser;
          if (user != null) {
            var userId = user.uid;
            var starCountRef ='user_data/'
            var totalmet = angular.copy($scope.basedata.plan_list[k][pid].p_total_mets)
            var psplist = angular.copy($scope.basedata.plan_list[k][pid].psplist)
            for (var i = 0; i < psplist.length; i++) {
              firebase.database().ref(starCountRef+userId+'/plan_list/'+ k +'/'+ pid +'/psplist/'+i).update({
                sname    : psplist[i].sname,
                sstart   : psplist[i].sstart.getTime(),
                send     : psplist[i].send.getTime(),
                sfeature : psplist[i].sfeature,
                smets    : psplist[i].smets
              });  
            };     
            firebase.database().ref(starCountRef+userId+'/plan_list/'+k+'/'+ pid).update({
              p_total_mets : totalmet
            })       
          } 
        }
        $scope.set_food_Firebase = function(id){
          var user = firebase.auth().currentUser;
          if (user != null) {
            var userId = user.uid;
            var starCountRef ='user_data/'
            var food = angular.copy($scope.basedata.food_list[id])
            angular.forEach(food, function(v, k){
              var tmp = v
              if (k === 'fdate') 
                tmp = v.getTime();
              firebase.database().ref(starCountRef+userId+'/food_list/'+ id +'/'+k).update(tmp)
            })     
          } 
        }

        $scope.remove_plan_Firebase = function(k, pid){
          var user = firebase.auth().currentUser;
          if (user != null) {
            var userId = user.uid;
            var adaRef = firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+pid);
            adaRef.remove()
              .then(function() {
                var ref = firebase.database().ref('user_data/'+userId+'/plan_list/'+k)
                ref.once('value').then(function(data){
                  if(data.exists()){
                    var n = 0;
                    firebase.database().ref('user_data/'+userId+'/plan_list/'+k).set({});
                    angular.forEach( data.val(), function(v ,key){
                      firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+n).set({
                          pname : v.pname,
                          pdate : v.pdate,
                          pbr_in : v.pbr_in,
                          p_total_mets : v.p_total_mets,
                          psplist : v.psplist || []
                      })
                      n++;
                    })
                  }
                });
              })
              .catch(function(error) {
              });           
          } 
        }
        $scope.remove_activity_Firebase = function(k, pid, aid){
          var user = firebase.auth().currentUser;
          if (user != null) {     
            var userId = user.uid;
            var adaRef = firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+pid+'/psplist/'+aid);
            adaRef.remove()
              .then(function() {
                firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+ pid).update({
                  p_total_mets : $scope.basedata.plan_list[k][pid].p_total_mets,
                })
                var ref = firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+pid+'/psplist/')
                ref.once('value').then(function(data){
                  if(data.exists()){
                    firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+pid+'/psplist/').set({})
                    for (var i = 0; i < data.val().length; i++) {
                      firebase.database().ref('user_data/'+userId+'/plan_list/'+k+'/'+pid+'/psplist/'+i).set({
                          sname    : $scope.basedata.plan_list[k][pid].psplist[i].sname,
                          sstart   : $scope.basedata.plan_list[k][pid].psplist[i].sstart,
                          send     : $scope.basedata.plan_list[k][pid].psplist[i].send,
                          sfeature : $scope.basedata.plan_list[k][pid].psplist[i].sfeature,
                          smets    : $scope.basedata.plan_list[k][pid].psplist[i].smets
                      })
                    };
                  }
                });
              })
              .catch(function(error) {
              });           
          } 
        }

        $scope.remove_food_Firebase = function(id, fid){
            var user = firebase.auth().currentUser;
          if (user != null) {     
            var userId = user.uid;
            var fitem = firebase.database().ref('user_data/'+userId+'/food_list/'+id+'/fitem/'+fid);
            fitem.remove()
              .then(function() {
                var ref = firebase.database().ref('user_data/'+userId+'/food_list/'+id+'/fitem/');
                ref.once('value').then(function(data){
                  if(data.exists()){
                    firebase.database().ref('user_data/'+userId+'/food_list/'+id+'/fitem').set({})
                    for (var i = 0; i < data.val().length; i++) {
                      firebase.database().ref('user_data/'+userId+'/food_list/'+id+'/fitem/'+i).set($scope.food_list[id].fitem[i])
                    };
                  }
                });
              })
              .catch(function(error) {
              });           
          } 
        }

        $scope.select_Firebase = function(){
          var user = firebase.auth().currentUser;
          if (user != null) { 
            var userId =user.uid
            var bd = $scope.basedata
            var starCountRef = firebase.database().ref('user_data/'+userId+'/'); 
            starCountRef.once('value').then(function(data){
              if( data.exists() ){
                $scope.$apply(function() {
                  $scope.basedata = {
                    sex : data.child('sex').val(),
                    age : data.child('age').val(),
                    height : data.child('height').val(), 
                    weight : data.child('weight').val(), 
                    BMI : data.child('BMI').val(),  
                    min_BMR : data.child('min_BMR').val(),     
                    max_BMR : data.child('max_BMR').val(),
                    plan_list : data.child('plan_list').val() || {},    
                    food_list : [] 
                  };
                  if (data.child('plan_list').exists()) {
                    angular.forEach(data.child('plan_list').val(), function(pval,pkey){ 
                      $scope.basedata.plan_list[pkey] = []; 
                      for (var i = 0; i < pval.length; i++) {
                        $scope.basedata.plan_list[pkey].push({
                          pname : pval[i].pname,
                          pdate : new Date(pval[i].pdate),
                          pbr_in : pval[i].pbr_in,
                          p_total_mets : pval[i].p_total_mets,
                          psplist : pval[i].psplist || []
                        }) 

                        if (data.child('plan_list/'+pkey+'/'+i+'/psplist/').exists()) {
                          var l = pval[i].psplist.length
                          for (var j = 0; j < l ; j++) {
                              $scope.basedata.plan_list[pkey][i].psplist[j].sstart = new Date(data.child('plan_list/'+pkey+'/'+i+'/psplist/'+j).child('sstart').val())
                              $scope.basedata.plan_list[pkey][i].psplist[j].send = new Date(data.child('plan_list/'+pkey+'/'+i+'/psplist/'+j).child('send').val())
                          }
                        };           
                        if ($scope.basedata.plan_list[pkey][i].pdate.getDate() === new Date().getDate()) { 
                          $scope.key = {
                            k : pkey,
                            pid : i,
                            pd : $scope.basedata.plan_list[pkey][i].pdate,
                          }
                        };   
                      };       
                    })    
                  };
                });
                $scope.$apply(function(){
                  $scope.get_recent_date();
                })  
              };
            });                  
          } 
        };

        $scope.select_food_Firebase = function(){
          var user = firebase.auth().currentUser;
          if (user != null) { 
            var userId =user.uid
            var starCountRef = firebase.database().ref('user_data/'+userId+'/'); 
            starCountRef.once('value').then(function(data){
              angular.forEach(data.val(), function(v, k){
                if ($scope.basedata.food_list!= null) {
                  var tmp = v;
                  if (k === 'pdate') {
                    tmp = new Date(v);
                  };
                  $scope.basedata.food_list.push(tmp)
                };      
              })
            })
          }
        }


    // ----------- get data ----------------- 

        $scope.sl= [];       //資料列表
        $scope.sl_f= [];     //強度列表
        $scope.s_tabs = {};  //運動分類

        //取得JSON資料
        $http.get('sl.json').success(function(data) { 
            $scope.sl = data.table1;
            $scope.sl_f = data.table2;
            for (var i = 0; i < $scope.sl.length; i++) {
                 $scope.s_tabs[$scope.sl[i].type] = $scope.sl[i].type;        
            };  
        });
        $scope.fd; //食物列表
        $scope.dsdasd = 200;
        $http.get('food.json').success(function(data) {
                $scope.fd = (data);
        });
        $scope.kn =[] ;
        $http.get('templates/know/know.json').success(function(know) { 
           $scope.kn = know.know
        });

        /*$http.get('http://localhost/data/json').success(function(spty) { 
            $scope.sl = spty;
            for (var i = 0; i < $scope.sl.length; i++) {
                 $scope.s_tabs[$scope.sl[i].type] = $scope.sl[i].type;        
            };

        });
        $http.get('http://localhost/data/json2').success(function(spli) { 
            $scope.sl_f = spli;

        });
        $http.get('http://localhost/data/json3').success(function(know) { 
            
            $scope.kn = know;
        });*/
           
    // ----------- login -----------------
      $scope.userinfo = {
            name : '未登入帳號',
            photoURL : 'img/admin.jpg'
      };

      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {        
            //getUserinfo
            var user = firebase.auth().currentUser;
              if (user != null) {
                $scope.$apply(function(){
                  var info = {
                    providerId : user.providerId,
                    uid : user.uid,
                    name : user.displayName,
                    email : user.email,
                    photoURL : user.photoURL
                  };  
                  $scope.loging = true;
                  $scope.userinfo = info;
                  $scope.select_Firebase(); 
                });
                $state.go('home')
              }      
          } else {
            $scope.loging = false;
            $state.go('login')
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

      $scope.facebookLogin = function() {
          var provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('email');
          if(ionic.Platform.isWebView()){
                return $cordovaOauth.facebook('1836055233346017', ["email"]).then(function (result) {
                    var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
                    return firebase.auth().signInWithCredential(credential);
                }, function(error) {
                    console.log("ERROR: " + error);
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
          $scope.$apply(function(){
            $scope.userinfo = {
              name : '未登入帳號',
              photoURL : 'img/admin.jpg'
            };
          }) 
        }, function(error) {
          // An error happened.
        });
        $scope.toggleLeftSideMenu();
      }      

    // ----------- radio but controll ------------- 
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
    
    // ----------- time ----------------- 
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
            else{
                t.end = new Date(t.end.getTime() + 86400000); //24*60*60000
                t.total = ((t.end - t.start) / 60000);
            }           
            $scope.timetotalOver();
      }
      $scope.timetotalOver = function() {
           var t = $scope.timedata
            if (t.total >= 300) {
                t.total = 300
               /* t.total = t.total - (Math.floor(t.total / 1440) * 1440);*/
                t.end = new Date(t.start.getTime() + (t.total * 60000));
            }
      }

    // ----------- add_sport modal -----------------
      $scope.search = {
        name : ''
      }
      $scope.modal_show = function(){
          $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced"></ion-spinner>',
          }).then(function(){  
            $scope.modal.show();   
          });
          $scope.se.k = null;
          $scope.se.m = null;
          $scope.search.name = null;
          $scope.clearadd_sport(0)
          $scope.n = {
            n : true
          }
      }
      $scope.$on('modal.shown', function() {
        $ionicLoading.hide(); 
      });
    
      $scope.$on('modal.hidden', function() {
        $scope.if_edit = false;
      });

      $ionicModal.fromTemplateUrl('templates/activity/add_Sport.html', {
          scope: $scope,
      }).then(function(modal) {
          $scope.modal = modal;
      });

    // ----------- plan_setting modal ----------
      $scope.key_sort = {
        m : '-$key',
        d : '-pdate'
      }
      
      $ionicModal.fromTemplateUrl('templates/activity/plan_setting_modal.html', {
          scope: $scope,
      }).then(function(modal) {
          $scope.plan_setting_modal = modal;
      });

    // ----------- add_Sport  -----------------
      //選擇的運動項目
      $scope.sportoption = {
        s:null,
        f:{ 
          strength:null,
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
          strength:null,
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
      };

      $scope.setpid = function(){
        if ($scope.se.k != null & $scope.se.m != null) {
          $scope.key.k = $scope.se.k.$key;
          $scope.key.pd = $scope.se.m.pdate;
          $scope.key.pid = $scope.basedata.plan_list[$scope.key.k].indexOf($scope.se.m);
        };
      };

      // Set Mets
      $scope.setf = function(){
        var f =  angular.copy($scope.sportoption.f);
        var select = angular.copy($scope.sport_selectoption.f);
        var tmp = select.Remark;
        f.mets = select.Mets;
        f.feature = tmp;
      };

      $scope.setMets = function(){
          var s =  $scope.sportoption;
          s.f.cost = angular.copy($scope.timedata.total)  ;
          s.f.strength = s.s.feature;
          if (s.f.cost != null && s.f.feature != null) {
            var x = (s.f.feature / 1000.0) / (s.f.cost / 60.0);
              if (s.s.feature === "length") { 
                if (s.s.name === "跑步")  s.f.mets = 0.0022 * Math.pow(x,3) - 0.0688 * Math.pow(x,2) + 1.4548 * x - 0.1089;
                  
                if (s.s.name === "散步")  s.f.mets = 0.0332 * Math.pow(x,3) - 0.3283 * Math.pow(x,2) + 1.5577 * x + 0.0102;             
                
                if (s.s.name === "散步爬坡")  s.f.mets = 0.0641 * Math.pow(x,2) + 0.7125 * x;
                            
                if (s.s.name === "騎自行車")  s.f.mets = 0.001 * Math.pow(x,3) - 0.0363 * Math.pow(x,2) + 0.6965 * x - 0.0893;
         
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
      };


      //  新增活動
      $scope.add_activity = function() {
          var t = $scope.timedata;
          var so = $scope.sportoption;  
          var equ = null;
          if (so.s.feature === "length" || so.s.feature === "Watt")
            equ = (t.start && t.end && t.total && so.s && so.f.feature);
          else if (so.s.feature === "Strength")
            equ = (t.start && t.end && t.total && so.s && $scope.sport_selectoption.f);
          else
            equ = (t.start && t.end && t.total && so.s);

          if (equ) {
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
                  so.f.cost = t.total;
                  $scope.basedata.plan_list[$scope.key.k][$scope.key.pid].psplist[$scope.tmp.aid] = {
                    sname : so.s.name,
                    sstart : t.start,
                    send :  t.end,
                    sfeature : so.f,
                    smets :　(so.f.cost/60) * so.f.mets 
                  } 
                  $scope.basedata.plan_list[$scope.key.k][$scope.key.pid].p_total_mets += (so.f.cost/60) * so.f.mets - $scope.ed.total_met; 
                  $scope.modal.hide(); 
            }   
            $scope.set_activity_Firebase($scope.key.k, $scope.key.pid);                      
          }else {
              var alertPopup = $ionicPopup.alert({
                 template: '<h3 class=" center ">你尚未選擇輸入資料</h3>',
                 okText: '確定',
                 okType: 'button button-calm'
              });
          }  
           
      };

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
          $scope.get_recent_sport()
      };

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
              { text: '取消' },
              {
                text: '<b>確認</b>',
                type: 'button-positive',
                onTap: function(e) {
                  $scope.init_plan($scope.selectSp );
                  $scope.set_plan_Firebase();  
                }
              }
            ]
          });
      };

      $scope.init_plan = function(sp) {
        var ym = '';
        if ((sp.pdate.getMonth()+1) < 10) 
            ym = sp.pdate.getFullYear() + '-0' + (sp.pdate.getMonth()+1)        
        else
            ym = sp.pdate.getFullYear() + '-' + (sp.pdate.getMonth()+1)    

        if (sp.pname && sp.pdate) {
              if ($scope.basedata.plan_list[ym]) {
                var t = false;
                for (var i = 0; i <= $scope.basedata.plan_list[ym].length-1; i++) {    
                  if ($scope.basedata.plan_list[ym][i].pdate.getDate() === sp.pdate.getDate()) {  
                    var alertPopup = $ionicPopup.alert({
                       template: '<h3 class=" center ">此日期的計劃已存在</h3>',
                       okText: '確定',
                       okType: 'button button-calm'
                    });        
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
          $scope.get_recent_date();
      };

      // 修改計劃 活動
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
                      ym = $scope.selectSp.pdate.getFullYear() + '-0' + ($scope.selectSp.pdate.getMonth()+1)        
                  else
                      ym = $scope.selectSp.pdate.getFullYear() + '-' + ($scope.selectSp.pdate.getMonth()+1)    
                  
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
                    $scope.del_plan(k, pid);   
                    if (!$scope.basedata.plan_list[ym]) 
                        $scope.basedata.plan_list[ym] = [];
                    $scope.basedata.plan_list[ym].push(tmps);              
                  }

                  $scope.set_plan_Firebase();
                }
              }
            ]
          }); 
      };
      $scope.edit_activity = function(aid) {
        
          var k = $scope.key.k;
          var pid = $scope.key.pid;
          var plan = angular.copy($scope.basedata.plan_list[k][pid]);
          $scope.ed = {
            total_met : angular.copy((plan.psplist[aid].sfeature.cost/60) * plan.psplist[aid].sfeature.mets)
          }  
          $scope.if_edit = true;
          $scope.tmp = {
              aid : aid,
          }
          $scope.modal.show();
          $scope.n = {
            n : false
          }
          $scope.se = {
            k : null,
            m : null,
          } 
          $scope.search.name = null;
          $scope.timedata.start = plan.psplist[aid].sstart;
          $scope.timedata.end = plan.psplist[aid].send;
          $scope.timedata.total = plan.psplist[aid].sfeature.cost;
          $scope.sportoption.f = plan.psplist[aid].sfeature
     
          for (var i = 0; i < $scope.sl.length; i++) {
            if ($scope.sl[i].name === plan.psplist[aid].sname) {
              $scope.sportoption.s = $scope.sl[i];
              return true;
            };
          };
          for (var i = 0; i < $scope.sl_f.length; i++) {
            if ($scope.sl_f[i].Remark === plan.psplist[aid].sfeature.strength) {
                $scope.sport_selectoption.f = $scope.sl_f[i];
                $scope.setf();
                return true;
            };
          };
                  
      };

      //  刪除計劃  活動
      $scope.del_plan = function(k, pid){
        var confirmPopup = $ionicPopup.confirm({
           title: '刪除警告',
           template: '確定要刪除此計劃嗎？',
           okType: 'button-assertive'
        });

        confirmPopup.then(function(res) {
          if(res) {
            $scope.basedata.plan_list[k].splice(pid,1);
            if ($scope.basedata.plan_list[k].length === 0) 
              delete  $scope.basedata.plan_list[k]; 
            $scope.key = {
                k : null,
                pid : null,
                pd : null,
            }
            $scope.remove_plan_Firebase(k, pid);
          } 
        }); 
             
      };
      $scope.del_activity = function(aid){
        var confirmPopup = $ionicPopup.confirm({
           title: '刪除警告',
           template: '確定要刪除此活動嗎？',
           okType: 'button-assertive'
        });
        confirmPopup.then(function(res) {
          if(res) {
            var k = $scope.key.k;
            var pid = $scope.key.pid;
            var plan = $scope.basedata.plan_list[k][pid]; 
            plan.p_total_mets -= (plan.psplist[aid].sfeature.cost/60) * plan.psplist[aid].sfeature.mets ; 
            plan.psplist.splice(aid,1); 
            $scope.remove_activity_Firebase(k, pid, aid);
          } 
        });    
      };

      //跨天處理
      $scope.actOver = function(t, so, total, ndt){              
            var date = new Date(ndt.getTime() + (1000*60*60*24));
            var ym = '';
              if ((date.getMonth()+1) < 10) 
                  ym = date.getFullYear() + '-0' + (date.getMonth()+1)        
              else
                  ym = date.getFullYear() + '-' + (date.getMonth()+1)
            var sp = {
              pname : '運動計劃 ',
              pdate : date,
              pbr_in : '',
              p_total_mets : 0,
              psplist : [],
            }
            $scope.init_plan(sp);
            $scope.init_activity(ym, date, so, new Date(t.end.getTime()+ndt.getTime()-(total*60000)), new Date(t.end.getTime()+ndt.getTime()), total);              
      };

    //-------------------easy_food-------------------------
            $scope.addeasy_food = function() {

                $scope.easy_food = {
                    fname: '',
                    fdate: new Date(),
                    fkcal: 0,
                }

                var easy_foodPopup = $ionicPopup.show({
                    cssClass: '',
                    templateUrl: 'templates/food/addeasyfood.html',
                    title: '<h3>輸入名稱、時間、熱量</h3>',
                    scope: $scope,
                    buttons: [
                        { text: '返回' }, {
                            text: '<b>新增</b>',
                            type: 'button-positive',
                            onTap: function(e) {

                                var t = $scope.easy_food;
                                var name = t.fname;
                                if (name && t.fdate && t.fkcal && findName(t.fdate, name)) {

                                    t = {
                                        fdate: t.fdate,
                                        fitem: [{
                                            name: name,
                                            kcal: t.fkcal
                                        }]
                                    }

                                    savefdlist(t);
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: '名稱錯誤',
                                        template: '名稱重複或尚未輸入全部資料',
                                        okText: '確定',
                                        okType: 'button button-calm'
                                    });

                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            };


            $scope.modify_easyfood = function(fid, fitemid) {
                $scope.easy_food = {
                    fname: $scope.basedata.food_list[fid].fitem[fitemid].name,
                    fdate: $scope.basedata.food_list[fid].fdate,
                    fkcal: $scope.basedata.food_list[fid].fitem[fitemid].kcal,
                }

                var easy_foodPopup = $ionicPopup.show({
                    cssClass: '',
                    templateUrl: 'templates/food/addeasyfood.html',
                    title: '<h3>修改名稱、時間、熱量</h3>',
                    scope: $scope,
                    buttons: [
                        { text: '返回' }, {
                            text: '<b>確認</b>',
                            type: 'button-positive',
                            onTap: function(e) {

                                var t = $scope.easy_food;
                                var list = $scope.basedata.food_list[fid];
                                var name = t.fname;

                                if (name && t.fdate && t.fkcal && ((list.fdate === t.fdate && list.fitem[fitemid].name === name) || findName(t.fdate, name))) {

                                    list.fitem[fitemid].name = name;
                                    list.fitem[fitemid].kcal = $scope.easy_food.fkcal;
                                    if (list.fdate != t.fdate)
                                        if (list.fitem.length === 1 && findValue(t.fdate)) {
                                            list.fdate = t.fdate;
                                        } else {
                                            t = {
                                                fdate: t.fdate,
                                                fitem: []
                                            }
                                            t.fitem.push(list.fitem[fitemid]);

                                            savefdlist(t);

                                            list.fitem.splice(fitemid, 1);
                                            if (list.fitem.length < 1) {
                                                $scope.basedata.food_list.splice(fid, 1);
                                            }
                                        }
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: '名稱錯誤',
                                        template: '名稱重複或尚未輸入全部資料',
                                        okText: '確定',
                                        okType: 'button button-calm'
                                    });

                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            };

            //-------------------detailed_food-------------------------
            $scope.addfoodM = function() {

                $scope.addfoodst = {
                    fname: '',
                    fdate: new Date(),
                }

                var myPopup = $ionicPopup.show({
                    cssClass: '',
                    templateUrl: 'templates/food/addfood.html',
                    title: '<h3>輸入名稱與時間</h3>',
                    scope: $scope,
                    buttons: [
                        { text: '返回' }, {
                            text: '<b>新增</b>',
                            type: 'button-positive',
                            onTap: function(e) {

                                var t = $scope.addfoodst;
                                var name = t.fname;
                                if (name && t.fdate && findName(t.fdate, name)) {

                                    t = {
                                        fdate: t.fdate,
                                        fitem: []
                                    }
                                    appfitem(t.fitem, name);
                                    savefdlist(t);
                                    $scope.go_addfooditem();

                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: '名稱錯誤',
                                        template: '名稱重複或尚未輸入全部資料',
                                        okText: '確定',
                                        okType: 'button button-calm'
                                    });

                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            };

            $scope.modify_food = function(fid, fitemid) {

                $scope.addfoodst = {
                    fname: $scope.basedata.food_list[fid].fitem[fitemid].name,
                    fdate: $scope.basedata.food_list[fid].fdate,
                }

                var myPopup = $ionicPopup.show({
                    cssClass: '',
                    templateUrl: 'templates/food/addfood.html',
                    title: '<h3>修改名稱與時間</h3>',
                    scope: $scope,
                    buttons: [
                        { text: '返回' }, {
                            text: '<b>確認</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                var t = $scope.addfoodst;
                                var list = $scope.basedata.food_list[fid];
                                var name = t.fname;
                                if (name && t.fdate && ((list.fdate === t.fdate && list.fitem[fitemid].name === name) || findName(t.fdate, name))) {

                                    list.fitem[fitemid].name = name;
                                    if (list.fdate != t.fdate)
                                        if (list.fitem.length === 1) {
                                            list.fdate = t.fdate;
                                        } else {

                                            t = {
                                                fdate: t.fdate,
                                                fitem: []
                                            }
                                            t.fitem.push(list.fitem[fitemid]);

                                            savefdlist(t);

                                            list.fitem.splice(fitemid, 1);
                                            if (list.fitem.length < 1) {
                                                $scope.basedata.food_list.splice(fid, 1);
                                            }
                                        }

                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: '名稱錯誤',
                                        template: '名稱重複或尚未輸入全部資料',
                                        okText: '確定',
                                        okType: 'button button-calm'
                                    });

                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            };

            var findName = function(date, name) {
                var boolean = true;

                if (!findValue(date)) {
                    for (var i = $scope.basedata.food_list[$scope.fid].fitem.length - 1; i >= 0; i--) {
                        if ($scope.basedata.food_list[$scope.fid].fitem[i].name === name) {
                            $scope.fitemid = i;
                            boolean = false;
                        }
                    }
                }
                return boolean;
            };

            var findValue = function(date) {
                var boolean = true; //今天沒有輸入資料
                $scope.fid = $scope.basedata.food_list.length; //今天的id     $scope.fid

                for (var i = $scope.basedata.food_list.length - 1; i >= 0; i--) {
                    if ($scope.basedata.food_list[i].fdate.getDate() === date.getDate()) {
                        $scope.fid = i;
                        boolean = false; //今天有輸入資料
                    }
                }
                return boolean;
            };

            var appfitem = function(farray, iname) {
                $scope.fitemid = farray.length;
                farray.push({
                    name: iname,
                    fd_details: []
                });
            };


            var savefdlist = function(farray) {
                if (findValue(farray.fdate)) {
                    $scope.basedata.food_list.push(farray);
                } else
                    Array.prototype.push.apply($scope.basedata.food_list[$scope.fid].fitem, farray.fitem);

                $scope.fitemid = $scope.basedata.food_list[$scope.fid].fitem.length - 1;
            }


            $scope.fdid = { id: null };
            $scope.fdshow = {
                show: true
            }
            $scope.searchfdname = null;

            $scope.go_addfooditem = function() {

                $scope.fdid = { id: null };
                $scope.fdshow = {
                    show: true
                }
                $scope.searchfdname = null;

                $scope.fdetails_bank = {
                    name: "name",
                    basiskcal: 0,
                    i: 1,
                    kcal: 0
                };

                $scope.modify_id = null;
                $scope.setTitle('新增記錄');

                $state.go('addfooditem');
            };


            $scope.fdshow_ch = function() {
                $scope.fdshow.show = !$scope.fdshow.show;
            };

            //----------------------addfooditem------------------------------
            $scope.nextf = function() {
                if ($scope.fdid.id === null) {
                    var alertPopup = $ionicPopup.alert({
                        template: '<h3 class=" center ">你尚未選擇食物</h3>',
                        okText: '確定',
                        okType: 'button button-calm'
                    });
                } else {
                    $scope.fdetails_bank.i = 1;
                    findfdid($scope.fdid.id);
                    $scope.fdshow.show = !$scope.fdshow.show;
                }
            };

            $scope.fdetails_bank = {
                name: "name",
                basiskcal: 0,
                i: 1,
                kcal: 0
            };

            var findfdid = function(id) {
                angular.forEach($scope.fd, function(v_f, k_f) {
                    angular.forEach(v_f.item, function(v_i, k_i) {
                        if (v_i.id === id) {
                            var t = $scope.fdetails_bank;
                            t.name = v_i.name;
                            t.basiskcal = v_i.kcal;
                            t.kcal = t.basiskcal * t.i;
                            return;
                        }
                    });
                });
            }


            $scope.countkcal = function() {
                var t = $scope.fdetails_bank;
                t.kcal = t.basiskcal * t.i;
            }

            $scope.savefd_details = function() {
                var t = $scope.fdetails_bank;
                var item = $scope.basedata.food_list[$scope.fid].fitem[$scope.fitemid];
                var i = item.fd_details.filter(
                    function(value) {
                        return value.name === t.name;
                    }).length;
                if (i) {
                    if ($scope.modify_id != null && item.fd_details[$scope.modify_id].name === t.name) {
                        item.fd_details[$scope.modify_id].kcal = t.basiskcal;
                        item.fd_details[$scope.modify_id].Quantity = t.i;
                        $state.go('fooditem');
                    } else
                        var alertPopup = $ionicPopup.alert({
                            title: '選項重複',
                            okText: '確定',
                            okType: 'button button-calm'
                        });

                } else {
                    if ($scope.modify_id === null) {
                        item.fd_details.push({
                            name: t.name,
                            kcal: t.basiskcal,
                            Quantity: t.i
                        });
                    } else {
                        item.fd_details.splice($scope.modify_id, 1, {
                            name: t.name,
                            kcal: t.basiskcal,
                            Quantity: t.i
                        });
                    }
                    $state.go('fooditem');
                }
            }


            $scope.totalitemkcal = function(fid, fitemid) {
                var t = 0;
                angular.forEach($scope.basedata.food_list[fid].fitem[fitemid].fd_details, function(v, k) {
                    t += (v.kcal * v.Quantity);
                });

                return t;
            }

            $scope.totalkcal = function(fid) {
                var t = 0;
                angular.forEach($scope.basedata.food_list[fid].fitem, function(v, k) {
                    if (v.fd_details)
                        angular.forEach(v.fd_details, function(v, k) {
                            t += (v.kcal * v.Quantity);
                        });
                    else
                        t += v.kcal;
                });
                return t;
            }

            $scope.deletefd_details = function(name) {
                var id = find_detailsid(name);

                var confirmPopup = $ionicPopup.confirm({
                    title: '刪除警告',
                    template: '確定要刪除此項目嗎？',
                    okType: 'button-assertive'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.basedata.food_list[$scope.fid].fitem[$scope.fitemid].fd_details.splice(id, 1);
                    }
                });
            };

            $scope.deletefd_item = function(fid, fitemid) {

                var confirmPopup = $ionicPopup.confirm({
                    title: '刪除警告',
                    template: '確定要刪除此項目嗎？',
                    okType: 'button-assertive'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.basedata.food_list[fid].fitem.splice(fitemid, 1);
                        if ($scope.basedata.food_list[fid].fitem.length < 1) {
                            $scope.basedata.food_list.splice(fid, 1);
                        }
                    }
                });
            };

            /*
                {   fdate:  ,
                    fitem: [{
                        name: ,
                        fd_details: [{
                            name: ,
                            kcal: ,
                            Quantity :
                        }]
                        kcal:
                    }]
                }
             */

            $scope.modify_fooditem = function(name) {

                var id = find_detailsid(name);

                $scope.fdid = { id: null };
                $scope.fdshow = {
                    show: false
                }
                $scope.searchfdname = null;
                $scope.modify_id = id;

                var details = $scope.basedata.food_list[$scope.fid].fitem[$scope.fitemid].fd_details[id];

                $scope.fdetails_bank = {
                    name: details.name,
                    basiskcal: details.kcal,
                    i: details.Quantity,
                    kcal: details.kcal * details.Quantity
                };

                $scope.setTitle('修改記錄');
                $state.go('addfooditem');
            };

            var find_detailsid = function(name) {
                var id = 0;

                for (var i = 0; i < $scope.basedata.food_list[$scope.fid].fitem[$scope.fitemid].fd_details.length; i++) {
                    if ($scope.basedata.food_list[$scope.fid].fitem[$scope.fitemid].fd_details[i].name === name) {
                        id = i
                        return id;
                    }
                }
                return id;
            }

            $scope.to_f = function(fid, fitemid) {
                $scope.fid = fid;
                $scope.fitemid = fitemid;
                $state.go('fooditem');
            }

            $scope.goto = function(name) {
                $state.go(name);
            }



            // ----------- angular-scroll-animate -----------
            $scope.animateElementIn = function($el) {
                $el.removeClass('timeline-hidden');
                $el.addClass('bounce-in');
            };

            $scope.animateElementOut = function($el) {
                $el.addClass('timeline-hidden');
                $el.removeClass('bounce-in');
            };

            // ----------- fitbit -----------   

            $scope.br = function() {
                var options = {
                  location: 'no',
                  clearcache: 'no',
                  toolbar: 'no'
                };

                document.addEventListener("deviceready", function () {
                  $cordovaInAppBrowser.open('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=227WLD&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800',  '_self', options)
                    .then(function(event) {
                    })
                    .catch(function(event) {
                      // error
                    });
                }, false);
                $scope.toggleLeftSideMenu();
                $scope.br2();
                $state.go('fitbit_list');
            }

            $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
              var token = event.url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
              var url = event.url.toString();
              $scope.fitbit_data = {
                  t: token,
                  uid : url.substring(url.indexOf('user_id=') + 8 ,url.indexOf('&',url.indexOf('user_id')))
              }
              $cordovaInAppBrowser.close();
            });


            $scope.activities = [];
            $scope.ac = 0;
            $scope.li = 0;
            /*
                        $scope.activities = [{
                            startDate: new Date(),
                            list: [{
                                name: 'A',
                                calories: 220,
                                startTime: new Date(),
                                duration: 10000,
                            }]
                        }];
            */

            $scope.br2 = function() {
                var nowday = new Date();

                for (var i = 0; i < 10; i++, nowday = new Date(nowday.getTime() - 86400000)) {

                    var day = nowday.getFullYear() + '-' + (nowday.getMonth() + 1) + '-' + nowday.getDate();

                    $http.get('https://api.fitbit.com/1/user/' + $scope.fitbit.user_id + '/activities/date/' + day + '.json', {
                        headers: {
                            "Authorization": 'Bearer ' + $scope.fitbit.token
                        }
                    }).success(function(data) {
                        if (data.activities.length > 0) {
                            angular.forEach(data.activities, function(value, key) {
                                if (!findacdate(value.startDate)) {
                                    console.log(value.startDate);
                                    $scope.activities.push({
                                        startDate: value.startDate,
                                        list: []
                                    });
                                }
                                $scope.activities[$scope.acid ].list.push({
                                    name: value.name,
                                    calories: value.calories,
                                    startTime: value.startTime,
                                    duration: value.duration,
                                });
                            });

                        }
                    });
                }

                var findacdate = function(date) {
                    var activities_id = 0;
                    $scope.acid =0;
                    if ($scope.activities != null) {
                        $scope.acid = $scope.activities.length;
                        for (var i = $scope.activities.length - 1; i >= 0; i--) {
                            if ($scope.activities.startDate === date) {
                                $scope.acid =i;
                                activities_id = i;
                                return activities_id;
                            }
                        }
                    }
                    return activities_id;
                }



                /*  
                var nowday = new Date();

                for (var i = 0; i < 30; i++, nowday = new Date(nowday.getTime() - 86400000)) {

                    var day = nowday.getFullYear() + '-' + (nowday.getMonth() + 1) + '-' + nowday.getDate();

                }

                $http.get('https://api.fitbit.com/1/user/' + $scope.fitbit.user_id + '/activities/date/2016-12-03.json', {
                    headers: {
                        "Authorization": 'Bearer ' + $scope.fitbit.token
                    }
                }).success(function(data) {
                    console.log(data);
                });

                $http.get('https://api.fitbit.com/1/user/' + $scope.fitbit.user_id + '/activities/date/2016-12-03.json', {
                    headers: {
                        "Authorization": 'Bearer ' + $scope.fitbit.token
                    }
                }).success(function(data) {
                    console.log(data);
                });

                */
            }

            

            $scope.to_fitbit = function(ac, li) {
                $scope.ac = ac;
                $scope.li = li;
                $state.go('fitbit_item');
            }

            $scope.fitbit_endtime = function() {
                var dateString = $scope.activities[$scope.ac].startDate + " " + $scope.activities[$scope.ac].list[$scope.li].startTime + ":00";
                var time = new Date(dateString.replace(/-/g, "/"));

                return new Date(time.getTime() + $scope.activities[$scope.ac].list[$scope.li].duration);
            }

    // ----------- Other ----------------------
      $scope.slideboxChanged = function() {
          return $ionicSlideBoxDelegate.currentIndex();
      };
      $scope.$on('$viewContentLoading', function() {
          $ionicLoading.show({
            template: '<ion-spinner icon="android" class="spinner-balanced"></ion-spinner>',
          }).then(function(){   
          });
      });
      $scope.$on('$viewContentLoaded', function() {
          $ionicLoading.hide();
      });
  
      $scope.showpbr = function($event, v) {
        var template = '<ion-popover-view style="height:150px;width:200px"><ion-content class="padding" ><p>'+ v.replace(/\n|\r\n|\r/g, '<br/>') +'</p></ion-content></ion-popover-view>';
        var popover = $ionicPopover.fromTemplate(template, {
          scope: $scope
        })
        popover.show($event);
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
      // plan-scrollEvent
      $scope.plan_list_subtitle = {
        subtitle : null
      };
      $scope.scrollEvent = function(id) {
        var scrollamount = $ionicScrollDelegate.$getByHandle(id).getScrollPosition().top;
        var pl = angular.copy($scope.basedata.plan_list);
        if (scrollamount > 30) 
          $scope.subtitleShow = true;
        else
          $scope.subtitleShow = false
        if(pl != null){
          angular.forEach(pl , function(value, key) {
          var top = angular.element(document.getElementById(key))[0].offsetTop;
            if( top - scrollamount <= 15 & scrollamount - top < 150){
              $scope.set_subtitle(key);
            } 
          });
        }
      };
      $scope.set_subtitle= function(k){
        $scope.plan_list_subtitle.subtitle = k;
        $scope.$apply();
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

      //------- slidetab function --------

      $scope.slideChange = function(v) {
        $scope.sptab.v = v ;
      };   
      $scope.nextb = function(){
        if ( !$scope.sportoption.s) {
          var alertPopup = $ionicPopup.alert({
             template: '<h3 class=" center ">你尚未選擇運動項目</h3>',
             okText: '確定',
             okType: 'button button-calm'
          });
        }else{
            if (!$scope.n.n) {
              $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner>',
                duration: 1000
              }).then(function(){             
              });
            };   
            $scope.n.n = !$scope.n.n;   
            if ($scope.sportoption.s.feature != 'length') {
                $scope.sportoption.f.feature = null;
            };   
            $scope.setMets();    
        }
      };     

    //----------- knowlegde-------------

      $scope.kn_co =null;

      $scope.knowcontent = function(con) {

        $scope.kn_co = con.content;
        
        var showPopup = $ionicPopup.show({
          title: '<p class ="center knti">'+con.title+'</p>',
          scope:$scope,
          buttons:[{
            text: 'OK',
            type: 'button-positive',
            onTap: function(e) {
            return true;
            }
          }],
          templateUrl: 'templates/know/kn-co.html'
        });
      }

    // ----------- angular-scroll-animate -----------
        $scope.animateElementIn = function($el) {
          $el.removeClass('timeline-hidden');
          $el.addClass('bounce-in');
        };

        $scope.animateElementOut = function($el) {
          $el.addClass('timeline-hidden');
          $el.removeClass('bounce-in');
        };
  }])
})();