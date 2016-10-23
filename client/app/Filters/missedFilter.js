angular.module('medicationReminderApp').filter('missed', function() {
  return function(input, isMissed) {
    var missedMeds = []; // missed meds container
    var upcomingMeds = []; // main meds container
    var currentTime = moment();
    for (var i in input) {
      var missedTime = moment(input[i].time).add(5, 'minutes'); // increase by 5 to compare from 0
      var timeDifference = currentTime.diff(missedTime, 'minutes');

      if (timeDifference > 0)
        missedMeds.push(input[i]);
      else
        upcomingMeds.push(input[i]);

      input[i].formatTime = moment(input[i].time).format('h:mm:ss a'); // display format time
    }
    return (isMissed) ?  missedMeds : upcomingMeds;
  };
})
