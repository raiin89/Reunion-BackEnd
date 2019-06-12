const Event = require('../models/events')
const nodemailer = require('nodemailer')
var multer  = require('multer')
const path = require('path')
const senderMail = 'genforeningen2020@gmail.com'
const emailPass = 'Rad0933196192'
const eventsRoute = 'http://165.227.129.108:3000/social/events/'

 // Setting up multer
  const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('userimage');

  // Checking  File Type
  function checkFileType(file, cb){
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderMail,
      pass: emailPass
    }
  });

  // Post event
module.exports.addEvent = async (req, res, next) => {
    try{
        let event = req.body.data;
        let newEvent = new Event(event);
        var result = await newEvent.save();
        var mailOptions = {
          from: senderMail,
          to: req.body.data.arranger.email,
          subject: 'Ansøgning modtaget',
          html: '<h4>Din ansøgning er nu modtaget. <br> Vi kontakter dig hurtigst muligt. <br> Venlig hilsen <br> Genforingen2020</h4>'
    
        };
        transporter.sendMail(mailOptions, async function(error, info){
          if (error) {
            console.log("not sent bcz: "+error);
            res.json({success: false, msg: 'Kunne ikke sende mailen'})
    
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        res.json({success: true, data: result, msg: 'Vi har modtaget din ansøgning og du vil få svar på den snart. Tak.'});
    }catch(e){
        console.log("Error", e);
        res.json({success: false, msg: 'Kunne ikke tilføg arrangement'})
      }
}

// Approve or reject event
module.exports.updateStatus = (req, res, next) => {
    Event.findOne({
        _id: req.body.id
    }, (err, event) => {
        if (err) throw err
        if (!event) {
        res.json({success: false, msg: 'Event not found'})
        } else {
            Event.findOneAndUpdate({ _id: req.body.id}, {$set :{ approvalStatus:req.body.status, rejectionReason: req.body.rejectionReason}}, (err, updateResult) => {
            if(err) {
              res.json({success: false, msg: 'Kunne ikke ændre status!'})
            }else{
                  if(req.body.status == 'approved'){
                    var eventUrl = eventsRoute+req.body.id;
                    var mailOptions = {
                      from: 'genforeningen2020@gmail.com',
                      to: req.body.arranger,
                      subject: 'Arrangement er godkendt',
                      html: '<h4>Tillykke <br> Dit arrangement er nu godkendt. <br> klik på følgende link for at vise. </h4> <a href='+eventUrl+'>View</a>. <h4>Genforinigen2020</h4>'
                    };
                  }else{
                    var mailOptions = {
                      from: senderMail,
                      to: req.body.arranger,
                      subject: 'Arrangement er afvist',
                      html: '<h4>Hej <br> Dit arrangement er afvist. <br> Grunden er: </h4>'+req.body.rejectionReason+'<br><h4>Genforingen 2020.</h4>'
                    };
                  }
                  transporter.sendMail(mailOptions, async function(error, info){
                    if (error) {
                      console.log("not sent bcz: "+error);
                      res.json({success: false, msg: 'Unable to send Email!'})
              
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                res.json({success: true, msg: 'Arrangement er nu opdateret'})
            }
            })
    }
    })
}

// Fetches all events 
module.exports.fetchAllEvents = async (req, res) => {
  Event.find({}, (err, events) => {
    if(err){
        res.json({success: false, msg: 'Failed to load events!'})
    }else{
        res.json({success: true, data: events})
    }
  }).sort({ createdAt: -1 });
}

// Fetches approved events only
module.exports.fetchApprovedEvents = async (req, res) => {
  Event.find({approvalStatus: 'approved'}, (err, events) => {
    if(err){
        res.json({success: false, msg: 'Failed to load events!'})
    }else{
        res.json({success: true, data: events})
    }
  }).sort({ createdAt: -1 });
}

module.exports.fetchEventByID = async (req, res) => {
  console.log('req.param: ', req.params)
  Event.findOne({_id: req.params.eventId}, (err, event) => {
    
    if(err){
        res.json({success: false, msg: 'Event not found!'})
    }else{
        res.json({success: true, data: event})
    }
  });
}

// Deleting event
module.exports.deleteEvent = async (req, res) => {
  try{
    let found = await Event.findOneAndRemove({"_id": req.body.eventid})
    if(found !== null){
      res.json({success: true, msg: "Event deleted"})
    }else{
      res.json({success: false, msg: "Event not found!"})
    }
  }catch(e){
    console.log("error",e);
    res.json({success: false, msg: "Something went wrong!"})
  }
}

// Adding image to the event
module.exports.addImageToEvent = async (req, res, next) => {
  console.log('id: ', req.body.id);
  Event.findOne({
    _id: req.body.id
}, (err, event) => {
    if (err) throw err
    if (!event) {
    res.json({success: false, msg: 'Event not found!'})
    } else {
        Event.findOneAndUpdate({ _id: req.body.id}, {$push :{ images: req.body.image}}, (err, updateResult) => {
        if(err) {
            res.json({success: false, msg: 'Failed to add image!', err: err})
        }else{
            res.json({success: true, msg: 'Image added successfully!'})
        }
        })
}
})
}


