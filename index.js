// set up the socket

var socket = io.connect("https://hidden-garden-29865.herokuapp.com/socket.io/?EIO=4&transport=websocket");
socket.on("connect", () => {
  console.log("this socket ID = " + socket.id);
});

// reload all the times and buttons whenever the page is fully loaded
jQuery(window).on('load', function() {
  var x = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart + "ms";
  console.log("page loaded in " + x);
  socket.emit('add_data');
})

// submit new table item without reload
jQuery('#addNameForm').submit(function(e) {
  e.preventDefault(); // prevents page reloading
  socket.emit('new_name', jQuery('#nameBox').val());
  jQuery('#nameBox').val('');
  return false;
});

// append the new name
socket.on('new_name', function(tableIndex, data) {
  jQuery('#tableBody').append(jQuery("<tr>").html(data)); // append data to table
  jQuery('#tableBody tr:last').prop("id", "row" + tableIndex); // append row# id

  // hide check-in button
  jQuery("#checkInBtn" + tableIndex).hide();

  // click listener for remove button
  jQuery(document).on("click", "#remove" + tableIndex, function(e) {
    if (confirm("Are you sure you want to remove " + jQuery("#row" + tableIndex).children().first().html() + "?")) {
      // emit the id of the row
      e.preventDefault();
      socket.emit('remove_name', tableIndex, jQuery("#row" + tableIndex).children().first().html());
    }
  })
  // click listener for check-out button
  setBtnListener("checkOutBtn" + tableIndex, tableIndex, 'out');

  // click listener for check-in button
  setBtnListener("checkInBtn" + tableIndex, tableIndex, 'in');
});

// add data
socket.on('add_data', function (tableIndex, tL, tB) {
  // click listener for remove
  jQuery(document).on("click", "#remove" + tableIndex, function(e) {
    if (confirm("Are you sure you want to remove " + jQuery("#row" + tableIndex).children().first().html() + "?")) {
      // emit the id of the row
      e.preventDefault();
      socket.emit('remove_name', tableIndex, jQuery("#row" + tableIndex).children().first().html());
    }
  })

  if (tL !== "") {
    if (tB === "") { // on the water
      jQuery("#checkOutBtn" + tableIndex).before(tL);
      jQuery("#checkOutBtn" + tableIndex).hide();
      jQuery("#checkInBtn" + tableIndex).show();
      setBtnListener("checkInBtn" + tableIndex, tableIndex, 'in');
    } else { // off the water
      jQuery("#checkOutBtn" + tableIndex).before(tL);
      jQuery("#checkOutBtn" + tableIndex).hide();
      jQuery("#checkInBtn" + tableIndex).before(tB);
      jQuery("#checkInBtn" + tableIndex).hide();
    }
  } else { // not yet on water
    jQuery("#checkInBtn" + tableIndex).hide();
    setBtnListener("checkOutBtn" + tableIndex, tableIndex, 'out');
    setBtnListener("checkInBtn" + tableIndex, tableIndex, 'in');
  }
})

// remove a name
socket.on('remove_name', function(tableIndex) {
  jQuery("#row" + tableIndex).remove();
});

// check out
socket.on('check_out', function(tableIndex, time) {
  jQuery("#checkOutBtn" + tableIndex).before(time); // add check-out time
  jQuery("#checkOutBtn" + tableIndex).hide(); // hide the button
  // show check-in button
  jQuery("#checkInBtn" + tableIndex).show();
});

// check in
socket.on('check_in', function(tableIndex, time) {
  jQuery("#checkInBtn" + tableIndex).before(time); // add check-in time
  jQuery("#checkInBtn" + tableIndex).hide(); // hide the button
});

// set button listener (for code readability)
function setBtnListener(id, tableIndex, inout) {
  jQuery(document).on("click", "#" + id, function(e) {
    // get current time
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;

    // emit the id of the check-out button, current time, and name
    e.preventDefault();
    socket.emit('check_' + inout, tableIndex, time, jQuery("#row" + tableIndex).children().first().html());
  })
}
