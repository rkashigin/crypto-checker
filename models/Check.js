const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  pair: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true,
  },
});

module.exports = model("Check", schema);
