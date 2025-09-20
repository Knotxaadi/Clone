const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, "path is required"],
  },
  originalname: {
    type: String,
    required: [true, "orginal name"],
  },
  url: {
    type: String,
    required: [true, "URL"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "user Required"],
  },
});

const file = mongoose.model("file", fileSchema);

module.exports = file;
