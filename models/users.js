const mongoose = require("mongoose");
var SHA256 = require("crypto-js/sha256");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  files: [String]
});

UserSchema.pre("save", function(next) {
  this.password = SHA256(this.password);
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === SHA256(candidatePassword).toString();
};

module.exports = mongoose.model("User", UserSchema);
