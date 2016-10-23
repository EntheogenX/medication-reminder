'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window, $filter) {

    var start = moment(),
        end = moment().add(1, 'day');

  var start = moment(start).format('MM/DD/YYYY');
  var end = moment(end).format('MM/DD/YYYY');
  var currentTime = moment();

  $scope.fetchMedication = function(startDate,endDate) {
    $http.get('/api/medications?start=' + startDate + '&end=' + endDate).then(function (meds) {
      $scope.meds = meds.data;

    });
  }

  $scope.updateMedication = function(medication) {
    $http.put('/api/medications/'+ medication._id, angular.toJson(medication)).then(function (med) {
    });
  }

  $scope.fetchMedication(start,end);
  $window.setInterval(function() {
      $scope.currentTime = moment().format('h:mm:ss a');
      $scope.currentDate = moment().format('MMMM Do YYYY');
      currentTime = moment();

      var upcoming = $filter('missed')($scope.meds,'missed',false );
      for (var i in upcoming) {
        var medTime = moment(upcoming[i].time);

        var timeDifference = currentTime.diff(medTime, 'seconds');

        if (timeDifference == -300) // 5 minutes before
        {
          $scope.playAlertSound(true);
          $scope.playAlertSound('before');
        }
        else if (timeDifference == 300) // 5 minutes after
        {
          $scope.medStatus = "status-missed";
          $scope.playAlertSound('after');

        }
        else if (timeDifference == 0)
        {
          $scope.playAlertSound('completed');
        }
        else if (timeDifference >= -30000 && timeDifference <= 300) {
          $scope.medStatus = "status-pending";
          upcoming[i].showButton = true;
        }

      }
      $scope.$apply();
    }
    , 1000);




  $scope.completeMed = function(m) {
    m.completed = true;
    $scope.updateMedication(m);
    $scope.medStatus = "status-completed";
  }

  $scope.eventSources = [];

  $scope.dayClick = function(t) {
      var start = moment(t._d),
        end = moment(t._d).add(1, 'day');

      var utcStartDate = moment.utc(start).format('MM/DD/YYYY');
      var utcEndTime = moment.utc(end).format('MM/DD/YYYY');
    $scope.fetchMedication(utcStartDate,utcEndTime);

  };

  $scope.playAlertSound = function(type) {
    var audio;

    if (type == "after")
      audio = new Audio('assets/sounds/airhorn.wav');
    else if (type == "complete")
      audio = new Audio('assets/sounds/okay.wav');
    else if (type == "before")
      audio = new Audio('assets/sounds/ding.wav');
    else
      return;

    audio.play();
  }


  $scope.uiConfig = {
    calendar:{
      height: "auto",
      selectable: true,
      editable: true,
      dayClick: $scope.dayClick,


    }
  };

});
