
var control = angular.module('controllers', []);
var loginStorage = '';
var filesDetail = '';
var fileList = '';
var subfileList = '';
var subfileList1 = '';
var subfileList2 = '';
var subfileList3 = '';

var folderDetails = '';
var subfolderDetails = '';

var subfolderDetails1 = '';
var subfolderDetails2 = '';
var subfolderDetails3 = '';

var userDetailArray = '';

var subscriberImage = '';

var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
    
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    //document.addEventListener("backbutton", onBackKeyDown, false);
}
function addgetPhoto(source) {

      // Retrieve image file location from specified source
    navigator.camera.getPicture(addonPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,sourceType: source,correctOrientation: true });


  
}


function addonPhotoURISuccess(imageURI) {

    //window.resolveLocalFileSystemURI(imageURI, copyPhoto, fail1);
    subscriberImage = imageURI;
    //$('.file-input-wrapper').css('background-image', 'url('+imageURI+')');
    
}

function onFail(message) {
      alert('Failed because: ' + message);
}

control.controller('loginCtrl', function($scope, $state, $ionicPlatform, $ionicModal,$ionicSideMenuDelegate,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$ionicPopover,$location,$http){
	
    $ionicPlatform.registerBackButtonAction(function () {
        navigator.notification.confirm(
                    'Are you sure you want to Exit?',
                    exitout,
                    'Please Confirm',
                    ["OK","CANCEL"]
            );
 
    }, 100);
    
    $scope.userlogin = {};
    $scope.userlogin.userid = 'sairam';
    $scope.userlogin.password = 'password';


    $scope.registerFtn = function(){
		$state.go('register');
	}

	$scope.loginFtn = function(){
		//console.log($scope.userlogin.username+" : "+$scope.userlogin.password);
		$ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        var formData = new FormData();
        formData.append("login",$scope.userlogin.userid);
        formData.append("password",$scope.userlogin.password);

		if(($scope.userlogin.userid != '')&&($scope.userlogin.password != '')){

            $http.post('http://build.myappbuilder.com/api/login.json', formData,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data,status,headers,config){
            	
                console.log(JSON.stringify(data));

            	loginStorage = data;
                $http({method:'GET', url:'http://build.myappbuilder.com/api/users.json', cache:false, params:{'api_key':loginStorage.api_key}})
                .success(function(data, status, headers, config){
                    userDetailArray = data;

                    $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key}})
                    .success(function(data, status, headers, config){

                        $ionicLoading.hide();
                        filesDetail = data;
                        $state.go('home');
                    })
                    .error(function(data, status, headers, config){
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                            
                        });
                    })
                })
                .error(function(data, status, headers, config){
                    console.log("hi : "+JSON.stringify(data));
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong!'
                    });
                    alertPopup.then(function(res) {
                    });
                })
                     
            })
            .error(function(data,status,headers,config){
            	$ionicLoading.hide();
            	var alertPopup = $ionicPopup.alert({
                 title: 'MABFiles',
                 template: 'Please enter correct username and password!'
                });
                alertPopup.then(function(res) {
                 
                });
            })
        }else{
        	$ionicLoading.hide();
        	var alertPopup = $ionicPopup.alert({
                 title: 'MABFiles',
                 template: 'Please fill all details!'
            });
            alertPopup.then(function(res){
            });
        }
	}
});

control.controller('registerCtrl', function($scope, $state, $ionicModal,$ionicSideMenuDelegate,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$location,$http){
	$scope.userDetail = {};
    $scope.userDetail.fullname = '';
    $scope.userDetail.username = '';
    $scope.userDetail.email = '';
    $scope.userDetail.password = '';
    $scope.userDetail.passwordConfirm = '';

	$scope.loginBack = function(){
		$state.go('login');
	}

	$scope.registerSubFtn = function(){
		$ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });

        if(($scope.userDetail.fullname != '')&&($scope.userDetail.username != '')&&($scope.userDetail.email != '')&&($scope.userDetail.password != '')&&($scope.userDetail.passwordConfirm != '')){
            
            $http({method: "POST", url: 'http://build.myappbuilder.com/api/users.json', cache:false, params:{"name":$scope.userDetail.fullname,"username":$scope.userDetail.username,"email":$scope.userDetail.email,"password":$scope.userDetail.password,"password_confirmation":$scope.userDetail.passwordConfirm}})
            .success(function(data,status,headers,config){
                loginStorage = data;
                $scope.userDetail = {};
                $http({method:'GET', url:'http://build.myappbuilder.com/api/users.json', cache:false, params:{'api_key':loginStorage.api_key}})
                .success(function(data, status, headers, config){

                    userDetailArray = data;
                    $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key}})
                    .success(function(data, status, headers, config){

                        $ionicLoading.hide();
                        filesDetail = data;
                        $state.go('home');
                    })
                    .error(function(data, status, headers, config){
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                         title: 'MABFiles',
                         template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                        });
                    })
                })
                .error(function(data, status, headers, config){
                    console.log("hi : "+JSON.stringify(data));
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong1!'
                    });
                    alertPopup.then(function(res) {
                    });
                })
            })
            .error(function(data,status,headers,config){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                 title: 'MABFiles',
                 template: 'Something went wrong!'
                });
                alertPopup.then(function(res) {
                 
                });
            })
        }else{
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                 title: 'MABFiles',
                 template: 'Please fill all details!'
                });
                alertPopup.then(function(res) {
                 
                });
        }
	}
});












openFB.init('1436547346579776');
var twitterKey = ''; 
var homeFileName = '';

