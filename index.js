// BUILD-IN MODULES
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

// CUSTOM MODULES
const EmpModel = require('./modules/Emp');
const MeetModel = require('./modules/Meet');
const BusyModel = require('./modules/Busy');
const app = express();

// VARIABLES
const PORT = process.env.PORT || 3001;
const MONGO_LINK = "mongodb://indiravik:Indira113@ac-w1utqga-shard-00-00.l3yy29w.mongodb.net:27017,ac-w1utqga-shard-00-01.l3yy29w.mongodb.net:27017,ac-w1utqga-shard-00-02.l3yy29w.mongodb.net:27017/test?ssl=true&replicaSet=atlas-9f6x6d-shard-0&authSource=admin&retryWrites=true&w=majority";

// MONGOOSE
mongoose.connect(MONGO_LINK);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to database..."));

// EXPRESS
app.use(cors());
app.use(express.json());

// LOGIN CHECK
app.post('/checkLogin', async (req, res) => {
    const empid = req.body.empid;
    const password = req.body.password;
    const checker = await EmpModel.findOne({ empid });
    if (checker) {
        if (checker.empid == empid && checker.password == password) {
            res.send("Success");
        } else {
            res.send("Wrong");
        }
    } else {
        res.send("Error");
    }
});

// GET EMPLOYEE
app.post('/employeeDetails', async (req, res) => {
    const empid = req.body.empid;
    const user = await EmpModel.findOne({ empid });
    if (user) {
        res.send(user);
    } else {
        res.send("User not found!");
    }
});

// ADD EMPLOYEE
app.post('/addEmployee', async (req, res) => {
    const empid = req.body.empid;
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const phone = req.body.phone;
    const password = req.body.password;
    const position = req.body.position;

    if (empid != "" && name != "" && email != "" && username != "" && password != ""){
        const employee = new EmpModel({
            empid: empid,
            name: name,
            email: email,
            username: username,
            phone: phone,
            password: password,
            position: position
        });
        await employee.save();
        res.send("Success");
    } else {
        res.send("Error");
    }
    
});

// LIST MEETINGS
app.post('/listMeetings', async (req, res) => {
    const empid = req.body.empid;
    const username = req.body.guest;
    const meet1 = await MeetModel.find({ created_by: empid });
    const meet2 = await MeetModel.find({ guest: username });
    const arr = []
    arr.push(meet1);
    arr.push(meet2);
    res.send(arr);
})

// UPDATE PROFILE
app.post('/updateProfile', async (req, res) => {
    const empid = req.body.empid;
    const newUsername = req.body.uname;
    const newPass = req.body.pass;
    const oldUsername = req.body.oldUname;
    try {
        const data = await EmpModel.findOneAndUpdate({ empid:empid }, {username:newUsername, password:newPass});
        const other_data = await MeetModel.findOneAndUpdate({guest:oldUsername},{guest:newUsername});
        res.send("Success");
    } catch (err) {
        res.send(err);
    }
});

// ADD BUSY
app.post('/addBusy', async (req,res)=>{
    const empid = req.body.empid;
    const off_start = req.body.offstart;
    const off_end = req.body.offend;
    const busy = new BusyModel({
        empid:empid,
        off_start:off_start,
        off_end:off_end
    });
    try{
        await busy.save();
        res.send("Success");
    }catch(err){
        res.send(err);
    }
});

// LIST BUSY
app.post('/listBusy',async (req,res)=>{
    const empid = req.body.empid;
    const data = await BusyModel.find({empid:empid});
    if (data){
        res.send(data);
    } else{
        res.send("Empty");
    }
});

// DELETE BUSY
app.post('/deleteBusy',async (req,res)=>{
    const empid = req.body.empid;
    const start = req.body.off_start;
    const end = req.body.off_end;
    const data = await BusyModel.findOneAndDelete({empid:empid,off_start:start,off_end:end});
    if (data){
        res.send("Success");
    } else{
        res.send("Error");
    }
});

// ADD MEETINGS
app.post('/addMeetings', async (req, res) => {
    const title = req.body.title;
    const agenda = req.body.agenda;
    const meetstart = req.body.meetstart;
    const meetend = req.body.meetend;
    const created_by = req.body.created_by;
    const guest = req.body.guest;

    if (meetstart != "" && guest != "" && title != "") {
        const meetings = new MeetModel({
            title: title,
            agenda: agenda,
            created_by: created_by,
            guest: guest,
            meet_start: meetstart,
            meet_end:meetend
        });
        await meetings.save();
        res.send("Success");
    } else {
        res.send("Error");
    }
});

// CHECK USER
app.post('/checkGuest',async(req,res)=>{
    const gu = req.body.cg;
    const data = await EmpModel.findOne({username:gu});
    if (data){
        const other_data = await BusyModel.find({empid:data.empid});
        if (other_data){
            res.send(other_data);
        } else{
            res.send("Error");
        }
    } else{
        res.send("Error");
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log("Server started...");
})