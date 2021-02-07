// production
var socket = io.connect(window.location.hostname);

// local testing
//var socket = io.connect('/');

socket.on("connect", () => {
  console.log("connect: this socket ID = " + socket.id);
});

// reload all the times and buttons whenever the page is fully loaded
$(window).on('load', function() {
  var x = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart + "ms";
  console.log("page loaded in " + x);
  socket.emit('add_data');
})

// submit new table item without reload
$('#addNameForm').submit(function(e) {
  e.preventDefault(); // prevents page reloading
  socket.emit('new_name', $('#nameBox').val());
  $('#nameBox').val('');
  return false;
});

// append the new name
socket.on('new_name', function(tableIndex, data) {
  $('#tableBody').append($("<tr>").html(data)); // append data to table
  $('#tableBody tr:last').prop("id", "row" + tableIndex); // append row# id

  // hide check-in button
  $("#checkInBtn" + tableIndex).hide();

  // click listener for remove button
  $(document).on("click", "#remove" + tableIndex, function(e) {
    if (confirm("Are you sure you want to remove " + $("#row" + tableIndex).children().first().html() + "?")) {
      // emit the id of the row
      e.preventDefault();
      socket.emit('remove_name', tableIndex, $("#row" + tableIndex).children().first().html());
    }
  })
  // click listener for check-out button
  setBtnListener("checkOutBtn" + tableIndex, tableIndex, 'out');

  // click listener for check-in button
  setBtnListener("checkInBtn" + tableIndex, tableIndex, 'in');
});

// update a name
socket.on('update_name', function(tableIndex, name) {
  $("#row" + tableIndex).children().first().html(name);
})

// add data
socket.on('add_data', function (tableIndex, tL, tB) {
  // click listener for remove
  $(document).on("click", "#remove" + tableIndex, function(e) {
    if (confirm("Are you sure you want to remove " + $("#row" + tableIndex).children().first().html() + "?")) {
      // emit the id of the row
      e.preventDefault();
      socket.emit('remove_name', tableIndex, $("#row" + tableIndex).children().first().html());
    }
  })

  // add focusout listener for name field
  $("#row" + tableIndex).children().first().on('focusout', function(e) {
    e.preventDefault();
    socket.emit('update_name', tableIndex, $(this).html());
  });

  if (tL !== "") {
    if (tB === "") { // on the water
      $("#checkOutBtn" + tableIndex).before(tL);
      $("#checkOutBtn" + tableIndex).remove();
      $("#checkOutCell" + tableIndex).prop("contenteditable", "true"); // make time editable

      // focusout listener for checkout time
      $("#checkOutCell" + tableIndex).on('focusout', function(e) {
        e.preventDefault();
        socket.emit('check_out_update', tableIndex, $(this).html(), $(this).prev().html());
      });

      $("#checkInBtn" + tableIndex).show();
      setBtnListener("checkInBtn" + tableIndex, tableIndex, 'in');
    } else { // off the water
      $("#checkOutBtn" + tableIndex).before(tL);
      $("#checkOutBtn" + tableIndex).remove();
      $("#checkInBtn" + tableIndex).before(tB);
      $("#checkInBtn" + tableIndex).remove();
      $("#checkInCell" + tableIndex).prop("contenteditable", "true"); // make time editable
      $("#checkOutCell" + tableIndex).prop("contenteditable", "true"); // make time editable

      $("#checkOutCell" + tableIndex).on('focusout', function(e) {
        e.preventDefault();
        socket.emit('check_out_update', tableIndex, $(this).html(), $(this).prev().html());
      });

      // Doesn't work
      $("#checkInCell" + tableIndex).on('focusout', function(e) {
        e.preventDefault();
        socket.emit('check_in_update', tableIndex, $(this).html(), $(this).prev().prev().html());
      });
    }
  } else { // not yet on water
    $("#checkInBtn" + tableIndex).hide();
    setBtnListener("checkOutBtn" + tableIndex, tableIndex, 'out');
    setBtnListener("checkInBtn" + tableIndex, tableIndex, 'in');
  }
})

// remove a name
socket.on('remove_name', function(tableIndex) {
  $("#row" + tableIndex).remove();
});

// check out
socket.on('check_out', function(tableIndex, time) {
  $("#checkOutBtn" + tableIndex).before(time); // add check-out time
  $("#checkOutBtn" + tableIndex).remove(); // hide the button
  $("#checkOutCell" + tableIndex).prop("contenteditable", "true"); // make time editable

  $("#checkOutCell" + tableIndex).on('focusout', function(e) {
    e.preventDefault();
    socket.emit('check_out_update', tableIndex, $(this).html(), $(this).prev().html());
  });

  $("#checkInBtn" + tableIndex).show(); // show check-in button
});

socket.on('check_out_update', function(tableIndex, time) {
  $("#checkOutCell" + tableIndex).html(time);
})

// check in
socket.on('check_in', function(tableIndex, time) {
  $("#checkInBtn" + tableIndex).before(time); // add check-in time
  $("#checkInBtn" + tableIndex).remove(); // hide the button
  $("#checkInCell" + tableIndex).prop("contenteditable", "true"); // make time editable

  $("#checkInCell" + tableIndex).on('focusout', function(e) {
    e.preventDefault();
    socket.emit('check_in_update', tableIndex, $(this).html(), $(this).prev().html());
  });
});

socket.on('check_in_update', function(tableIndex, time) {
  $("#checkInCell" + tableIndex).html(time);
})

// set button listener (for code readability)
function setBtnListener(id, tableIndex, inout) {
  $(document).on("click", "#" + id, function(e) {
    // get current time
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;

    // emit the id of the check-out button, current time, and name
    e.preventDefault();
    socket.emit('check_' + inout, tableIndex, time, $("#row" + tableIndex).children().first().html());
  })
}