control.controller('homeCtrl', function($scope, $state, $ionicModal,$ionicSideMenuDelegate, $ionicScrollDelegate,$ionicLoading,$ionicPopup,$ionicPopover,$location,$http,$ionicActionSheet){
    
    $scope.folder = {};
    $scope.userDetailArray = userDetailArray;

    $scope.addgetPhoto1 = function(){
        addgetPhoto(pictureSource.PHOTOLIBRARY);
    }

    var fileListArray = [];
    for (var i = 0; i < filesDetail.length; i++) {
        
        var imageData = (filesDetail[i].name).split(".").reverse();
            
        if(imageData.length > 1){
            var fileSize;
            if(filesDetail[i].file_size >= (1024*1024)){
                fileSize = Math.round((filesDetail[i].file_size/(1024*1024)))+'MB';
            }else{
                fileSize = Math.round((filesDetail[i].file_size/1024))+'KB'; 
            }
            var created_atData = ', modified '+relative_time(filesDetail[i].created_at);
            
            fileListArray.push({'id':filesDetail[i].id,'name':filesDetail[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':filesDetail[i].folder,'url':filesDetail[i].url,'short_url':filesDetail[i].short_url,'content_type':filesDetail[i].content_type,'created_at':created_atData,'date':filesDetail[i].created_at});
        }else{
            fileListArray.push({'id':filesDetail[i].id,'name':filesDetail[i].name,'image':'img/folder_ic.png','size':'','folder':filesDetail[i].folder,'content_type':filesDetail[i].content_type,'date':filesDetail[i].created_at});
        }

    };

    $scope.filesDetail = fileListArray;

    $scope.logoutFtn = function(){
        $state.go('login');
        openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
        window.localStorage.removeItem(twitterKey);
    }

    $scope.data = {
        showDelete: false
    };
      
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $ionicPopover.fromTemplateUrl('share-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.sharePopover = popover;
    });

    $scope.openPopover = function($event, item) {
        $scope.itemDelRen = item;
        $scope.folderOption = $scope.itemDelRen.folder;
        $scope.popover.show($event);
    };

    $scope.frdShareFtn = function($event){
        $scope.sharePopover.show($event);
    }

    $scope.emailshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaEmail(
              "I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
              'MAB Files Backup',
              [], // TO: must be null or an array
              [], // CC: must be null or an array
              null, // BCC: must be null or an array
              [res.filePath], // FILES: can be null, a string, or an array
              function(Success){
                console.log(JSON.stringify(Success));
              }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
              function(onError){
                console.log(JSON.stringify(onError));
              } // called when sh*t hits the fan
            );
          }
        },'jpg',50,'myScreenShot');


        
    }

    $scope.fbshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", [res.filePath] /* img */, null /* url */, 'Paste it dude!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
          }
        },'jpg',50,'myScreenShot');
        
    }

    $scope.twitshareFtn = function(){
        $scope.sharePopover.hide(); 
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaTwitter("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/", [res.filePath] /* img */, '');
          }
        },'jpg',50,'myScreenShot');
        
    }

    $ionicModal.fromTemplateUrl('settingPage.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingPageModal = modal;
    });

    $ionicModal.fromTemplateUrl('privacy.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacyModal = modal;
    });

    $scope.privacyFtn = function(){
        $scope.privacyModal.show();
    }

    $ionicPopover.fromTemplateUrl('setting-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.settingPopover = popover;
    });

    
    $scope.changePercentageVal = '%';
    $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
    $scope.changePercentage = function(){
        if($scope.changePercentageVal == '%'){
            $scope.changePercentageVal = 'MB';
            //$('#changePercentage').css({'background-image':'url(img/mb.png)','background-size':'100% 100%'})
            var valDet = ((parseInt($scope.userDetailArray.space_used)/256)*100);
            $scope.changePercentageDet = valDet+' % of 100 %';
            
        }else{
            //$('#changePercentage').css({'background-image':'url(img/precentage.png)','background-size':'100% 100%'})
            $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
            $scope.changePercentageVal = '%';
        }
    }

    $scope.settingFtn = function($event){
        $scope.settingPopover.show($event);
    }

    var name_sort_desc = function (a, b) {
        return a.name < b.name;
    }

    $scope.alignAZFtn = function(){
        $ionicLoading.show({
            template:'<i class="icon ion-loading-a"></i>&nbsp;Please wait... '
        });
        $scope.settingPopover.hide();
        var dateArrangement = [];
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }

        setTimeout(function(){
            $scope.filesDetail = dateArrangement.sort(name_sort_desc);
            $ionicLoading.hide();
        },5000);
        
    }

    var date_sort_desc = function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }; 

    $scope.alignDateFtn = function(){
        var dateArrangement = [];
        $scope.settingPopover.hide();
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }
        
        $scope.filesDetail = dateArrangement.sort(date_sort_desc);

    }

    $scope.alignTypeFtn =function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });

        var ContentType = [];
        $scope.values = ['mp4','MOV','mp3','pdf','zip','jpg','png','xls','docx','doc','txt','xgl','html','ivr'];
        $scope.filesDetail = '';
        $scope.settingPopover.hide();
        var roundData = 0; 
        
                for (var j = 0; j < $scope.values.length; j++) {
                    roundData = roundData + 1;
                    for (var z = 0; z < fileListArray.length; z++) {
                        
                        if(fileListArray[z].content_type){
                            var imageData = (fileListArray[z].name).split(".").reverse();
                            if(imageData[0] == $scope.values[j]){
                                console.log("imageData[0] : "+imageData[0]);
                                ContentType.push(fileListArray[z]);
                            }
                        }else{
                            if(roundData == 1){
                                ContentType.push(fileListArray[z]); 
                            }
                        }
                    };
                    
                };
        console.log(JSON.stringify(ContentType));
        
        setTimeout(function() {
            $ionicLoading.hide();
            $scope.filesDetail = ContentType;
        }, 5000);
        
    }

    $scope.alignSettingFtn = function(){
        $scope.settingPopover.hide();
        $scope.settingPageModal.show();

        if($scope.userDetailArray.avatar){
            $('.circle').css({'background-image':'url('+$scope.userDetailArray.avatar+')','background-size':'100% 100%'});
        }else{
            $('.circle').css({'background-image':'url(img/frame.png)','background-size':'100% 100%;'});
        }
    }

    

    $scope.shareData = function(dataPath) {
        $scope.popover.hide();
        console.log(JSON.stringify(dataPath));
        var hideSheet = $ionicActionSheet.show({
        buttons: [
           { text: 'FaceBook' },
           { text: 'Twitter' },
           { text: 'Email' },
        ],
         
         titleText: 'Are you want to share this file!',
         cancelText: 'Cancel',
         cancel: function() {
            
         },
         buttonClicked: function(index) {
            if(index == 2){
                
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaEmail(
                      "Download Link:- "+dataPath.short_url, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                      'MAB Files Backup',
                      [], // TO: must be null or an array
                      [], // CC: must be null or an array
                      null, // BCC: must be null or an array
                      [res.filePath], // FILES: can be null, a string, or an array
                      function(success){

                      }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
                      function(onError){

                      } // called when sh*t hits the fan
                    );
                  }
                },'jpg',50,'myScreenShot');
                
            }else if(index == 1){
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaTwitter("Download Link:- "+dataPath.short_url, [res.filePath], '');
                  }
                },'jpg',50,'myScreenShot');
                

            }else{
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaFacebook("Download Link:- "+dataPath.short_url, [res.filePath], null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
                  }
                },'jpg',50,'myScreenShot');
                
            }

            return true;
         }
        });
    }

      
    $scope.onItemDelete = function(item) {
        $scope.popover.hide();
        $scope.filesDetail.splice($scope.filesDetail.indexOf(item), 1);
        
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $http({method:"DELETE", url:'http://build.myappbuilder.com/api/folders/destroy.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':item.id}})
        .success(function(data,status,headers,config){
            $ionicLoading.hide();
        })
        .error(function(data,status,headers,config){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                     
            });
        })
    };

    $ionicModal.fromTemplateUrl('editFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editFolderModal = modal;
    });

  
    $scope.onItemRename = function(item){
        $scope.folder.editname ='';
        $scope.popover.hide();
        $scope.editFolderModal.show();
        $scope.folder.editId = item.id;
        //$scope.folder.editname = item.name;
        var editFileName = (item.name).split('.').reverse();
        if(editFileName.length > 1){
            for (var i = (editFileName.length-1); i > 0; i--) {
                $scope.folder.editname = $scope.folder.editname+editFileName[i];
            };
            $scope.editFileExtention = editFileName[0];
        }else{
            $scope.folder.editname = editFileName[0];
            $scope.editFileExtention = '';
        }
        
    }

    $scope.folderEditFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.editFileExtention){
            var rootEditFileName = $scope.folder.editname+'.'+$scope.editFileExtention;
        }else{
            var rootEditFileName = $scope.folder.editname;
        }
        console.log("rootEditFileName1 : "+rootEditFileName);
        $http({method:'PUT', url:'http://build.myappbuilder.com/api/files/rename.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':$scope.folder.editId, 'name':rootEditFileName}})
        .success(function(data,status,headers,config){
            
            $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key}})
            .success(function(data, status, headers, config){

                    $ionicLoading.hide();
                    fileListArray = [];
                    for (var i = 0; i < data.length; i++) {
                        
                            var imageData = (data[i].name).split(".").reverse();
                            if(imageData.length > 1){
                                var fileSize;
                                if(data[i].file_size >= (1024*1024)){
                                    fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                }else{
                                    fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                }
                                var created_atData = ', modified '+relative_time(data[i].created_at);
                                fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                            }else{
                                fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                            }
                    };
                    filesDetail = fileListArray;
                    $scope.filesDetail = filesDetail;
                    
                    $scope.editFolderModal.hide();
            })
            .error(function(data, status, headers, config){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'MABFiles',
                     template: 'Something went wrong!'
                    });
                    alertPopup.then(function(res) {
                     
                    });
            })
        })
        .error(function(data,status,headers,config){
            //alert(JSON.stringify(data))
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                $scope.editFolderModal.hide();     
            });
        })
    }

    $ionicModal.fromTemplateUrl('addFolder.html',{
            scope: $scope,
            animation: 'slide-in-up'
    }).then(function(modal) {
            $scope.addFolderModal = modal;
    });

    $scope.addFolderFtn = function(){
        $scope.addFolderModal.show();
    }

    $scope.folderCreateFtn = function(){
        var formData = new FormData();
        formData.append("api_key",loginStorage.api_key);
        formData.append("name",$scope.folder.name);
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.folder.name){
            $http.post('http://build.myappbuilder.com/api/folders.json', formData,{
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
            })
            .success(function(data,status,headers,config){
                $scope.folder = {};
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key}})
                .success(function(data, status, headers, config){
                        $ionicLoading.hide();
                        fileListArray = [];
                        for (var i = 0; i < data.length; i++) {
                            
                            var imageData = (data[i].name).split(".").reverse();
                            if(imageData.length > 1){
                                var fileSize;
                                if(data[i].file_size >= (1024*1024)){
                                    fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                }else{
                                    fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                }
                                var created_atData = ', modified '+relative_time(data[i].created_at);
                                fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                            }
                            else{
                                fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                            }
                        };
                        filesDetail = fileListArray;
                        $scope.filesDetail = filesDetail;
                        
                        $scope.addFolderModal.hide();
                })
                .error(function(data, status, headers, config){
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                         title: 'MABFiles',
                         template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                         
                        });
                })
            })
            .error(function(data,status,headers,config){
                        $ionicLoading.hide();
                        $scope.folder= {};
                        //alert(JSON.stringify(data));
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: data.details
                        });
                        alertPopup.then(function(res) {
                        });
            })
        }else{
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: 'Please fill the folder name!'
                });
                alertPopup.then(function(res) {
                });
            }
    }

    $scope.fileListFtn = function(file){
        folderDetails = file;

        fileList = '';
        console.log(folderDetails.folder);
        if(folderDetails.folder){
            homeFileName = folderDetails.name;
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });
            $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':folderDetails.id}})
            .success(function(data, status, headers, config){
                //alert(JSON.stringify(data));
                $ionicLoading.hide();
                if(data.length > 0){
                    fileList = data;
                    $state.go('filesList');
                }else{
                    var alertPopup = $ionicPopup.alert({
                        title: 'MABFiles',
                        template: 'No file in this folder!'
                    });
                    alertPopup.then(function(res) {
                       //fileList = data;
                        $state.go('filesList');
                    });
                         
                }

            })
            .error(function(data, status, headers, config){
                alert(JSON.stringify(data));
                $ionicLoading.hide();
            })
        }else{

        }

    }

    $ionicModal.fromTemplateUrl('uploadFiles.html',{
            scope: $scope,
            animation: 'slide-in-up'
    }).then(function(modal) {
            $scope.uploadFilesModal = modal;
    });

    //var formData = new FormData();
    //formData.append("api_key",loginStorage.api_key);
    $scope.filePath = '';
    
    //$("#newrootfiles").change(function(){
        // alert($('#newrootfiles').val())
    //});

    $scope.filesCreateFtn = function(){
        if(subscriberImage){        	
            $scope.filePath = 'Home/'+subscriberImage;
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });
console.log("sssa="+loginStorage.api_key);
            cordova.exec(function(response){

                    $scope.filePath = 'Home/'+JSON.parse(response).name;
                    $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key}})
                        .success(function(data, status, headers, config){
                            $ionicLoading.hide();
                            if(data.length > 0){
                                fileListArray = [];
                            for (var i = 0; i < data.length; i++) {
                                
                                var imageData = (data[i].name).split(".").reverse();
                                if(imageData.length > 1){
                                    var fileSize;
                                    if(data[i].file_size >= (1024*1024)){
                                        fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                    }else{
                                        fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                    }
                                    var created_atData = ', modified '+relative_time(data[i].created_at);
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                }else{
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                }
                            };
                            
                            $scope.filesDetail = fileListArray;
                            filesDetail = fileListArray;
                                $scope.uploadFilesModal.hide();
                            }else{
                                
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'No file in this folder!'
                                });
                                alertPopup.then(function(res) {
                                    
                                    fileListArray = [];
                            for (var i = 0; i < data.length; i++) {
                                
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }
                                    else{
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                            };
                            
                            $scope.filesDetail = fileListArray;
                            filesDetail = fileListArray;
                                    $scope.uploadFilesModal.hide();
                                });
                                     
                            }

                        })
                        .error(function(data, status, headers, config){
                            alert(JSON.stringify(data));
                            $ionicLoading.hide();
                        })
                },function(e){
                	alert("Fail: "+e); $ionicLoading.hide();}, "Echo", "echo", ["300","300","file", subscriberImage, "http://build.myappbuilder.com/api/files/new.json?", "POST", {"api_key":loginStorage.api_key}])
                
        }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: 'Please select file!'
                });
                alertPopup.then(function(res) {
                   
                });
        }
    }



    $scope.downloadFile = function(dataPath){

        $scope.popover.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fs)
            {           var ft = new FileTransfer();
                        ft.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                console.log(perc + "%");
                              
                            }else {
                                console.log("Loading");
                            }
                        }

                        console.log(dataPath.url+" : "+ fs.root.toURL());


                        var filePathRoot = fs.root.toURL()+'/MABFiles/'+dataPath.name;
                        ft.download(dataPath.url, filePathRoot, 
                            function(entry){
                                console.log(JSON.stringify(entry));
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'Download completed successfully!'
                                });
                                alertPopup.then(function(res) {
                                   
                                });
                            },
                            function(error){
                                $ionicLoading.hide();
                                console.log(JSON.stringify(error));
                            }
                        );
            },function(err){
                $ionicLoading.hide();
            }
        );
    }

});











var folderFlieName = '';

