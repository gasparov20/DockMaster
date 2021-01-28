// Allows the buttons to work for the row they're on
var tableIndex = 1;

// Easily populate table with data for testing
function testAdd() {
  addNameTest("John Smith");
  addNameTest("Johnny Appleseed");
  addNameTest("Dick Butkus");
  addNameTest("Pavel Datsyuk");
}

// Adds a name to the table along with the buttons and their functionality.
function addName() {
  // Add HTML to table row and an ID for the cell that the check-in button will reside in
  $("#tableBody").append("<tr><td>" + $("#nameBox").val() + "</td><td><button id='button" + tableIndex + "' class='btn btn-light'>Check Out</button></td><td id='button" + tableIndex + "row'></td><td><button id='remove" + tableIndex + "' class='btn btn-light'>X</button></td></tr>");

  // Add click listener for check-out button
  $("#button" + tableIndex).click(function() {
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;
    $(this).before(time); // Add check-out time
    $(this).hide(); // and hide button
    // Add HTML to create check-in button (after checking out) using the cell ID created above
    $("#" + $(this).prop("id") + "row").html("<button id='" + $(this).prop("id") + "rowIn" + "' class='btn btn-light'>Check In</button>");

    // Add click listener for check-in button
    $("#" + $(this).prop("id") + "row").click(function() {
      let today = new Date();
      let mins = today.getMinutes();
      if (mins.toString().length === 1)
        mins = "0" + mins;
      let time = today.getHours() + ":" + mins;
      $("#" + $(this).prop("id") + "In").before(time);
      $("#" + $(this).prop("id") + "In").hide();
    })
  })

  // Add click listener for remove row button
  $("#remove" + tableIndex).click(function() {
    if (confirm("Are you sure you want to remove " + $(this).parent + "?"))
      $(this).parent().parent().remove();
  })

  // Increment table index so next addition will work
  tableIndex++;
}

// Same as addName() but takes an argument to easily populate table for testing purposes
function addNameTest(name) {
  $("#tableBody").append("<tr><td>" + name + "</td><td><button id='button" + tableIndex + "' class='btn btn-light'>Check Out</button></td><td id='button" + tableIndex + "row'></td><td><button id='remove" + tableIndex + "' class='btn btn-light'>X</button></td></tr>");

  $("#button" + tableIndex).click(function() {
    let today = new Date();
    let mins = today.getMinutes();
    if (mins.toString().length === 1)
      mins = "0" + mins;
    let time = today.getHours() + ":" + mins;
    $(this).before(time);
    $(this).hide();
    $("#" + $(this).prop("id") + "row").html("<button id='" + $(this).prop("id") + "rowIn" + "' class='btn btn-light'>Check In</button>");

    $("#" + $(this).prop("id") + "row").click(function() {
      let today = new Date();
      let mins = today.getMinutes();
      if (mins.toString().length === 1)
        mins = "0" + mins;
      let time = today.getHours() + ":" + mins;
      $("#" + $(this).prop("id") + "In").before(time);
      $("#" + $(this).prop("id") + "In").hide();
    })
  })

  $("#remove" + tableIndex).click(function() {
    if (confirm("Are you sure you want to remove " + $(this).parent().parent().children()[0].innerHTML + "?"))
      $(this).parent().parent().remove();
  })

  tableIndex++;
}
