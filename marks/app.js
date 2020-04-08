var express = require("express"),
  expressSanitizer = require("express-sanitizer");
(bodyParser = require("body-parser")),
  (mongoose = require("mongoose")),
  (methodOverride = require("method-override")),
  (app = express());

//APP CONFIG
mongoose.connect("mongodb://localhost/test2");
app.use(express.static("public")); // to serve public directory for express
app.set("view engine", "ejs"); // extention not needed if this line is active
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE MODEL CONFIG
var myDiarySchema = new mongoose.Schema({
  name: String,
  subject: String,
  marks: Number,
  created: { type: Date, default: Date.now },
});
var Diary = mongoose.model("Diary", myDiarySchema);

// Diary.create({
// 	title: "Cooked!",
// 	body: "Today I made delicious palav! "
// });

//RESTful Routes
app.get("/", function (req, res) {
  res.redirect("/diary");
});

// INDEX ROUTE
app.get("/diary", function (req, res) {
  Diary.find({}, function (err, diary) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { diary: diary });
    }
  });
});

//SHOW MARKS
app.get("/diary/index1/:id", function (req, res) {
  Diary.find({}, function (err, diary) {
    if (err) {
      console.log(err);
    } else {
      res.render("index1", { diary: diary, output: req.params.id });
    }
  });
});

//NEW ROUTE
app.get("/diary/new", function (req, res) {
  res.render("new");
});

app.get("/diary/midway", function (req, res) {
  res.render("midway");
});

//CREATE ROUTE
app.post("/diary", function (req, res) {
  //create
  req.body.diary.body = req.sanitize(req.body.diary.body);
  Diary.create(req.body.diary, function (err, newDiary) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/diary");
    }
  });
});

//SUBMIT SEARCH
app.post("/diary/submit", function (req, res){
  var id = req.body.id;
  res.redirect("/diary/index1/" + id)
});

//SHOW ROUTE
app.get("/diary/:id", function (req, res) {
  Diary.findById(req.params.id, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { post: foundPost });
    }
  });
});


// Tell express to listen for requests (start server)
app.listen(3000, function () {
  console.log("myDiary server started!");
});

var server = app.listen(8080, function () {
  console.log("listening...");
  server.close(function () {
    console.log("Quit");
  });
});
