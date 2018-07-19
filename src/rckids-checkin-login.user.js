// ==UserScript==
// @name        RC Kids Sunday Morning Check-In Login
// @namespace   myredemptionchurch.org
// @description Auto-login for RC Kids Sunday Morning Check-in
// @include     https://myredemptionchurch.ccbchurch.com/checkin_login.php*
// @downloadURL http://www.myredemptionchurch.org/rckids/gm_scripts/rckids-checkin-login.user.js
// @updateURL http://www.myredemptionchurch.org/rckids/gm_scripts/rckids-checkin-login.user.js
// @version     1.1.2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       none
// ==/UserScript==

$(function() {
  var $form = $('#main-form');
  $form.attr('autocomplete','on');
  var $loginPassword = $('#login-password');
  $loginPassword.attr('autocomplete','on');
  // bl: all of the events come from this script:
  // https://cdn3.ccbchurch.com/1/js/checkin_login.js?d=8cb70b3b811231cc74747222aa97d54bcf3c894
  
  // bl: set a timeout to give Firefox opportunity to auto-fill the password before we submit the form
  setTimeout(function() {
    if($loginPassword.val()!=='') {
			// bl: there is only one button the page, so click it to submit the form
      $('button').click();
			// the following code may eventually be needed for an upgrade to GreaseMonkey 4.2
			/*var ev = unsafeWindow.document.createEvent('Event');
      ev.initEvent('keypress');
      ev.which = ev.keyCode = 13;
      $loginPassword[0].dispatchEvent(ev);*/
    } else {
      // the login form ultimately submits via AJAX, so in order to save the password initially,
      // we need to inject a submit button into the form.
  //    var $submitButton = $('<input type="submit" value="Submit" />');
  //    $form.append($submitButton);
      // actually, just shutting off the default submit handler added by the above script is all that is needed.
      // the form submission won't actually work, but at least you'll get prompted to save the password.
      // once the password is saved, it should auto-fill, thus allowing the initial login process to be bypassed
      // above via the password not empty detection.
      $form.off('submit');
    }
  }, 500);
});
