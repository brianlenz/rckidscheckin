// ==UserScript==
// @name        RC Kids Adult Check-In
// @namespace   myredemptionchurch.org
// @description RC Kids Adult Check-In: set label count to 0
// @include     https://myredemptionchurch.ccbchurch.com/checkin_family_detail.php*
// @downloadURL http://www.myredemptionchurch.org/rckids/gm_scripts/rckids-checkin-adults.user.js
// @updateURL http://www.myredemptionchurch.org/rckids/gm_scripts/rckids-checkin-adults.user.js
// @version     1.3.5
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       none
// ==/UserScript==

// 1324,1325 == Sunday Morning Worship for Attendance
// 1334,1341 == Sunday School - RC Kids Teachers (no longer valid now that we have Lesson # in each individual event name)
// 1327,1336 == Nursery
// 1335,1338 == Walkers
// 1328,1337 == Preschool / Pre-K
// 1333,1339 == K/1
// 1320,1321 == 2/3
// 1326,1340 == 4/5
// 1323 == VIP Room
var kidsEventIds = [1327,1336,1335,1338,1328,1337,1333,1339,1320,1321,1326,1340,1323];

$(function() {
  var $form = $('#family-checkin-form');
  var $items = $form.find('.items');

  // bl: must now trigger clicks via the unsafeWindow context in order for them to apply. won't work from within our event handlers here otherwise.
  function triggerClick($elt) {
    var evt = unsafeWindow.document.createEvent("MouseEvents");
    evt.initEvent("click", true, true);
    $elt[0].dispatchEvent(evt);
  }

  // bl: div.content-wrapper:lt(2) let's you click on the person's name or the middle column with the event.
  // it effectively isolates the last label column so that this handler won't apply to click events on the label
  $items.on('click.setLabels', '.item > div.content-wrapper:lt(2)', function(event) {
    var $contentWrapper = $(event.currentTarget);
    var $item = $contentWrapper.parent();
    var $groupEvent = $item.find('.group-event');

    // once the event is pending, don't do this auto-processing
    // var isEventPending = $groupEvent.is('.event-pending');
    var eventId = $groupEvent.data('eventId');

    // if the user is not in a recognized Sunday School group/event, then set the label count to 0 by default.
    // just click the link for 0/1 items so everything gets updated automatically
    if($.inArray(eventId,kidsEventIds)<0) {
      var $zeroLabel = $item.find('.label-quantity-bar a[data-select-value="0"]');
      triggerClick($zeroLabel);
    }
  });

  var $groupEvents = $form.find('.group-events');
  $groupEvents.on('DOMSubtreeModified', function(event) {
    var $groupEvents = $(event.currentTarget);
    var $groupEvent = $groupEvents.find('.group-event');
    var eventId = $groupEvent.data('eventId');

    var $item = $groupEvents.closest('.item');
    var $labelQuantityBar = $item.find('.label-quantity-bar');

    if($labelQuantityBar.is(':visible')) {
      // bl: need a delay via setTimeout() in order for the click event to be delayed until after the current
      // set of handlers runs.
      setTimeout(function() {
        // if the user is not in a recognized Sunday School group/event, then set the label count to 0 by default.
        // otherwise, set it to 1 by default.
        // just click the link for 0/1 items so everything gets updated automatically
        if($.inArray(eventId,kidsEventIds)<0) {
          var $zeroLabel = $labelQuantityBar.find('a[data-select-value="0"]');
          triggerClick($zeroLabel);
        }
      }, 0);
    }
  });

  // bl: the print handling is triggered via this script:
  // https://cdn3.ccbchurch.com/1/js/checkin_family_detail.js?d=8cb70b3b811231cc74747222aa97d54bcf3c8949
  // in order to prevent the auto-redirect after printing, run this in the console:
  // finishCheckin.printRedirect=function(){};
  // then, click Finish to attempt to print. cancel the print.
  // then, use the Web Developer Add-On in Firefox: https://addons.mozilla.org/en-US/firefox/addon/web-developer/
  // and select CSS -> Display Styles By Media Type -> Display Print Styles
  // note that in Firefox, CCB prints by opening a new window and injecting the contents of
  // #print-content-only into that new window. thus, if you want to have some control over
  // that new window process during development, you will need to inspect informationLabels.print
  // and remove any calls to window.close() and printWindow.document.close()
  var $printForm = $('#print-content-only');
  // bl: i wish this worked, but CCB opens a new window to do the printing and applies their own
  // CSS rules directly to that window, so we can't inject rules dynamically and have them
  // take effect like we'd hope/expect.
  /*
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("media", "print");
  // make the first name bigger (default is 24pt)
  style.sheet.insertRule('', 0);
  // make the last name bigger (default is 12pt)
  style.sheet.insertRule('.individual-label .name-last {font-size:20pt;}', 1);
  // hide the group name since it's truncated
  style.sheet.insertRule('.event-minor {display:none;}', 2);
  // we only ever have one event at a time, so reduce the height to make room for the larger name
  style.sheet.insertRule('.event-items {height: 0.20in;}', 3);
  */

  // bl: instead, let's inject the style rules directly into the #print-content-only element, which
  // will cause it to get included in the popup that is opened for print. that way, this CSS
  // will apply when printing.
  $printForm.prepend($('<style id="rcLabelPrintCSS" type="text/css">.individual-label .name-first {font-size:34pt;} .individual-label .name-last {font-size:32pt;} .event-minor {display:none;} .event-items {height: 0.20in;}</style>'));
});