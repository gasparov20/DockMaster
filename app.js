const express = require('express');
const socketIO = require('socket.io');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const idx = require(__dirname + "/idx.js");


const server = express()
  .use((req, res) => res.sendFile("/index.html", { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://andrew:Kenneth727@cluster0.jieef.mongodb.net/namesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const namesSchema = {
  id: Number,
  name: String,
  timeLeft: String,
  timeBack: String
};

const Name = mongoose.model("Name", namesSchema);

// send index.ejs
app.get("/", function(req, res) {
  Name.find({}, function(err, foundNames) {
    res.render("index", {newListItems: foundNames});
    ids = []
    foundNames.forEach(docs => ids.push(Number(docs.id)));
    if (ids.length === 0)
      idx.setIdx(1);
    else
      idx.setIdx(Math.max(...ids) + 1);
  })
})

// send index.js
app.get("/index.js", function(req, res) {
  res.sendFile(__dirname + "/index.js");
});

// open connection
io.on('connection', function (socket) {

  socket.on('test', function() {
    socket.emit('test');
  })

  socket.on('add_data', function() {
    Name.find({}, function (err, found) {
      for (let i = 0; i < found.length; i++) {
        socket.emit('add_data', found[i].id, found[i].timeLeft, found[i].timeBack);
      }
    })
  });

  socket.on('new_name', function(data) {
    console.log(idx.getIdx());
    const name = new Name({
      id: idx.getIdx(),
      name: data,
      timeLeft: "",
      timeBack: ""
    });

    Name.find({name: data}, function (err, found) {
      if (!err) {
        if (found.length > 0) {
          console.log(data + " already exists in namesDB");
        }
        else { // create document in namesDB
          console.log("create() called");
          Name.create(name, function(err) {
            if (!err) {
              console.log("Successfully saved " + idx.getIdx() + " " + data + " to namesDB");
              io.emit('new_name', idx.getIdx(), "<td>" + data + "</td><td><button id='checkOutBtn" + idx.getIdx() + "' class='btn btn-light'>Check Out</button></td><td><button id='checkInBtn" + idx.getIdx() + "' class='btn btn-light'>Check In</button></td><td><button id='remove" + idx.getIdx() + "' class='btn btn-light'>X</button></td></tr>");
              idx.incIdx();
            } else {
              console.log("error in creating new namesDB document" + err);
            }
          })
        }
      }
    });
  });

  socket.on('remove_name', function(idx, name2) {
    Name.deleteOne({
      id: idx
    }, function(err) {
      if (!err) {
        console.log("Successfully deleted " + name2 + " from namesDB");
      } else {
        console.log("error: " + err);
      }
    });
    io.emit('remove_name', idx);
  });

  socket.on('check_out', function(idx, time, name2) {
    Name.findOneAndUpdate({id: idx}, {timeLeft: time}, {upsert: true, useFindAndModify: false},
      function(err) {
      if (!err) {
        console.log("Successfully added " + time + " to time-left for " + name2 + " in namesDB");
      } else {
        console.log("error: " + err);
      }
    });
    io.emit('check_out', idx, time);
  });

  socket.on('check_in', function(idx, time, name2) {
    Name.findOneAndUpdate({
      id: idx }, {
      timeBack: time }, {
      upsert: true,
      useFindAndModify: false
    }, function(err) {
      if (!err) {
        console.log("Successfully added " + time + " to time-back for " + name2 + " in namesDB");
      } else {
        console.log("error: " + err);
      }
    });
    io.emit('check_in', idx, time);
  });
});
