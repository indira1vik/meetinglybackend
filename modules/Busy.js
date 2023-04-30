const mongoose = require('mongoose');

const BusySchema = new mongoose.Schema({
    empid:String,
    off_start: String,
    off_end: String
});

const BusyModel = mongoose.model('busy', BusySchema);

module.exports = BusyModel;