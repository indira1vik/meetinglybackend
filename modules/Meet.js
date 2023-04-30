const mongoose = require('mongoose');

const MeetSchema = new mongoose.Schema({
  title: String,
  agenda: String,
  created_by: String,
  guest: String,
  meet_start: String,
  meet_end: String
});

const MeetModel = mongoose.model('meetings', MeetSchema);

module.exports = MeetModel;