const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.get("/public/index.js", function(req, res){
    res.sendFile(__dirname + "/public/index.js");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server started");
});
