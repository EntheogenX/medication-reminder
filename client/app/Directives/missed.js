angular.module('medicationReminderApp').directive('myMissed', ['missedFilter',  function(missedFilter) {
  return {
    templateUrl: 'app/Directives/missed.html'
  };
}]);/**
 * Created by Electro on 10/20/2016.
 */
