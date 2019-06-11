const fs = require("fs");
const express = require("express");
const server = express();
server.use(express.static("public"));

server.listen(3000);

server.get("/list", function (req, res) {
  console.log("recieved list request:");
  var filenames = fs.readdirSync("data");
  var fs_json = {"files": []};
  fs_json.files = filenames.filter(function(filename){
    return /.+\.json$/.test(filename);
  });
  res.json(fs_json);
});

server.get("/json/:filename", function (req, res) {
  console.log("recieved request: " + req.params.filename);
  try{
    var gps_filename = "data/" + req.params.filename;
    var gps_json = fs.readFileSync(gps_filename, "utf8")
    res.send(gps_json);
  } catch(err) {
    console.error(err);
    res.sendStatus(404);
  }
});
