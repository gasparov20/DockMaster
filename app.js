const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require('http').Server(app);
const io = require('socket.io')(http);

// send index.ejs
app.get("/", function(req, res) {
  res.render("index.ejs");
})

// send index.js
app.get("/index.js", function(req, res) {
  res.sendFile(__dirname + "/index.js");
});

// open connection
io.on('connection', function(socket) {
  // catch emissions for functions
  socket.on('new_name', function(data, tableIndex, sid) {
    io.emit('new_name', "<td>" + data + "</td><td><button id='button" + tableIndex + "' class='btn btn-light'>Check Out</button></td><td id='button" + tableIndex + "row'></td><td><button id='remove" + tableIndex + "' class='btn btn-light'>X</button></td></tr>", sid);
  });
  socket.on('remove_name', function(data) {
    io.emit('remove_name', data);
  });
  socket.on('check_out', function(data,time) {
    io.emit('check_out', data, time);
  });
  socket.on('check_in', function(data, time) {
    io.emit('check_in', data, time);
  });
});

// listen for events
const server = http.listen(process.env.PORT || 8080, function() {
  console.log('listening on 8080');
});