control.controller('filesListCtrl', function($scope, $state, $ionicModal,$ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate,$ionicLoading,$ionicPopup,$location,$http,$ionicActionSheet){
    var imagefile = '';
    $scope.folder = {};
    $scope.homeFileName = homeFileName;
    $scope.userDetailArray = userDetailArray;
    //console.log(JSON.stringify(fileList));

    var fileListArray = [];
    for (var i = 0; i < fileList.length; i++) {
        var imageData = (fileList[i].name).split(".").reverse();
        //console.log(imageData)
        if(imageData.length > 1){
            var fileSize;
            if(fileList[i].file_size >= (1024*1024)){
                fileSize = Math.round((fileList[i].file_size/(1024*1024)))+'MB';
            }else{
                fileSize = Math.round((fileList[i].file_size/1024))+'KB'; 
            }
            var created_atData = ', modified '+relative_time(fileList[i].created_at); 
            fileListArray.push({'id':fileList[i].id,'name':fileList[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':fileList[i].folder,'url':fileList[i].url,'short_url':fileList[i].short_url,'created_at':created_atData,'date':fileList[i].created_at});
        }else{
            fileListArray.push({'id':fileList[i].id,'name':fileList[i].name,'image':'img/folder_ic.png','size':'','folder':fileList[i].folder,'date':fileList[i].created_at});
        }
    };
    //alert(JSON.stringify(fileListArray));
    $scope.fileList = fileListArray;

    $ionicModal.fromTemplateUrl('addFiles.html',{
            scope: $scope,
            animation: 'slide-in-up'
    }).then(function(modal) {
            $scope.addFilesModal = modal;
    });


    $scope.data = {
        showDelete: false
    };
      
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event, item) {
        $scope.itemDelRen = item;
        $scope.folderOption = $scope.itemDelRen.folder;
        $scope.popover.show($event);
    };


    $ionicPopover.fromTemplateUrl('share-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.sharePopover = popover;
    });

    $scope.frdShareFtn = function($event){
        $scope.sharePopover.show($event);
    }

    $scope.emailshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaEmail(
              "I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
              'MAB Files Backup',
              [], // TO: must be null or an array
              [], // CC: must be null or an array
              null, // BCC: must be null or an array
              [res.filePath], // FILES: can be null, a string, or an array
              function(Success){
                console.log(JSON.stringify(Success));
              }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
              function(onError){
                console.log(JSON.stringify(onError));
              } // called when sh*t hits the fan
            );
          }
        },'jpg',50,'myScreenShot');


        
    }

    $scope.fbshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", [res.filePath] /* img */, null /* url */, 'Paste it dude!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
          }
        },'jpg',50,'myScreenShot');
        
    }

    $scope.twitshareFtn = function(){
        $scope.sharePopover.hide(); 
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaTwitter("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/", [res.filePath] /* img */, '');
          }
        },'jpg',50,'myScreenShot');
        
    }



    $ionicModal.fromTemplateUrl('settingPage.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingPageModal = modal;
    });

    $ionicModal.fromTemplateUrl('privacy.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacyModal = modal;
    });

    $scope.privacyFtn = function(){
        $scope.privacyModal.show();
    }

    $ionicPopover.fromTemplateUrl('setting-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.settingPopover = popover;
    });
    
    $scope.changePercentageVal = '%';
    $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
    $scope.changePercentage = function(){
        if($scope.changePercentageVal == '%'){
            $scope.changePercentageVal = 'MB';
            //$('#changePercentage').css({'background-image':'url(img/mb.png)','background-size':'100% 100%'})
            var valDet = ((parseInt($scope.userDetailArray.space_used)/256)*100);
            $scope.changePercentageDet = valDet+' % of 100 %';
            
        }else{
            //$('#changePercentage').css({'background-image':'url(img/precentage.png)','background-size':'100% 100%'})
            $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
            $scope.changePercentageVal = '%';
        }
    }

    $scope.settingFtn = function($event){
        $scope.settingPopover.show($event);
    }

    var name_sort_desc = function (a, b) {
            return a.name < b.name;
    }

    $scope.alignAZFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $scope.settingPopover.hide();
        var dateArrangement = [];
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }

        setTimeout(function(){
            $scope.fileList = dateArrangement.sort(name_sort_desc);
            $ionicLoading.hide();
        },5000);
    }

    var date_sort_desc = function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }; 

    $scope.alignDateFtn = function(){
        var dateArrangement = [];
        $scope.settingPopover.hide();
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }
        
        $scope.fileList = dateArrangement.sort(date_sort_desc);

    }

    $scope.alignTypeFtn =function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $scope.settingPopover.hide();
        var ContentType = [];
        $scope.values = ['mp4','MOV','mp3','pdf','zip','jpg','png','xls','docx','doc','txt','xgl','html','ivr'];
        $scope.filesDetail = '';
        $scope.settingPopover.hide();
        var roundData = 0; 
        //for (var i = 0; i < fileListArray.length; i++) {
            //if(fileListArray[i].content_type){

                for (var j = 0; j < $scope.values.length; j++) {
                    roundData = roundData + 1;
                    for (var z = 0; z < fileListArray.length; z++) {
                        
                        if(fileListArray[z].content_type){
                            var imageData = (fileListArray[z].name).split(".").reverse();

                            if(imageData[0] == $scope.values[j]){
                                console.log("imageData[0] : "+imageData[0]);
                                ContentType.push(fileListArray[z]);
                            }
                        }else{
                            if(roundData == 1){
                                ContentType.push(fileListArray[z]); 
                            }
                        }
                    };
                    
                };
            //}else{
               //$scope.ContentType.push(fileListArray[i]); 
            //}
        //};
        console.log(JSON.stringify(ContentType));
        setTimeout(function() {
            $ionicLoading.hide();
            $scope.fileList = ContentType;
        }, 5000);

    }

    $scope.alignSettingFtn = function(){
        $scope.settingPopover.hide();
        $scope.settingPageModal.show();
        
        if($scope.userDetailArray.avatar){
            $('.circle').css({'background-image':'url('+$scope.userDetailArray.avatar+')','background-size':'100% 100%'});
        }else{
            $('.circle').css({'background-image':'url(img/frame.png)','background-size':'100% 100%;'});
        }
    }

    $scope.shareData = function(dataPath) {
        $scope.popover.hide();
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: 'FaceBook' },
           { text: 'Twitter' },
           { text: 'Email' },
         ],
         
         titleText: 'Are you want to share this file!',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
            if(index == 2){
                
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaEmail(
                      "Download Link:- "+dataPath.short_url, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                      'MAB Files Backup',
                      [], // TO: must be null or an array
                      [], // CC: must be null or an array
                      null, // BCC: must be null or an array
                      [res.filePath], // FILES: can be null, a string, or an array
                      function(success){

                      }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
                      function(onError){

                      } // called when sh*t hits the fan
                    );
                  }
                },'jpg',50,'myScreenShot');
                
            }else if(index == 1){
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaTwitter("Download Link:- "+dataPath.short_url, [res.filePath], '');
                  }
                },'jpg',50,'myScreenShot');
                

            }else{
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaFacebook("Download Link:- "+dataPath.short_url, [res.filePath], null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
                  }
                },'jpg',50,'myScreenShot');
                
            }
            return true;
         }
        });
    }


    $scope.filesListBack = function(){
        $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key}})
        .success(function(data, status, headers, config){

                    $ionicLoading.hide();
                    filesDetail = data;
                    $state.go('home');
        })
        .error(function(data, status, headers, config){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                     
            });
        })
        
    }

    $scope.uploadFtn = function(){
        $scope.addFilesModal.show();
    }

    $scope.filePath = '';
    //var formData = new FormData();
    //formData.append("api_key",loginStorage.api_key);
   
    //formData.append("folder_id",folderDetails.id);
    //$("#newfiles").change(function(){
         
    //})
    $scope.addgetPhoto1 = function(){

        addgetPhoto(pictureSource.PHOTOLIBRARY);
    }

    $scope.filesCreateFtn = function(){

        if(subscriberImage){
            $scope.filePath = 'Home/'+$scope.homeFileName+'/'+subscriberImage;

            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });

            cordova.exec(function(response){
                        $scope.filePath = 'Home/'+$scope.homeFileName+'/'+JSON.parse(response).name;
                        $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':folderDetails.id}})
                        .success(function(data, status, headers, config){
                            $ionicLoading.hide();
                            if(data.length > 0){
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);    
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                $scope.fileList = fileListArray;
                                $scope.addFilesModal.hide();
                            }else{
                                
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'No file in this folder!'
                                });
                                alertPopup.then(function(res) {
                                    fileListArray = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var imageData = (data[i].name).split(".").reverse();
                                        if(imageData.length > 1){
                                            var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                            var created_atData = ', modified '+relative_time(data[i].created_at);
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                        }else{
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                        }
                                    };
                                    
                                    $scope.fileList = fileListArray;
                                    $scope.addFilesModal.hide();
                                });
                                     
                            }

                        })
                        .error(function(data, status, headers, config){
                            alert(JSON.stringify(data));
                            $ionicLoading.hide();
                        })
                    },function(e){alert(e); $ionicLoading.hide();}, "Echo", "echo", ["300", "300", "file", subscriberImage, "http://build.myappbuilder.com/api/files/new.json?", "POST", {"api_key":loginStorage.api_key,'folder_id':folderDetails.id}])
                    
        }else{
        	
            var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: 'Please select file!'
                });
                alertPopup.then(function(res) {
                   
                });
        }
    }

    $scope.onItemDelete = function(item) {

        $scope.popover.hide();
        $scope.fileList.splice($scope.fileList.indexOf(item), 1);
        
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $http({method:"DELETE", url:'http://build.myappbuilder.com/api/files/destroy.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':item.id}})
        .success(function(data,status,headers,config){
            $ionicLoading.hide();
            
        })
        .error(function(data,status,headers,config){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                     
            });
        })
    };

      
    $ionicModal.fromTemplateUrl('editFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editFolderModal = modal;
    });

  
    $scope.onItemRename = function(item){
        $scope.folder.editname = '';
        $scope.popover.hide();
        $scope.editFolderModal.show();
        $scope.folder.editId = item.id;
        //$scope.folder.editname = item.name;
        var editFileName = (item.name).split('.').reverse();
        if(editFileName.length > 1){
            for (var i = (editFileName.length-1); i > 0; i--) {
                $scope.folder.editname = $scope.folder.editname+editFileName[i];
            };
            

            $scope.editFileExtention = editFileName[0];
        }else{
            $scope.folder.editname = editFileName[0];
            $scope.editFileExtention = '';
        }
       
    }

    $scope.folderEditFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });

        if($scope.editFileExtention){
            var rootEditFileName = $scope.folder.editname+'.'+$scope.editFileExtention;
        }else{
            var rootEditFileName = $scope.folder.editname;
        }
        console.log("rootEditFileName : "+rootEditFileName);
        $http({method:'PUT', url:'http://build.myappbuilder.com/api/files/rename.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':$scope.folder.editId, 'name':rootEditFileName}})
        .success(function(data,status,headers,config){
            
            $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key, 'folder_id':folderDetails.id}})
            .success(function(data, status, headers, config){

                    $ionicLoading.hide();
                    fileListArray = [];
                    for (var i = 0; i < data.length; i++) {
                        var imageData = (data[i].name).split(".").reverse();
                        if(imageData.length > 1){
                            var fileSize;
                            if(data[i].file_size >= (1024*1024)){
                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                            }else{
                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                            }
                            var created_atData = ', modified '+relative_time(data[i].created_at);
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                        }else{
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                        }
                    };
                    $scope.fileList = fileListArray;
                    $scope.editFolderModal.hide();
            })
            .error(function(data, status, headers, config){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'MABFiles',
                     template: 'Something went wrong! Plase try again'
                    });
                    alertPopup.then(function(res) {
                      $state.go('login');
                    });
            })
        })
        .error(function(data,status,headers,config){
            //alert(JSON.stringify(data))
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong! Plase try again'
            });
            alertPopup.then(function(res) {
                $scope.editFolderModal.hide();  
                $state.go('login');   
            });
        })
    }

    $ionicModal.fromTemplateUrl('addFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addFolderModal = modal;
    });

    $scope.addFolderFtn = function(){
        $scope.addFolderModal.show();
    }

    $scope.folderCreateFtn = function(){
        var formData = new FormData();
        formData.append("api_key",loginStorage.api_key);
        formData.append("name",$scope.folder.name);
        formData.append("folder_id",folderDetails.id);
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.folder.name){
            $http.post('http://build.myappbuilder.com/api/folders.json', formData,{
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
            })
            .success(function(data,status,headers,config){
                $scope.folder= {};
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':folderDetails.id}})
                    .success(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $ionicLoading.hide();
                        if(data.length > 0){
                            fileListArray = [];
                            for (var i = 0; i < data.length; i++) {
                                var imageData = (data[i].name).split(".").reverse();
                                if(imageData.length > 1){
                                    var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                    var created_atData = ', modified '+relative_time(data[i].created_at);    
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                }else{
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                }
                            };
                            $scope.fileList = fileListArray;
                            $scope.addFolderModal.hide();
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'MABFiles',
                                template: 'No file in this folder!'
                            });
                            alertPopup.then(function(res) {
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                
                                $scope.fileList = fileListArray;
                                $scope.addFolderModal.hide();
                            });
                                 
                        }

                    })
                    .error(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $ionicLoading.hide();
                        $scope.folder= {};
                        //alert(JSON.stringify(data));
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                        });
                    })
                    
            })
            .error(function(data, status, headers, config){
                    $ionicLoading.hide();
                    //alert(JSON.stringify(data));
                    $scope.folder= {};
                    //alert(JSON.stringify(data));
                    var alertPopup = $ionicPopup.alert({
                        title: 'MABFiles',
                        template: data.details
                    });
                    alertPopup.then(function(res) {
                    });
            })
        }else{
            
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Please fill the folder name!'
            });
            alertPopup.then(function(res) {
            });
            
        }
    }

        $scope.fileListFtn = function(file){
            subfolderDetails = file;
            subfileList = '';
            if(subfolderDetails.folder){
                folderFlieName = subfolderDetails.name;
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                });
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails.id}})
                .success(function(data, status, headers, config){
                    //alert(JSON.stringify(data));
                    $ionicLoading.hide();
                    if(data.length > 0){
                        subfileList = data;
                        $state.go('subfilesList');
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'No file in this folder!'
                        });
                        alertPopup.then(function(res) {
                            //subfileList = data;
                            $state.go('subfilesList');
                        });
                             
                    }

                })
                .error(function(data, status, headers, config){
                    alert(JSON.stringify(data));
                    $ionicLoading.hide();
                })
            }else{

            }
        }


        $scope.downloadFile = function(dataPath){
            $scope.popover.hide();
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fs)
                {           var ft = new FileTransfer();
                            ft.onprogress = function(progressEvent) {
                                if (progressEvent.lengthComputable) {
                                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                    console.log(perc + "%");
                                    
                                }else {
                                    console.log("Loading");
                                }
                            }

                            console.log(dataPath.url+" : "+ fs.root.toURL());
                            var filePathRoot = fs.root.toURL()+'/MABFiles/'+dataPath.name;
                            ft.download(dataPath.url, filePathRoot, 
                                function(entry){
                                    $ionicLoading.hide();
                                    console.log(JSON.stringify(entry));
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'MABFiles',
                                        template: 'Download completed successfully!'
                                    });
                                    alertPopup.then(function(res) {
                                       
                                    });
                                },
                                function(error){
                                    $ionicLoading.hide();
                                    console.log(JSON.stringify(error));
                                }
                            );
                },function(err){
                    $ionicLoading.hide();
                }
            );
        }


});







