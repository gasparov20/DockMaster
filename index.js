var tableIndex = 1;

function testAdd() {
  addNameTest("John Smith");
  addNameTest("Johnny Appleseed");
  addNameTest("Dick Butkus");
  addNameTest("Pavel Datsyuk");
}

// addName with jQuery
function addName() {
  $("#tableBody").append("<tr><td>" + tableIndex + "</td><td>" + $("#nameBox").val() + "</td><td><button id='button" + tableIndex + "' class='btn btn-light'>Check Out</button></td><td id='button" + tableIndex + "row'></td><td><button id='remove" + tableIndex + "' class='btn btn-light'>X</button></td></tr>");

  $("#button" + tableIndex).click(function() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes()
    $(this).before(time);
    $(this).hide();
    $("#" + $(this).prop("id") + "row").html("<button id='" + $(this).prop("id") + "rowIn" + "' class='btn btn-light'>Check In</button>");

    $("#" + $(this).prop("id") + "row").click(function() {
      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes()
      $("#" + $(this).prop("id") + "In").before(time);
      $("#" + $(this).prop("id") + "In").hide();
    })
  })

  $("#remove" + tableIndex).click(function () {
    if (confirm("Are you sure you want to remove " + $(this).parent + "?"))
      $(this).parent().parent().remove();
  })

  tableIndex++;
}

function addNameTest(name) {
  $("#tableBody").append("<tr><td>" + tableIndex + "</td><td>" + name + "</td><td><button id='button" + tableIndex + "' class='btn btn-light'>Check Out</button></td><td id='button" + tableIndex + "row'></td><td><button id='remove" + tableIndex + "' class='btn btn-light'>X</button></td></tr>");

  $("#button" + tableIndex).click(function() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes()
    $(this).before(time);
    $(this).hide();
    $("#" + $(this).prop("id") + "row").html("<button id='" + $(this).prop("id") + "rowIn" + "' class='btn btn-light'>Check In</button>");

    $("#" + $(this).prop("id") + "row").click(function() {
      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes()
      $("#" + $(this).prop("id") + "In").before(time);
      $("#" + $(this).prop("id") + "In").hide();
    })
  })

  $("#remove" + tableIndex).click(function () {
    if (confirm("Are you sure you want to remove " + $(this).parent().parent().children()[1].innerHTML + "?"))
      $(this).parent().parent().remove();
  })

  tableIndex++;
}
