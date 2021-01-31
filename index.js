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
  $('#tableBody tr:last').attr("id", "row" + tableIndex); // append row# id

  // click listener for remove name button
  $(document).on("click", "#remove" + tableIndex, function() {
    if (confirm("Are you sure you want to remove " + $(this).parent().parent().children()[0].innerHTML + "?")) {
      // emit the id of the remove button
      socket.emit('remove_name', $(this).parent().parent().attr("id"));
    }
  })

  // click listener for check-out button
  $(document).on("click", "#button" + tableIndex, function() {
    // get current time
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;
    // emit the id of the check-out button
    socket.emit('check_out', $(this).prop("id"), time);

    // Add click listener for check-in button
    $(document).on("click", "#" + $(this).prop("id") + "row", function() {
      // get current time
      let today = new Date();
      let mins = today.getMinutes();
      if (mins.toString().length === 1)
        mins = "0" + mins;
      let time = today.getHours() + ":" + mins;
      // emit the id of the check-in button
      socket.emit('check_in', $(this).prop("id") + "In", time);
    })
  })
  tableIndex++;
});

// remove a name
socket.on('remove_name', function(data) {
  $("#" + data).remove();
});

// time left
socket.on('check_out', function(data, time) {
  $("#"+ data).before(time); // add check-out time
  $("#"+ data).hide(); // hide the button
  // add HTML to create check-in button (after checking out) using the cell ID created above
  $("#" + data + "row").html("<button id='" + data + "rowIn" + "' class='btn btn-light'>Check In</button>");

});

// time back
socket.on('check_in', function(data, time) {
  $("#" + data).before(time); // add check-in time
  $("#" + data).hide(); // hide the button
});