control.controller('subfilesListCtrl', function($scope, $state, $ionicModal,$ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate,$ionicLoading,$ionicPopup,$location,$http,$ionicActionSheet){
    var imagefile = '';
    $scope.folder = {};
    $scope.userDetailArray = userDetailArray;
    $scope.homeFileName = homeFileName;
    $scope.folderFlieName = folderFlieName;
    $scope.data = {
        showDelete: false
    };

    //console.log("HI: "+JSON.stringify(subfileList));

    var fileListArray = [];
    for (var i = 0; i < subfileList.length; i++) {
        var imageData = (subfileList[i].name).split(".").reverse();
        //console.log(imageData)
        if(imageData.length > 1){
            var fileSize;
            if(subfileList[i].file_size >= (1024*1024)){
                fileSize = Math.round((subfileList[i].file_size/(1024*1024)))+'MB';
            }else{
                fileSize = Math.round((subfileList[i].file_size/1024))+'KB'; 
            }
            var created_atData = ', modified '+relative_time(subfileList[i].created_at);
            fileListArray.push({'id':subfileList[i].id,'name':subfileList[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':subfileList[i].folder,'short_url':subfileList[i].short_url,'url':subfileList[i].url,'created_at':created_atData,'date':subfileList[i].created_at});
        }else{
            fileListArray.push({'id':subfileList[i].id,'name':subfileList[i].name,'image':'img/folder_ic.png','size':'','folder':subfileList[i].folder});
        }
    };
    //console.log("HELLO : "+JSON.stringify(fileListArray));
    $scope.subfileList = fileListArray;

    $scope.subfilesListBack = function(){
        $state.go('filesList');
    }

    $scope.homeListBack = function(){
        $state.go('home');
    }

    $ionicModal.fromTemplateUrl('addFiles.html',{
            scope: $scope,
            animation: 'slide-in-up'
    }).then(function(modal) {
            $scope.addFilesModal = modal;
    });

    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $ionicModal.fromTemplateUrl('addFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addFolderModal = modal;
    });

    $scope.addFolderFtn = function(){
        $scope.addFolderModal.show();
    }

    $scope.folderCreateFtn = function(){
        var formData = new FormData();
        formData.append("api_key",loginStorage.api_key);
        formData.append("name",$scope.folder.name);
        formData.append("folder_id",subfolderDetails.id);
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.folder.name){
            $http.post('http://build.myappbuilder.com/api/folders.json', formData,{
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
            })
            .success(function(data,status,headers,config){
                $scope.folder= {};
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails.id}})
                    .success(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $ionicLoading.hide();
                        if(data.length > 0){
                            fileListArray = [];
                            for (var i = 0; i < data.length; i++) {
                                var imageData = (data[i].name).split(".").reverse();
                                if(imageData.length > 1){
                                    var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                    var created_atData = ', modified '+relative_time(data[i].created_at);    
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                }else{
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                }
                            };
                            $scope.subfileList = fileListArray;
                            $scope.addFolderModal.hide();
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'MABFiles',
                                template: 'No file in this folder!'
                            });
                            alertPopup.then(function(res) {
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                
                                $scope.subfileList = fileListArray;
                                $scope.addFolderModal.hide();
                            });
                                 
                        }

                    })
                    .error(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $scope.folder= {};
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                        });
                    })
                    
            })
            .error(function(data, status, headers, config){
                $ionicLoading.hide();
                $scope.folder= {};
                //alert(JSON.stringify(data));
                var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: data.details
                });
                alertPopup.then(function(res) {
                });
            })
        }else{
            
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Please fill the folder name!'
            });
            alertPopup.then(function(res) {
            });
            
        }
    }


    $scope.openPopover = function($event, item) {
        $scope.itemDelRen = item;
        $scope.folderOption = $scope.itemDelRen.folder;
        $scope.popover.show($event);
    };

    $ionicPopover.fromTemplateUrl('share-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.sharePopover = popover;
    });

    $scope.frdShareFtn = function($event){
        $scope.sharePopover.show($event);
    }


    $scope.emailshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaEmail(
              "I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
              'MAB Files Backup',
              [], // TO: must be null or an array
              [], // CC: must be null or an array
              null, // BCC: must be null or an array
              [res.filePath], // FILES: can be null, a string, or an array
              function(Success){
                console.log(JSON.stringify(Success));
              }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
              function(onError){
                console.log(JSON.stringify(onError));
              } // called when sh*t hits the fan
            );
          }
        },'jpg',50,'myScreenShot');


        
    }

    $scope.fbshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", [res.filePath] /* img */, null /* url */, 'Paste it dude!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
          }
        },'jpg',50,'myScreenShot');
        
    }

    $scope.twitshareFtn = function(){
        $scope.sharePopover.hide(); 
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaTwitter("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/", [res.filePath] /* img */, '');
          }
        },'jpg',50,'myScreenShot');
        
    }


    $ionicModal.fromTemplateUrl('settingPage.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingPageModal = modal;
    });

    $ionicModal.fromTemplateUrl('privacy.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacyModal = modal;
    });

    $scope.privacyFtn = function(){
        $scope.privacyModal.show();
    }

    $ionicPopover.fromTemplateUrl('setting-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.settingPopover = popover;
    });

    $scope.changePercentageVal = '%';
    $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
    $scope.changePercentage = function(){
        if($scope.changePercentageVal == '%'){
            $scope.changePercentageVal = 'MB';
            //$('#changePercentage').css({'background-image':'url(img/mb.png)','background-size':'100% 100%'})
            var valDet = ((parseInt($scope.userDetailArray.space_used)/256)*100);
            $scope.changePercentageDet = valDet+' % of 100 %';
            
        }else{
            //$('#changePercentage').css({'background-image':'url(img/precentage.png)','background-size':'100% 100%'})
            $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
            $scope.changePercentageVal = '%';
        }
    }

    
    $scope.settingFtn = function($event){
        $scope.settingPopover.show($event);
    }

    var name_sort_desc = function (a, b) {
        return a.name < b.name;
    }
        
    $scope.alignAZFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });

        $scope.settingPopover.hide();
        var dateArrangement = [];
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }
        
        setTimeout(function(){
            $scope.subfileList = dateArrangement.sort(name_sort_desc);
            $ionicLoading.hide();
        },5000);
    }

    var date_sort_desc = function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }; 

    $scope.alignDateFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        var dateArrangement = [];
        $scope.settingPopover.hide();
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }

        setTimeout(function(){
            $scope.subfileList = dateArrangement.sort(date_sort_desc);
            $ionicLoading.hide();
        },5000);

    }

    $scope.alignTypeFtn =function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $scope.settingPopover.hide();
        var ContentType = [];
        $scope.values = ['mp4','MOV','mp3','pdf','zip','jpg','png','xls','docx','doc','txt','xgl','html','ivr'];
        $scope.filesDetail = '';
        $scope.settingPopover.hide();
        var roundData = 0; 
        //for (var i = 0; i < fileListArray.length; i++) {
            //if(fileListArray[i].content_type){

                for (var j = 0; j < $scope.values.length; j++) {
                    roundData = roundData + 1;
                    for (var z = 0; z < fileListArray.length; z++) {
                        
                        if(fileListArray[z].content_type){
                            var imageData = (fileListArray[z].name).split(".").reverse();
                            if(imageData[0] == $scope.values[j]){
                                console.log("imageData[0] : "+imageData[0]);
                                ContentType.push(fileListArray[z]);
                            }
                        }else{
                            if(roundData == 1){
                                ContentType.push(fileListArray[z]); 
                            }
                        }
                    };
                    
                };
            //}else{
               //$scope.ContentType.push(fileListArray[i]); 
            //}
        //};
        console.log(JSON.stringify("$scope.ContentType : "+ContentType));
        

        setTimeout(function() {
                    $ionicLoading.hide();
                    $scope.subfileList = ContentType;
                }, 5000);
    }

    $scope.alignSettingFtn = function(){
        $scope.settingPopover.hide();
        $scope.settingPageModal.show();

        if($scope.userDetailArray.avatar){
            $('.circle').css({'background-image':'url('+$scope.userDetailArray.avatar+')','background-size':'100% 100%'});
        }else{
            $('.circle').css({'background-image':'url(img/frame.png)','background-size':'100% 100%;'});
        }
    }
    
    $scope.shareData = function(dataPath) {
        $scope.popover.hide();
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: 'FaceBook' },
           { text: 'Twitter' },
           { text: 'Email' },
         ],
         
         titleText: 'Are you want to share this file!',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
            if(index == 2){
                
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaEmail(
                      "Download Link:- "+dataPath.short_url, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                      'MAB Files Backup',
                      [], // TO: must be null or an array
                      [], // CC: must be null or an array
                      null, // BCC: must be null or an array
                      [res.filePath], // FILES: can be null, a string, or an array
                      function(success){

                      }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
                      function(onError){

                      } // called when sh*t hits the fan
                    );
                  }
                },'jpg',50,'myScreenShot');
                
            }else if(index == 1){
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaTwitter("Download Link:- "+dataPath.short_url, [res.filePath], '');
                  }
                },'jpg',50,'myScreenShot');
                

            }else{
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaFacebook("Download Link:- "+dataPath.short_url, [res.filePath], null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
                  }
                },'jpg',50,'myScreenShot');
                
            }
            return true;
         }
        });
    }


    $scope.filePath = '';

    $scope.uploadFtn = function(){

        $scope.addFilesModal.show();

    }

    //var formData = new FormData();
    //formData.append("api_key",loginStorage.api_key);
   
    //formData.append("folder_id",subfolderDetails.id);
    //$("#newfiles").change(function(){
         
    //});
    $scope.addgetPhoto1 = function(){
        addgetPhoto(pictureSource.PHOTOLIBRARY);
    }

    $scope.filesCreateFtn = function(){
        if(subscriberImage){
            $scope.filePath = 'Home/'+$scope.homeFileName+'/'+folderFlieName+'/'+subscriberImage;
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });
            cordova.exec(function(response){
                
                        $scope.filePath = 'Home/'+$scope.homeFileName+'/'+folderFlieName+'/'+JSON.parse(response).name;
                        $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails.id}})
                        .success(function(data, status, headers, config){
                            //$("#newfiles").val('');
                            $ionicLoading.hide();
                            if(data.length > 0){
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);    
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                $scope.subfileList = fileListArray;
                                $scope.addFilesModal.hide();
                            }else{
                                
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'No file in this folder!'
                                });
                                alertPopup.then(function(res) {
                                    fileListArray = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var imageData = (data[i].name).split(".").reverse();
                                        if(imageData.length > 1){
                                            var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                            var created_atData = ', modified '+relative_time(data[i].created_at);
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                        }else{
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                        }
                                    };
                                    
                                    $scope.subfileList = fileListArray;
                                    $scope.addFilesModal.hide();
                                });
                                     
                            }

                        })
                        .error(function(data, status, headers, config){
                            alert(JSON.stringify(data));
                            $ionicLoading.hide();
                        })
                    },function(e){alert(e); $ionicLoading.hide();}, "Echo", "echo", ["300", "300", "file", subscriberImage, "http://build.myappbuilder.com/api/files/new.json?", "POST", {"api_key":loginStorage.api_key,"folder_id":subfolderDetails.id}])
                    
        }else{
            var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: 'Please select file!'
                });
                alertPopup.then(function(res) {
                   
                });
        }
    }




    $scope.onItemDelete = function(item) {

        $scope.popover.hide();
        $scope.subfileList.splice($scope.subfileList.indexOf(item), 1);
        
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $http({method:"DELETE", url:'http://build.myappbuilder.com/api/files/destroy.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':item.id}})
        .success(function(data,status,headers,config){
            $ionicLoading.hide();
            
        })
        .error(function(data,status,headers,config){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                     
            });
        })
    };

      
    $ionicModal.fromTemplateUrl('editFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editFolderModal = modal;
    });

  
    $scope.onItemRename = function(item){
        $scope.folder.editname = '';
        $scope.popover.hide();
        $scope.editFolderModal.show();
        $scope.folder.editId = item.id;
        //$scope.folder.editname = item.name;
        var editFileName = (item.name).split('.').reverse();
        if(editFileName.length > 1){
            for (var i = (editFileName.length-1); i > 0; i--) {
                $scope.folder.editname = $scope.folder.editname+editFileName[i];
            };
            
            $scope.editFileExtention = editFileName[0];
        }else{
            $scope.folder.editname = editFileName[0];
            $scope.editFileExtention = '';
        }
        
    }

    $scope.folderEditFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.editFileExtention){
            var rootEditFileName = $scope.folder.editname+'.'+$scope.editFileExtention;
        }else{
            var rootEditFileName = $scope.folder.editname;
        }
        console.log("rootEditFileName2 : "+rootEditFileName);
        $http({method:'PUT', url:'http://build.myappbuilder.com/api/files/rename.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':$scope.folder.editId, 'name':rootEditFileName}})
        .success(function(data,status,headers,config){
            
            $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key, 'folder_id':subfolderDetails.id}})
            .success(function(data, status, headers, config){

                    $ionicLoading.hide();
                    fileListArray = [];
                    for (var i = 0; i < data.length; i++) {
                        var imageData = (data[i].name).split(".").reverse();
                        if(imageData.length > 1){
                            var fileSize;
                            if(data[i].file_size >= (1024*1024)){
                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                            }else{
                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                            }
                            var created_atData = ', modified '+relative_time(data[i].created_at);
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                        }else{
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                        }
                    };
                    $scope.subfileList = fileListArray;
                    $scope.editFolderModal.hide();
            })
            .error(function(data, status, headers, config){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'MABFiles',
                     template: 'Something went wrong!'
                    });
                    alertPopup.then(function(res) {
                     
                    });
            })
        })
        .error(function(data,status,headers,config){
            //alert(JSON.stringify(data))
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                $scope.editFolderModal.hide();     
            });
        })
    }



    
        $scope.fileListFtn = function(file){
            subfolderDetails1 = file;
            subfileList1 = '';
            if(subfolderDetails1.folder){
                folderFlieName1 = subfolderDetails1.name;
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                });
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails1.id}})
                .success(function(data, status, headers, config){
                    //alert(JSON.stringify(data));
                    $ionicLoading.hide();
                    if(data.length > 0){
                        subfileList1 = data;
                        $state.go('subfilesList1');
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'No file in this folder!'
                        });
                        alertPopup.then(function(res) {
                            //subfileList = data;
                            $state.go('subfilesList1');
                        });
                             
                    }

                })
                .error(function(data, status, headers, config){
                    alert(JSON.stringify(data));
                    $ionicLoading.hide();
                })
            }else{

            }
        }


    
    $scope.downloadFile = function(dataPath){
        $scope.popover.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fs)
            {           var ft = new FileTransfer();
                        ft.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                console.log(perc + "%");
                                
                            }else {
                                console.log("Loading");
                            }
                        }

                        console.log(dataPath.url+" : "+ fs.root.toURL());
                        var filePathRoot = fs.root.toURL()+'/MABFiles/'+dataPath.name;
                        ft.download(dataPath.url, filePathRoot, 
                            function(entry){
                                console.log(JSON.stringify(entry));
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'Download completed successfully!'
                                });
                                alertPopup.then(function(res) {
                                   
                                });
                            },
                            function(error){
                                $ionicLoading.hide();
                                console.log(JSON.stringify(error));
                            }
                        );
            },function(err){
                $ionicLoading.hide();
            }
        );
    }

});










