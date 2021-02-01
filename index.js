var socket = io.connect('http://localhost:8080');

socket.on("connect", () => {
  console.log("this socket ID = " + socket.id);
});

// Allows the buttons to work for the row they're on
let tableIndex = 1;

// submit new table item without reload
$('#addNameForm').submit(function(e) {
  e.preventDefault(); // prevents page reloading
  socket.emit('new_name', $('#nameBox').val(), tableIndex, socket.id);
  $('#nameBox').val('');
  return false;
});

// append the new name
socket.on('new_name', function(data, sid) {
  $('#tableBody').append($("<tr>").html(data)); // append data to table
  $('#tableBody tr:last').prop("id", "row" + tableIndex); // append row# id

  // click listener for remove name button
  $(document).on("click", "#remove" + tableIndex, function(e) {
    if (confirm("Are you sure you want to remove " + $(this).parent().parent().children().first().html() + "?")) {
      // emit the id of the row
      e.preventDefault();
      socket.emit('remove_name', $(this).parent().parent().prop("id"), $(this).parent().parent().children().first().html());
    }
  })

  // click listener for check-out button
  $(document).on("click", "#checkOutBtn" + tableIndex, function(e) {
    // get current time
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;
    // emit the id of the check-out button and time
    e.preventDefault();
    socket.emit('check_out', $(this).prop("id"), time, $(this).parent().parent().children().first().html());
  })
  tableIndex++;
});

// remove a name
socket.on('remove_name', function(data) {
  $("#" + data).remove();
});

// check out
socket.on('check_out', function(data, time) {
  $("#" + data).before(time); // add check-out time
  $("#" + data).hide(); // hide the button
  // add HTML to create check-in button (after checking out)
  $("#" + data).parent().next().html("<button id='checkInBtn" + data.slice(-1) + "' class='btn btn-light'>Check In</button>");

  // add click listener for check-in button
  $(document).on("click", "#checkInBtn" + data.slice(-1), function(e) {
    // get current time
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;
    // emit the id of the check-in button and time
    e.preventDefault();
    socket.emit('check_in', "checkInBtn" + data.slice(-1), time, $("#row" + data.slice(-1)).children().first().html());
  })
});

// check in
socket.on('check_in', function(data, time) {
  $("#" + data).before(time); // add check-in time
  $("#" + data).hide(); // hide the button
});
