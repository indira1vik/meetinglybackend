const mongoose = require('mongoose');

const EmpSchema = new mongoose.Schema({
    empid:String,
    name:String,
    email:String,
    username:String,
    phone:String,
    password:String,
    position:String
  });

const EmpModel = mongoose.model('employees', EmpSchema);

module.exports = EmpModel;