var folderFlieName1 = '';

control.controller('subfilesList1Ctrl', function($scope, $state, $ionicModal,$ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate,$ionicLoading,$ionicPopup,$location,$http,$ionicActionSheet){
    var imagefile = '';
    $scope.folder = {};
    $scope.userDetailArray = userDetailArray;
    $scope.homeFileName = homeFileName;
    $scope.folderFlieName = folderFlieName;
    $scope.folderFlieName1 = folderFlieName1;
    $scope.data = {
        showDelete: false
    };

    //console.log("HI: "+JSON.stringify(subfileList));

    var fileListArray = [];
    for (var i = 0; i < subfileList1.length; i++) {
        var imageData = (subfileList1[i].name).split(".").reverse();
        //console.log(imageData)
        if(imageData.length > 1){
            var fileSize;
            if(subfileList1[i].file_size >= (1024*1024)){
                fileSize = Math.round((subfileList1[i].file_size/(1024*1024)))+'MB';
            }else{
                fileSize = Math.round((subfileList1[i].file_size/1024))+'KB'; 
            }
            var created_atData = ', modified '+relative_time(subfileList1[i].created_at);
            fileListArray.push({'id':subfileList1[i].id,'name':subfileList1[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':subfileList1[i].folder,'short_url':subfileList1[i].short_url,'url':subfileList1[i].url,'created_at':created_atData,'date':subfileList1[i].created_at});
        }else{
            fileListArray.push({'id':subfileList1[i].id,'name':subfileList1[i].name,'image':'img/folder_ic.png','size':'','folder':subfileList1[i].folder});
        }
    };
    //console.log("HELLO : "+JSON.stringify(fileListArray));
    $scope.subfileList1 = fileListArray;

    $scope.subfilesList1Back = function(){
        $state.go('subfilesList');
    }

    $scope.subfilesListBack = function(){
        $state.go('filesList');
    }

    $scope.homeListBack = function(){
        $state.go('home');
    }

    $ionicModal.fromTemplateUrl('addFiles.html',{
            scope: $scope,
            animation: 'slide-in-up'
    }).then(function(modal) {
            $scope.addFilesModal = modal;
    });


    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $ionicModal.fromTemplateUrl('addFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addFolderModal = modal;
    });

    $scope.addFolderFtn = function(){
        $scope.addFolderModal.show();
    }

    $scope.folderCreateFtn = function(){
        var formData = new FormData();
        formData.append("api_key",loginStorage.api_key);
        formData.append("name",$scope.folder.name);
        formData.append("folder_id",subfolderDetails1.id);
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.folder.name){
            $http.post('http://build.myappbuilder.com/api/folders.json', formData,{
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
            })
            .success(function(data,status,headers,config){
                $scope.folder= {};
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails1.id}})
                    .success(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $ionicLoading.hide();
                        if(data.length > 0){
                            fileListArray = [];
                            for (var i = 0; i < data.length; i++) {
                                var imageData = (data[i].name).split(".").reverse();
                                if(imageData.length > 1){
                                    var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                    var created_atData = ', modified '+relative_time(data[i].created_at);    
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                }else{
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                }
                            };
                            $scope.subfileList1 = fileListArray;
                            $scope.addFolderModal.hide();
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'MABFiles',
                                template: 'No file in this folder!'
                            });
                            alertPopup.then(function(res) {
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                
                                $scope.subfileList1 = fileListArray;
                                $scope.addFolderModal.hide();
                            });
                                 
                        }

                    })
                    .error(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $scope.folder= {};
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                        });
                    })
                    
            })
            .error(function(data, status, headers, config){
                $ionicLoading.hide();
                $scope.folder= {};
                //alert(JSON.stringify(data));
                var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: data.details
                });
                alertPopup.then(function(res) {
                });
            })
        }else{
            
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Please fill the folder name!'
            });
            alertPopup.then(function(res) {
            });
            
        }
    }

    $scope.openPopover = function($event, item) {
        $scope.itemDelRen = item;
        $scope.folderOption = $scope.itemDelRen.folder;
        $scope.popover.show($event);
    };

    $ionicPopover.fromTemplateUrl('share-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.sharePopover = popover;
    });

    $scope.frdShareFtn = function($event){
        $scope.sharePopover.show($event);
    }


    $scope.emailshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaEmail(
              "I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
              'MAB Files Backup',
              [], // TO: must be null or an array
              [], // CC: must be null or an array
              null, // BCC: must be null or an array
              [res.filePath], // FILES: can be null, a string, or an array
              function(Success){
                console.log(JSON.stringify(Success));
              }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
              function(onError){
                console.log(JSON.stringify(onError));
              } // called when sh*t hits the fan
            );
          }
        },'jpg',50,'myScreenShot');


        
    }

    $scope.fbshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", [res.filePath] /* img */, null /* url */, 'Paste it dude!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
          }
        },'jpg',50,'myScreenShot');
        
    }

    $scope.twitshareFtn = function(){
        $scope.sharePopover.hide(); 
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaTwitter("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/", [res.filePath] /* img */, '');
          }
        },'jpg',50,'myScreenShot');
        
    }




    $ionicModal.fromTemplateUrl('settingPage.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingPageModal = modal;
    });

    $ionicModal.fromTemplateUrl('privacy.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacyModal = modal;
    });

    $scope.privacyFtn = function(){
        $scope.privacyModal.show();
    }

    $ionicPopover.fromTemplateUrl('setting-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.settingPopover = popover;
    });

    $scope.changePercentageVal = '%';
    $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
    $scope.changePercentage = function(){
        if($scope.changePercentageVal == '%'){
            $scope.changePercentageVal = 'MB';
            //$('#changePercentage').css({'background-image':'url(img/mb.png)','background-size':'100% 100%'})
            var valDet = ((parseInt($scope.userDetailArray.space_used)/256)*100);
            $scope.changePercentageDet = valDet+' % of 100 %';
            
        }else{
            //$('#changePercentage').css({'background-image':'url(img/precentage.png)','background-size':'100% 100%'})
            $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
            $scope.changePercentageVal = '%';
        }
    }

    
    $scope.settingFtn = function($event){
        $scope.settingPopover.show($event);
    }

    var name_sort_desc = function (a, b) {
            return a.name < b.name;
    }
        
    $scope.alignAZFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });

        $scope.settingPopover.hide();
        var dateArrangement = [];
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }
        
        setTimeout(function(){
            $scope.subfileList1 = dateArrangement.sort(name_sort_desc);
            $ionicLoading.hide();
        },5000);
    }

    var date_sort_desc = function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }; 

    $scope.alignDateFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        var dateArrangement = [];
        $scope.settingPopover.hide();
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }

        setTimeout(function(){
            $scope.subfileList1 = dateArrangement.sort(date_sort_desc);
            $ionicLoading.hide();
        },5000);

    }

    $scope.alignTypeFtn =function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $scope.settingPopover.hide();
        var ContentType = [];
        $scope.values = ['mp4','MOV','mp3','pdf','zip','jpg','png','xls','docx','doc','txt','xgl','html','ivr'];
        $scope.filesDetail = '';
        $scope.settingPopover.hide();
        var roundData = 0; 
        //for (var i = 0; i < fileListArray.length; i++) {
            //if(fileListArray[i].content_type){

                for (var j = 0; j < $scope.values.length; j++) {
                    roundData = roundData + 1;
                    for (var z = 0; z < fileListArray.length; z++) {
                        
                        if(fileListArray[z].content_type){
                            var imageData = (fileListArray[z].name).split(".").reverse();
                            if(imageData[0] == $scope.values[j]){
                                console.log("imageData[0] : "+imageData[0]);
                                ContentType.push(fileListArray[z]);
                            }
                        }else{
                            if(roundData == 1){
                                ContentType.push(fileListArray[z]); 
                            }
                        }
                    };
                    
                };
            //}else{
               //$scope.ContentType.push(fileListArray[i]); 
            //}
        //};
        console.log(JSON.stringify("$scope.ContentType : "+ContentType));
        

        setTimeout(function() {
                    $ionicLoading.hide();
                    $scope.subfileList1 = ContentType;
                }, 5000);
    }

    $scope.alignSettingFtn = function(){
        $scope.settingPopover.hide();
        $scope.settingPageModal.show();

        if($scope.userDetailArray.avatar){
            $('.circle').css({'background-image':'url('+$scope.userDetailArray.avatar+')','background-size':'100% 100%'});
        }else{
            $('.circle').css({'background-image':'url(img/frame.png)','background-size':'100% 100%;'});
        }
    }
    
    $scope.shareData = function(dataPath) {
        $scope.popover.hide();
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: 'FaceBook' },
           { text: 'Twitter' },
           { text: 'Email' },
         ],
         
         titleText: 'Are you want to share this file!',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
            if(index == 2){
                
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaEmail(
                      "Download Link:- "+dataPath.short_url, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                      'MAB Files Backup',
                      [], // TO: must be null or an array
                      [], // CC: must be null or an array
                      null, // BCC: must be null or an array
                      [res.filePath], // FILES: can be null, a string, or an array
                      function(success){

                      }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
                      function(onError){

                      } // called when sh*t hits the fan
                    );
                  }
                },'jpg',50,'myScreenShot');
                
            }else if(index == 1){
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaTwitter("Download Link:- "+dataPath.short_url, [res.filePath], '');
                  }
                },'jpg',50,'myScreenShot');
                

            }else{
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaFacebook("Download Link:- "+dataPath.short_url, [res.filePath], null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
                  }
                },'jpg',50,'myScreenShot');
                
            }
            return true;
         }
        });
    }


    $scope.filePath = '';

    $scope.uploadFtn = function(){

        $scope.addFilesModal.show();

    }

    //var formData = new FormData();
    //formData.append("api_key",loginStorage.api_key);
   
    //formData.append("folder_id",subfolderDetails.id);
    //$("#newfiles").change(function(){
         
    //});
    $scope.addgetPhoto1 = function(){
        addgetPhoto(pictureSource.PHOTOLIBRARY);
    }

    $scope.filesCreateFtn = function(){
        if(subscriberImage){
            $scope.filePath = 'Home/'+$scope.homeFileName+'/'+folderFlieName+'/'+folderFlieName1+'/'+subscriberImage;
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });
            cordova.exec(function(response){
                
                        $scope.filePath = 'Home/'+$scope.homeFileName+'/'+folderFlieName+'/'+folderFlieName1+'/'+JSON.parse(response).name;
                        $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails1.id}})
                        .success(function(data, status, headers, config){
                            //$("#newfiles").val('');
                            $ionicLoading.hide();
                            if(data.length > 0){
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);    
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                $scope.subfileList1 = fileListArray;
                                $scope.addFilesModal.hide();
                            }else{
                                
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'No file in this folder!'
                                });
                                alertPopup.then(function(res) {
                                    fileListArray = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var imageData = (data[i].name).split(".").reverse();
                                        if(imageData.length > 1){
                                            var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                            var created_atData = ', modified '+relative_time(data[i].created_at);
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                        }else{
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                        }
                                    };
                                    
                                    $scope.subfileList1 = fileListArray;
                                    $scope.addFilesModal.hide();
                                });
                                     
                            }

                        })
                        .error(function(data, status, headers, config){
                            //alert(JSON.stringify(data));
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                             title: 'MABFiles',
                             template: 'Something went wrong!'
                            });
                            alertPopup.then(function(res) {
                             
                            });
                        })
                    },function(e){alert(e); $ionicLoading.hide();}, "Echo", "echo", ["300", "300", "file", subscriberImage, "http://build.myappbuilder.com/api/files/new.json?", "POST", {"api_key":loginStorage.api_key,"folder_id":subfolderDetails1.id}])
                    
            
        }else{
            var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: 'Please select file!'
                });
                alertPopup.then(function(res) {
                   
                });
        }
    }




    $scope.onItemDelete = function(item) {

        $scope.popover.hide();
        $scope.subfileList1.splice($scope.subfileList1.indexOf(item), 1);
        
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $http({method:"DELETE", url:'http://build.myappbuilder.com/api/files/destroy.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':item.id}})
        .success(function(data,status,headers,config){
            $ionicLoading.hide();
            
        })
        .error(function(data,status,headers,config){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                     
            });
        })
    };

      
    $ionicModal.fromTemplateUrl('editFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editFolderModal = modal;
    });

  
    $scope.onItemRename = function(item){
        $scope.folder.editname = '';
        $scope.popover.hide();
        $scope.editFolderModal.show();
        $scope.folder.editId = item.id;
        //$scope.folder.editname = item.name;
        var editFileName = (item.name).split('.').reverse();
        if(editFileName.length > 1){
            for (var i = (editFileName.length-1); i > 0; i--) {
                $scope.folder.editname = $scope.folder.editname+editFileName[i];
            };
            
            $scope.editFileExtention = editFileName[0];
        }else{
            $scope.folder.editname = editFileName[0];
            $scope.editFileExtention = '';
        }
        
    }

    $scope.folderEditFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.editFileExtention){
            var rootEditFileName = $scope.folder.editname+'.'+$scope.editFileExtention;
        }else{
            var rootEditFileName = $scope.folder.editname;
        }
        console.log("rootEditFileName2 : "+rootEditFileName);
        $http({method:'PUT', url:'http://build.myappbuilder.com/api/files/rename.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':$scope.folder.editId, 'name':rootEditFileName}})
        .success(function(data,status,headers,config){
            
            $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key, 'folder_id':subfolderDetails1.id}})
            .success(function(data, status, headers, config){

                    $ionicLoading.hide();
                    fileListArray = [];
                    for (var i = 0; i < data.length; i++) {
                        var imageData = (data[i].name).split(".").reverse();
                        if(imageData.length > 1){
                            var fileSize;
                            if(data[i].file_size >= (1024*1024)){
                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                            }else{
                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                            }
                            var created_atData = ', modified '+relative_time(data[i].created_at);
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                        }else{
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                        }
                    };
                    $scope.subfileList1 = fileListArray;
                    $scope.editFolderModal.hide();
            })
            .error(function(data, status, headers, config){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'MABFiles',
                     template: 'Something went wrong!'
                    });
                    alertPopup.then(function(res) {
                     
                    });
            })
        })
        .error(function(data,status,headers,config){
            //alert(JSON.stringify(data))
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                $scope.editFolderModal.hide();     
            });
        })
    }

    
        $scope.fileListFtn = function(file){
            subfolderDetails2 = file;
            subfileList2 = '';
            if(subfolderDetails2.folder){
                folderFlieName2 = subfolderDetails2.name;
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                });
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails2.id}})
                .success(function(data, status, headers, config){
                    //alert(JSON.stringify(data));
                    $ionicLoading.hide();
                    if(data.length > 0){
                        subfileList2 = data;
                        $state.go('subfilesList2');
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'No file in this folder!'
                        });
                        alertPopup.then(function(res) {
                            //subfileList = data;
                            $state.go('subfilesList2');
                        });
                             
                    }

                })
                .error(function(data, status, headers, config){
                    alert(JSON.stringify(data));
                    $ionicLoading.hide();
                })
            }else{

            }
        }
    
    $scope.downloadFile = function(dataPath){
        $scope.popover.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fs)
            {           var ft = new FileTransfer();
                        ft.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                console.log(perc + "%");
                                
                            }else {
                                console.log("Loading");
                            }
                        }

                        console.log(dataPath.url+" : "+ fs.root.toURL());
                        var filePathRoot = fs.root.toURL()+'/MABFiles/'+dataPath.name;
                        ft.download(dataPath.url, filePathRoot, 
                            function(entry){
                                console.log(JSON.stringify(entry));
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'Download completed successfully!'
                                });
                                alertPopup.then(function(res) {
                                   
                                });
                            },
                            function(error){
                                $ionicLoading.hide();
                                console.log(JSON.stringify(error));
                            }
                        );
            },function(err){
                $ionicLoading.hide();
            }
        );
    }
        


});















