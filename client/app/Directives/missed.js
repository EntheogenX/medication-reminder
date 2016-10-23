angular.module('medicationReminderApp').directive('myMissed', ['missedFilter',  function(missedFilter) {
  return {
    templateUrl: 'app/Directives/missed.html'
  };
}]);
