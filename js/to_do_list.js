angular.module("myapp",[])
.controller("car",["$scope","$filter",function($scope,$filter){
        /*源数据*/
        $scope.data=localStorage.data?JSON.parse(localStorage.data):[];
        /*完成的数据*/
        $scope.done=localStorage.done?JSON.parse(localStorage.done):[];
        /*当前选则的事项*/
        $scope.currentIndex=0;
        $scope.currentCon=$scope.data[$scope.currentIndex];
        /*是否显示完成列表*/
        $scope.isshow=true;
        /*添加事项*/
        $scope.add=function() {
            var obj = {};
            obj.id = getMaxIndex($scope.data);
            obj.title = "新建事项" + obj.id;
            obj.son = [];
            $scope.data.push(obj);
            $scope.currentIndex = getIndex($scope.data, obj.id);
            $scope.currentCon = $scope.data[$scope.currentIndex];
            localStorage.data = JSON.stringify($scope.data);
        }
        /*删除列表*/
        $scope.removeList=function(id){
            $scope.currentIndex=getIndex($scope.data,id);
            $scope.currentCon=$scope.data[$scope.currentIndex];
            $scope.unDone-=$scope.currentCon.son.length;
            angular.forEach($scope.data,function(obj,index){
                if(id==obj.id){
                    $scope.data.splice(index,1);
                    var index=getIndex(id);
                    if(index==$scope.data.length-1){
                        $scope.currentIndex=index-1;
                        $scope.currentCon=$scope.data[$scope.currentIndex];
                    }else{
                        $scope.currentIndex=$scope.data.length-1;
                        $scope.currentCon=$scope.data[$scope.currentIndex];
                    }
                }
            })
            localStorage.data=JSON.stringify($scope.data);
        }

        /*获取最大的下标*/
        function getMaxIndex(arr){
            if(arr.length==0){
                return 1;
            }else{
                var temp=arr[0].id;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].id>temp){
                        temp=arr[i].id;
                    }
                }
                return temp+1;
            }
        }

        /*获取当前下标*/
        function getIndex(arr,id){
            for(var i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    return i;
                }
            }
        }

        /*获取最大的id*/
        function getMaxId(arr){
            if(arr.length==0){
                return 1;
            }else{
                var temp=arr[0].id;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].id>temp){
                        temp=arr[i].id;
                    }
                }
                return temp+1;
            }
        }

        /*列表获取焦点*/
        $scope.focus=function(id){
            var index=getIndex($scope.data,id);
            $scope.currentIndex=index;
            $scope.currentCon=$scope.data[$scope.currentIndex];
        }
        /*失去焦点保存数据*/
        $scope.blur=function(id){
            localStorage.data=JSON.stringify($scope.data);
        }
        /*添加条目*/
        $scope.addOpt=function(){
            var obj={};
            var id=getMaxId($scope.currentCon.son);
            obj.id=id;
            obj.title="新建条目"+obj.id;
            $scope.currentCon.son.push(obj);
            $scope.unDone++;
            localStorage.data=JSON.stringify($scope.data);
        }
        /*删除条目*/
        $scope.delOpt=function(id){
            $scope.unDone--;
            var index=getIndex($scope.currentCon.son,id);
            $scope.currentCon.son.splice(index,1);
            localStorage.data=JSON.stringify($scope.data);
        }
        /*条目完成*/
        $scope.doneFun=function(id){
            $scope.unDone--;
            var index=getIndex($scope.currentCon.son,id);
            /*1. 原数组删除*/
            var obj=$scope.currentCon.son.splice(index,1);
            /*2. 要将删除的元素放到done数组里面*/
            obj[0].id=getMaxId($scope.done);
            /*因为截取的时候会创建一个数组，所以将数组转化为对象的格式插入*/
            $scope.done.push(obj[0]);
            localStorage.data=JSON.stringify($scope.data);
            localStorage.done=JSON.stringify($scope.done);
        }
        /*显示完成列表*/
        $scope.showdone=function(){
            $scope.isshow = false;
        }
        /*显示内容*/
        $scope.showCon=function(){
            $scope.isshow = true;
        }
        /*删除已完成*/
        $scope.removeDone=function(id){
            var index=getIndex($scope.done,id);
            $scope.done.splice(index,1);
            localStorage.done=JSON.stringify($scope.done);
        }
        /*检测search*/
        $scope.search="";
        $scope.$watch("search",function(){
            var arr=$filter("filter")($scope.data,{title:$scope.search});
            $scope.currentIndex=0;
            $scope.currentCon=arr[$scope.currentIndex]
        })
        /*未完成数量*/
        if($scope.data.length!==0){
            $scope.unDone="";
            angular.forEach($scope.data,function(obj,index){
                $scope.unDone+=$scope.data[index].son.length+"+";
            })
            $scope.unDone=eval($scope.unDone.slice(0,-1));
        }else if($scope.data.length==0){
            $scope.unDone=0;
        }
    }])