var folderFlieName2 = '';

control.controller('subfilesList2Ctrl', function($scope, $state, $ionicModal,$ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate,$ionicLoading,$ionicPopup,$location,$http,$ionicActionSheet){
    var imagefile = '';
    $scope.folder = {};
    $scope.userDetailArray = userDetailArray;
    $scope.homeFileName = homeFileName;
    $scope.folderFlieName = folderFlieName;
    $scope.folderFlieName1 = folderFlieName1;
    $scope.folderFlieName2 = folderFlieName2;

    $scope.data = {
        showDelete: false
    };

    //console.log("HI: "+JSON.stringify(subfileList));

    var fileListArray = [];
    for (var i = 0; i < subfileList2.length; i++) {
        var imageData = (subfileList2[i].name).split(".").reverse();
        //console.log(imageData)
        if(imageData.length > 1){
            var fileSize;
            if(subfileList2[i].file_size >= (1024*1024)){
                fileSize = Math.round((subfileList2[i].file_size/(1024*1024)))+'MB';
            }else{
                fileSize = Math.round((subfileList2[i].file_size/1024))+'KB'; 
            }
            var created_atData = ', modified '+relative_time(subfileList2[i].created_at);
            fileListArray.push({'id':subfileList2[i].id,'name':subfileList2[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':subfileList2[i].folder,'short_url':subfileList2[i].short_url,'url':subfileList2[i].url,'created_at':created_atData,'date':subfileList2[i].created_at});
        }else{
            fileListArray.push({'id':subfileList2[i].id,'name':subfileList2[i].name,'image':'img/folder_ic.png','size':'','folder':subfileList2[i].folder});
        }
    };
    //console.log("HELLO : "+JSON.stringify(fileListArray));
    $scope.subfileList2 = fileListArray;
    $scope.subfilesList2Back = function(){
        $state.go('subfilesList1');
    }

    $scope.subfilesList1Back = function(){
        $state.go('subfilesList');
    }

    $scope.subfilesListBack = function(){
        $state.go('filesList');
    }

    $scope.homeListBack = function(){
        $state.go('home');
    }

    $ionicModal.fromTemplateUrl('addFiles.html',{
            scope: $scope,
            animation: 'slide-in-up'
    }).then(function(modal) {
            $scope.addFilesModal = modal;
    });


    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $ionicModal.fromTemplateUrl('addFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addFolderModal = modal;
    });

    $scope.addFolderFtn = function(){
        $scope.addFolderModal.show();
    }

    $scope.folderCreateFtn = function(){
        var formData = new FormData();
        formData.append("api_key",loginStorage.api_key);
        formData.append("name",$scope.folder.name);
        formData.append("folder_id",subfolderDetails2.id);
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.folder.name){
            $http.post('http://build.myappbuilder.com/api/folders.json', formData,{
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
            })
            .success(function(data,status,headers,config){
                $scope.folder= {};
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails2.id}})
                    .success(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $ionicLoading.hide();
                        if(data.length > 0){
                            fileListArray = [];
                            for (var i = 0; i < data.length; i++) {
                                var imageData = (data[i].name).split(".").reverse();
                                if(imageData.length > 1){
                                    var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                    var created_atData = ', modified '+relative_time(data[i].created_at);    
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                }else{
                                    fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                }
                            };
                            $scope.subfileList2 = fileListArray;
                            $scope.addFolderModal.hide();
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'MABFiles',
                                template: 'No file in this folder!'
                            });
                            alertPopup.then(function(res) {
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                        if(data[i].file_size >= (1024*1024)){
                                            fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                        }else{
                                            fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                        }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                
                                $scope.subfileList2 = fileListArray;
                                $scope.addFolderModal.hide();
                            });
                                 
                        }

                    })
                    .error(function(data, status, headers, config){
                        //alert(JSON.stringify(data));
                        $scope.folder= {};
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'Something went wrong!'
                        });
                        alertPopup.then(function(res) {
                        });
                    })
                    
            })
            .error(function(data, status, headers, config){
                $ionicLoading.hide();
                $scope.folder= {};
                //alert(JSON.stringify(data));
                var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: data.details
                });
                alertPopup.then(function(res) {
                });
            })
        }else{
            
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Please fill the folder name!'
            });
            alertPopup.then(function(res) {
            });
            
        }
    }

    $scope.openPopover = function($event, item) {
        $scope.itemDelRen = item;
        $scope.folderOption = $scope.itemDelRen.folder;
        $scope.popover.show($event);
    };

    $ionicPopover.fromTemplateUrl('share-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.sharePopover = popover;
    });

    $scope.frdShareFtn = function($event){
        $scope.sharePopover.show($event);
    }


    $scope.emailshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaEmail(
              "I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
              'MAB Files Backup',
              [], // TO: must be null or an array
              [], // CC: must be null or an array
              null, // BCC: must be null or an array
              [res.filePath], // FILES: can be null, a string, or an array
              function(Success){
                console.log(JSON.stringify(Success));
              }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
              function(onError){
                console.log(JSON.stringify(onError));
              } // called when sh*t hits the fan
            );
          }
        },'jpg',50,'myScreenShot');


        
    }

    $scope.fbshareFtn = function(){
        $scope.sharePopover.hide();
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/ ", [res.filePath] /* img */, null /* url */, 'Paste it dude!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
          }
        },'jpg',50,'myScreenShot');
        
    }

    $scope.twitshareFtn = function(){
        $scope.sharePopover.hide(); 
        navigator.screenshot.save(function(error,res){
          if(error){
            console.error(error);
          }else{
            console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
            window.plugins.socialsharing.shareViaTwitter("I've been using BackUp My Files and thought you might like it. it's a free way to bring all your anywhere and share them easily http://backupmyfil.es/", [res.filePath] /* img */, '');
          }
        },'jpg',50,'myScreenShot');
        
    }




    $ionicModal.fromTemplateUrl('settingPage.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingPageModal = modal;
    });

    $ionicModal.fromTemplateUrl('privacy.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.privacyModal = modal;
    });

    $scope.privacyFtn = function(){
        $scope.privacyModal.show();
    }

    $ionicPopover.fromTemplateUrl('setting-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.settingPopover = popover;
    });

    $scope.changePercentageVal = '%';
    $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
    $scope.changePercentage = function(){
        if($scope.changePercentageVal == '%'){
            $scope.changePercentageVal = 'MB';
            //$('#changePercentage').css({'background-image':'url(img/mb.png)','background-size':'100% 100%'})
            var valDet = ((parseInt($scope.userDetailArray.space_used)/256)*100);
            $scope.changePercentageDet = valDet+' % of 100 %';
            
        }else{
            //$('#changePercentage').css({'background-image':'url(img/precentage.png)','background-size':'100% 100%'})
            $scope.changePercentageDet = $scope.userDetailArray.space_used+' of 256 MB';
            $scope.changePercentageVal = '%';
        }
    }

    
    $scope.settingFtn = function($event){
        $scope.settingPopover.show($event);
    }

    var name_sort_desc = function (a, b) {
            return a.name < b.name;
    }
        
    $scope.alignAZFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });

        $scope.settingPopover.hide();
        var dateArrangement = [];
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }
        
        setTimeout(function(){
            $scope.subfileList2 = dateArrangement.sort(name_sort_desc);
            $ionicLoading.hide();
        },5000);
    }

    var date_sort_desc = function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }; 

    $scope.alignDateFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        var dateArrangement = [];
        $scope.settingPopover.hide();
        for (var i = 0; i < fileListArray.length; i++) {
            dateArrangement.push(fileListArray[i]);
        }

        setTimeout(function(){
            $scope.subfileList2 = dateArrangement.sort(date_sort_desc);
            $ionicLoading.hide();
        },5000);

    }

    $scope.alignTypeFtn =function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $scope.settingPopover.hide();
        var ContentType = [];
        $scope.values = ['mp4','MOV','mp3','pdf','zip','jpg','png','xls','docx','doc','txt','xgl','html','ivr'];
        $scope.filesDetail = '';
        $scope.settingPopover.hide();
        var roundData = 0; 
        //for (var i = 0; i < fileListArray.length; i++) {
            //if(fileListArray[i].content_type){

                for (var j = 0; j < $scope.values.length; j++) {
                    roundData = roundData + 1;
                    for (var z = 0; z < fileListArray.length; z++) {
                        
                        if(fileListArray[z].content_type){
                            var imageData = (fileListArray[z].name).split(".").reverse();
                            if(imageData[0] == $scope.values[j]){
                                console.log("imageData[0] : "+imageData[0]);
                                ContentType.push(fileListArray[z]);
                            }
                        }else{
                            if(roundData == 1){
                                ContentType.push(fileListArray[z]); 
                            }
                        }
                    };
                    
                };
            //}else{
               //$scope.ContentType.push(fileListArray[i]); 
            //}
        //};
        console.log(JSON.stringify("$scope.ContentType : "+ContentType));
        

        setTimeout(function() {
                    $ionicLoading.hide();
                    $scope.subfileList2 = ContentType;
                }, 5000);
    }

    $scope.alignSettingFtn = function(){
        $scope.settingPopover.hide();
        $scope.settingPageModal.show();

        if($scope.userDetailArray.avatar){
            $('.circle').css({'background-image':'url('+$scope.userDetailArray.avatar+')','background-size':'100% 100%'});
        }else{
            $('.circle').css({'background-image':'url(img/frame.png)','background-size':'100% 100%;'});
        }
    }
    
    $scope.shareData = function(dataPath) {
        $scope.popover.hide();
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: 'FaceBook' },
           { text: 'Twitter' },
           { text: 'Email' },
         ],
         
         titleText: 'Are you want to share this file!',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
            if(index == 2){
                
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaEmail(
                      "Download Link:- "+dataPath.short_url, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                      'MAB Files Backup',
                      [], // TO: must be null or an array
                      [], // CC: must be null or an array
                      null, // BCC: must be null or an array
                      [res.filePath], // FILES: can be null, a string, or an array
                      function(success){

                      }, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
                      function(onError){

                      } // called when sh*t hits the fan
                    );
                  }
                },'jpg',50,'myScreenShot');
                
            }else if(index == 1){
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaTwitter("Download Link:- "+dataPath.short_url, [res.filePath], '');
                  }
                },'jpg',50,'myScreenShot');
                

            }else{
                navigator.screenshot.save(function(error,res){
                  if(error){
                    console.error(error);
                  }else{
                    console.log('ok',res.filePath); //should be path/to/myScreenshot.jpg
                    window.plugins.socialsharing.shareViaFacebook("Download Link:- "+dataPath.short_url, [res.filePath], null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
                  }
                },'jpg',50,'myScreenShot');
                
            }
            return true;
         }
        });
    }


    $scope.filePath = '';

    $scope.uploadFtn = function(){

        $scope.addFilesModal.show();

    }

    //var formData = new FormData();
    //formData.append("api_key",loginStorage.api_key);
   
    //formData.append("folder_id",subfolderDetails.id);
    //$("#newfiles").change(function(){
         
    //});
    $scope.addgetPhoto1 = function(){

        addgetPhoto(pictureSource.PHOTOLIBRARY);
    }

    $scope.filesCreateFtn = function(){
        if(subscriberImage){
            $scope.filePath = 'Home/'+$scope.homeFileName+'/'+folderFlieName+'/'+folderFlieName1+'/'+folderFlieName2+'/'+subscriberImage;
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
            });
            cordova.exec(function(response){
                
                    $scope.filePath = 'Home/'+$scope.homeFileName+'/'+folderFlieName+'/'+folderFlieName1+'/'+folderFlieName2+'/'+JSON.parse(response).name;      
                        $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails2.id}})
                        .success(function(data, status, headers, config){
                            //$("#newfiles").val('');
                            $ionicLoading.hide();
                            if(data.length > 0){
                                fileListArray = [];
                                for (var i = 0; i < data.length; i++) {
                                    var imageData = (data[i].name).split(".").reverse();
                                    if(imageData.length > 1){
                                        var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                        var created_atData = ', modified '+relative_time(data[i].created_at);    
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                    }else{
                                        fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                    }
                                };
                                $scope.subfileList2 = fileListArray;
                                $scope.addFilesModal.hide();
                            }else{
                                
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'No file in this folder!'
                                });
                                alertPopup.then(function(res) {
                                    fileListArray = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var imageData = (data[i].name).split(".").reverse();
                                        if(imageData.length > 1){
                                            var fileSize;
                                            if(data[i].file_size >= (1024*1024)){
                                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                                            }else{
                                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                                            }
                                            var created_atData = ', modified '+relative_time(data[i].created_at);
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                                        }else{
                                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                                        }
                                    };
                                    
                                    $scope.subfileList2 = fileListArray;
                                    $scope.addFilesModal.hide();
                                });
                                     
                            }

                        })
                        .error(function(data, status, headers, config){
                            //alert(JSON.stringify(data));
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                             title: 'MABFiles',
                             template: 'Something went wrong!'
                            });
                            alertPopup.then(function(res) {
                             
                            });
                        })
                    //}
                },function(e){alert(e); $ionicLoading.hide();}, "Echo", "echo", ["300", "300", "file", subscriberImage, "http://build.myappbuilder.com/api/files/new.json?", "POST", {"api_key":loginStorage.api_key,"folder_id":subfolderDetails2.id}])
                
                
        }else{
            var alertPopup = $ionicPopup.alert({
                    title: 'MABFiles',
                    template: 'Please select file!'
                });
                alertPopup.then(function(res) {
                   
                });
        }
    }




    $scope.onItemDelete = function(item) {

        $scope.popover.hide();
        $scope.subfileList2.splice($scope.subfileList2.indexOf(item), 1);
        
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        $http({method:"DELETE", url:'http://build.myappbuilder.com/api/files/destroy.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':item.id}})
        .success(function(data,status,headers,config){
            $ionicLoading.hide();
            
        })
        .error(function(data,status,headers,config){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                     
            });
        })
    };

      
    $ionicModal.fromTemplateUrl('editFolder.html',{
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editFolderModal = modal;
    });

  
    $scope.onItemRename = function(item){
        $scope.folder.editname = '';
        $scope.popover.hide();
        $scope.editFolderModal.show();
        $scope.folder.editId = item.id;
        //$scope.folder.editname = item.name;
        var editFileName = (item.name).split('.').reverse();
        if(editFileName.length > 1){
            for (var i = (editFileName.length-1); i > 0; i--) {
                $scope.folder.editname = $scope.folder.editname+editFileName[i];
            };
            
            $scope.editFileExtention = editFileName[0];
        }else{
            $scope.folder.editname = editFileName[0];
            $scope.editFileExtention = '';
        }
        
    }

    $scope.folderEditFtn = function(){
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        if($scope.editFileExtention){
            var rootEditFileName = $scope.folder.editname+'.'+$scope.editFileExtention;
        }else{
            var rootEditFileName = $scope.folder.editname;
        }
        console.log("rootEditFileName2 : "+rootEditFileName);
        $http({method:'PUT', url:'http://build.myappbuilder.com/api/files/rename.json', cache:false, params:{'api_key':loginStorage.api_key, 'id':$scope.folder.editId, 'name':rootEditFileName}})
        .success(function(data,status,headers,config){
            
            $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key, 'folder_id':subfolderDetails2.id}})
            .success(function(data, status, headers, config){

                    $ionicLoading.hide();
                    fileListArray = [];
                    for (var i = 0; i < data.length; i++) {
                        var imageData = (data[i].name).split(".").reverse();
                        if(imageData.length > 1){
                            var fileSize;
                            if(data[i].file_size >= (1024*1024)){
                                fileSize = Math.round((data[i].file_size/(1024*1024)))+'MB';
                            }else{
                                fileSize = Math.round((data[i].file_size/1024))+'KB'; 
                            }
                            var created_atData = ', modified '+relative_time(data[i].created_at);
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/'+imageData[0]+'.png','size':fileSize,'folder':data[i].folder,'url':data[i].url,'short_url':data[i].short_url,'created_at':created_atData,'date':data[i].created_at});
                        }else{
                            fileListArray.push({'id':data[i].id,'name':data[i].name,'image':'img/folder_ic.png','size':'','folder':data[i].folder,'date':data[i].created_at});
                        }
                    };
                    $scope.subfileList2 = fileListArray;
                    $scope.editFolderModal.hide();
            })
            .error(function(data, status, headers, config){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: 'MABFiles',
                     template: 'Something went wrong!'
                    });
                    alertPopup.then(function(res) {
                     
                    });
            })
        })
        .error(function(data,status,headers,config){
            //alert(JSON.stringify(data))
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'MABFiles',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {
                $scope.editFolderModal.hide();     
            });
        })
    }

    
        /*$scope.fileListFtn = function(file){
            subfolderDetails2 = file;
            subfileList2 = '';
            if(subfolderDetails2.folder){
                folderFlieName2 = subfolderDetails2.name;
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                });
                $http({method:'GET', url:'http://build.myappbuilder.com/api/files.json', cache:false, params:{'api_key':loginStorage.api_key,'folder_id':subfolderDetails2.id}})
                .success(function(data, status, headers, config){
                    //alert(JSON.stringify(data));
                    $ionicLoading.hide();
                    if(data.length > 0){
                        subfileList2 = data;
                        $state.go('subfilesList2');
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: 'MABFiles',
                            template: 'No file in this folder!'
                        });
                        alertPopup.then(function(res) {
                            //subfileList = data;
                            $state.go('subfilesList2');
                        });
                             
                    }

                })
                .error(function(data, status, headers, config){
                    alert(JSON.stringify(data));
                    $ionicLoading.hide();
                })
            }else{

            }
        }*/
    
    $scope.downloadFile = function(dataPath){
        $scope.popover.hide();
        $ionicLoading.show({
            template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fs)
            {           var ft = new FileTransfer();
                        ft.onprogress = function(progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                console.log(perc + "%");
                                
                            }else {
                                console.log("Loading");
                            }
                        }

                        console.log(dataPath.url+" : "+ fs.root.toURL());

                        var filePathRoot = fs.root.toURL()+'/MABFiles/'+dataPath.name;
                        ft.download(dataPath.url, filePathRoot, 
                            function(entry){
                                console.log(JSON.stringify(entry));
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'MABFiles',
                                    template: 'Download completed successfully!'
                                });
                                alertPopup.then(function(res) {
                                   
                                });
                            },
                            function(error){
                                $ionicLoading.hide();
                                console.log(JSON.stringify(error));
                            }
                        );
            },function(err){
                $ionicLoading.hide();
            }
        );
    }
        


});
