"use strict"

var app = angular.module('aStatusBar', [])

.controller('StatusBarUpdate', ['$scope','$interval', function ($scope,$interval) {
    $scope.statusBarWidth = '75px'

    var stop = undefined;
    $scope.startTimer = function () {

        $scope.statusVisible = true;
        stop = $interval($scope.updateStatus, 80, 0, true);
    }

    $scope.stopTimer = function () {
        $interval.cancel(stop);
        stop = undefined;
        $scope.statusVisible = false;
    }
    $scope.statusBar = 0;
    $scope.updateStatus = function () {
        if ($scope.statusBar < 250) {
            $scope.statusBar += 5;
            $scope.statusBarWidth = $scope.statusBar + 'px';
        }
        else {
            $scope.statusBar = 0;
            $scope.statusBarWidth = $scope.statusBar + 'px';
        }
    }

    $scope.startTimer();
}])

.directive("myStatus", ['$location', '$interval', function ($location, $interval) {
    return {
        templateUrl: "../templates/StatusBar.html",
        link: function (scope, element, attributes) {

        }
    }


}])
