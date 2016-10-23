'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window, $filter) {

    var start = moment(),
        end = moment().add(1, 'day');

  var startDate = moment(start).format('MM/DD/YYYY');
  var endDate = moment(end).format('MM/DD/YYYY');
  var currentTime = moment();
  $scope.calendarDate = moment().format('MMMM Do YYYY');
  $scope.currentTime = moment().format('h:mm:ss a');
  $scope.currentDate = moment().format('MMMM Do YYYY');

  $scope.fetchMedication = function(startDate,endDate) {
    $http.get('/api/medications?start=' + startDate + '&end=' + endDate).then(function (meds) {
      $scope.meds = meds.data;

    });
  }

  $scope.updateMedication = function(medication) {
    $http.put('/api/medications/'+ medication._id, angular.toJson(medication)).then(function (med) {
    });
  }

  $scope.fetchMedication(startDate,endDate);
  $window.setInterval(function() {
      $scope.currentTime = moment().format('h:mm:ss a');
      $scope.currentDate = moment().format('MMMM Do YYYY');
      currentTime = moment();

      var upcoming = $filter('missed')($scope.meds, false);

      for (var i in upcoming) {
        var medTime = moment(upcoming[i].time);

        var timeDifference = currentTime.diff(medTime, 'seconds');

        if (timeDifference == 0)
        {
          $scope.playAlertSound('now');
        }
        else if (timeDifference == 300) // 5 minutes after
        {
          $scope.playAlertSound('after');

        }

        else if (timeDifference >= -300 && timeDifference <= 300) {
          if (timeDifference <= 300  && timeDifference >= 0)
            upcoming[i].medStatus = "status-pending";
          upcoming[i].showButton = true;
        }

      }
      $scope.$apply();
    }
    , 1000);

  $scope.completeMed = function(m) {
    m.completed = true;
    m.isClose = false;
    m.medStatus = "status-completed";
    $scope.updateMedication(m);
  }

  $scope.eventSources = [];

  $scope.dayClick = function(t) {
      var start = moment(t._d).add(1, 'day'),
        end = moment(t._d).add(2, 'day');
      var startDate = start.format('MM/DD/YYYY'),
      endDate = end.format('MM/DD/YYYY');
    $scope.calendarDate = start.format('MMMM Do YYYY');
    $scope.fetchMedication(startDate,endDate);

  };

  $scope.playAlertSound = function(type) {
    var audio;

    if (type == "after")
      audio = new Audio('assets/sounds/airhorn.wav');
    else if (type == "now")
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
      ignoreTimezone: false,
      header:{
        right: 'prev,next'
      },
      timezone:'local',
      dayClick: $scope.dayClick,
      eventClick: $scope.alertEventOnClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
    }
  };

});
