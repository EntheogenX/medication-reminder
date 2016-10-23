angular.module('medicationReminderApp').filter('missed', function() {
  return function(input, isMissed) {
    var missedMeds = [];
    var upcomingMeds = [];
    var currentTime = moment();
    for (var i in input) {
      var missedTime = moment(input[i].time).add(5, 'minutes');
      var timeDifference = currentTime.diff(missedTime, 'minutes');

      if (timeDifference > 0)
        missedMeds.push(input[i]);
      else
        upcomingMeds.push(input[i]);

      input[i].formatTime = moment(input[i].time).format('h:mm:ss a');

    }
    return (isMissed) ?  missedMeds : upcomingMeds;
  };
})
