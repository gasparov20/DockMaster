const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/namesDB", {useNewUrlParser: true, useUnifiedTopology: true});

const namesSchema = {
  name: String,
  timeLeft: String,
  timeBack: String
};

const Name = mongoose.model("Name", namesSchema);

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
    const name = new Name({
      name: data
    });

    Name.create(name, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully saved " + data + " to namesDB");
      }
    })

    io.emit('new_name', "<td>" + data + "</td><td><button id='checkOutBtn" + tableIndex + "' class='btn btn-light'>Check Out</button></td><td></td><td><button id='remove" + tableIndex + "' class='btn btn-light'>X</button></td></tr>", sid);
  });
  socket.on('remove_name', function(data, name2) {
    Name.deleteOne({name: name2}, function(err){
      if (!err) {
        console.log("Successfully deleted " + name2 + " from namesDB");
      } else {
        console.log(err);
      }
    })

    io.emit('remove_name', data);
  });

  socket.on('check_out', function(data, time, name2) {
    Name.findOneAndUpdate({name: name2}, {timeLeft: time}, {upsert: true}, function(err) {
      if (!err) {
        console.log("Successfully added " + time + " to time-left for " + name2 + " in namesDB");
      } else {
        console.log(err);
      }
    })

    io.emit('check_out', data, time);
  });

  socket.on('check_in', function(data, time, name2) {
    Name.findOneAndUpdate({name: name2}, {timeBack: time}, {upsert: true}, function(err) {
      if (!err) {
        console.log("Successfully added " + time + " to time-back for " + name2 + " in namesDB");
      } else {
        console.log(err);
      }
    })

    io.emit('check_in', data, time);
  });
});

// listen for events
const server = http.listen(process.env.PORT || 8080, function() {
  console.log('listening on 8080');
});
