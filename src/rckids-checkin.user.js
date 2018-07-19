// ==UserScript==
// @name        RC Kids Sunday Morning Check-In
// @namespace   myredemptionchurch.org
// @description Set up defaults for RC Kids Sunday Morning Check-in
// @include     https://myredemptionchurch.ccbchurch.com/checkin_start.php
// @downloadURL http://www.myredemptionchurch.org/rckids/gm_scripts/rckids-checkin.user.js
// @updateURL http://www.myredemptionchurch.org/rckids/gm_scripts/rckids-checkin.user.js
// @version     1.1.3
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       none
// ==/UserScript==

$(function() {
  var $form = $('#checkin-settings-form');

  var $printLabels = $('#print-labels');
  // bl: a simple click can replace the following two commands:
  $printLabels.click();
  // enable Print Labels
  //$printLabels.prop('checked', true);
  // show all of the other label printing options now that printing labels is enabled
  // the slice(1) is for excluding the "Default Label Count" option since we only ever want 1 label
  //$printLabels.closest('ul.equal-gutters').find('li.group:hidden').slice(1).css('display','list-item');

  // turn Text Message Paging on
  // bl: it doesn't work well enough so let's not enable text message paging anymore
  //$('#text-paging').prop('checked', true);
  // turn Report Access on
  //$('#display-reports').prop('checked', true);
  // bl: a simple click is better, as it will toggle the UI, too
  $('#display-reports').click();

  // set the check-in time to 9:30am
  var $checkinTimeWrapper = $form.find('.checkin-time-wrapper');
  var $checkinTime = $checkinTimeWrapper.find('input.checkin-time');

  // bl: check if we are checking in for the 10:30 service (assume after 10:00am)
  var date = new Date();
  var time;
  if(date.getHours()>=10) {
    time = '10:30am';
  } else {
    time = '9:00am';
  }
  $checkinTime.val(time);
  $checkinTimeWrapper.find('.checkin-time-display').html($checkinTime.val());
});
