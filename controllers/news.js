const News = require('../models/news')
const Subscriber = require('../models/subscribers')
const nodemailer = require('nodemailer');
var multer  = require('multer')
const path = require('path')
const senderMail = 'genforeningen2020@gmail.com'
const pass = 'Rad0933196192'

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
    limits:{fileSize: 100000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).array('images',50);
  // }).single('userimage');

  // Check File Type
  function checkFileType(file, cb){
    // Allowed extension
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
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
      pass: pass
    }
  });

  // Post news
module.exports.addNews = async (req, res, next) => {
  try{
    console.log('req body: ', req.body);
    let addingNews = req.body.data;
    let newNews = new News(addingNews);
    let result = await newNews.save();
    var subscribersList = [];
    Subscriber.find({}, (err, subs) => {
      if(err){
      }else{
          for(let sub of subs){
            subscribersList.push(sub.email);
          }
      }
    });
    var mailOptions = {
      from: senderMail,
      to: subscribersList,
      subject: 'Genforingen 2020 Nyhedersbrev',
      html: '<h4>Hej, Der er nogen nyt på Genforingen 2020 nyheder <br> tjek linket for at se </h4>  '

    };
    transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log("not sent bcz: "+error);
        res.json({success: false, msg: 'Unable to send Email!'})

      } else {
        console.log('Email sent');
      }
    });
    res.json({success: true, msg: 'Nyheder er nu offentliggjort', data: result});
    }catch(e){
        console.log("Error", e);
        res.json({success: false, msg: 'Der sket noget galt'})
      }
}

// Adding image to the news
module.exports.addImageToNews = async (req, res, next) => {
  console.log('id: ', req.body.id);
  News.findOne({
    _id: req.body.id
}, (err, news) => {
    if (err) throw err
    if (!news) {
    res.json({success: false, msg: 'nyheder er ikke fundet'})
    } else {
        News.findOneAndUpdate({ _id: req.body.id}, {$push :{ images: req.body.image}}, (err, updateResult) => {
        if(err) {
            res.json({success: false, msg: 'Kunne ikke tilføje billede'})
        }else{
            res.json({success: true, msg: 'Billedet er tilføjet'})
        }
        })
}
})
}

// Updating news status to published
module.exports.updateNewsStatus = (req, res, next) => {
    News.findOne({
        _id: req.body.id
    }, (err, news) => {
        if (err) throw err
        if (!news) {
        res.json({success: false, msg: 'News not found...!!!'})
        } else {
            News.findOneAndUpdate({ _id: req.body.id}, {$set :{ newsStatus: req.body.status, publishDateTime: req.body.time}}, (err, updateResult) => {
            if(err) {
                res.json({success: false, msg: 'Failed to publish news!'})
            }else{
                res.json({success: true, msg: 'News published successfully!'})
            }
            })
    }
    })
}

// Fetches all news
module.exports.fetchAllNews = async (req, res) => {
  News.find({}, (err, news) => {
    if(err){
        res.json({success: false, msg: 'Failed to load news!'})
    }else{
        res.json({success: true, data: news})
    }
  }).sort({ createdAt: -1 });
}

// fetches only published news
module.exports.fetchpublishednews = async (req, res) => {
  News.find({newsStatus: 'published'}, (err, news) => {
    if(err){
        res.json({success: false, msg: 'Failed to load news!'})
    }else{
        res.json({success: true, data: news})
    }
  }).sort({ createdAt: -1 });
}


module.exports.fetchNewsById = async (req, res) => {
  News.findOne({_id: req.params.newsId}, (err, news) => {
    if(err){
        res.json({success: false, msg: 'Failed to load news!'})
    }else{
        res.json({success: true, data: news})
    }
  })
}

// Deletes a news
module.exports.deleteNews = async (req, res) => {
  try{
    let found = await News.findOneAndRemove({"_id": req.body.newsid})
    if(found !== null){
      res.json({success: true, msg: "Nyhed er nu slettet"})
    }else{
      res.json({success: true, msg: "Nyhed kunne ikke findes"})
    }
  }catch(e){
    console.log("error",e);
    res.json({success: false, msg: "Noget gik galt"})
  }
}

// Delete the news image
module.exports.deleteImageFromNews = async (req, res) => {
  try{
    let found = await News.update({"_id": req.body.newsid}, { $pull: { images: req.body.image }})
    if(found !== null){
      res.json({success: true, msg: "Image deleted successfully!"})
    }else{
      res.json({success: true, msg: "Image not found...!!!"})
    }
  }catch(e){
    console.log("error",e);
    res.json({success: false, msg: "Something went wrong...!"})
  }
}

// Update news

module.exports.updateNews = async (req, res) => {
  News.findOne({
    _id: req.body.data.id
}, (err, news) => {
    if (err) throw err
    if (!news) {
    res.json({success: false, msg: 'News not found!'})
    } else {
        News.findOneAndUpdate({ _id: req.body.data.id}, {$set :req.body.data.data}, (err, updateResult) => {
        if(err) {
            res.json({success: false, msg: 'Failed to update news!'})
        }else{
            res.json({success: true, msg: 'News updated successfully!'})
        }
        })
}
})
}


