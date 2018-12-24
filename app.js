var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var users = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// DB connection through Mongoose
const options = {
  keepAlive: 30000,
  connectTimeoutMS: 30000,
  useNewUrlParser: true
}; // Just a bunch of options for the db connection
mongoose.Promise = global.Promise;
// Don't forget to substitute it with your connection string
mongoose.connect(
  "mongodb://localhost/junkbros",
  options
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// user api
app
  .route("/users")
  .get(users.getUsers)
  .post(users.createUser);

app.post("/users/login", users.userLogin);

app.post("/users/password_reset", users.resetPassword);

app
  .route("/user/:id")
  .get(users.getUser)
  .post(users.updateUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
