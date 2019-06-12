
const Subscriber = require('../models/subscribers')

// Post subscriber
module.exports.addSubscriber = async (req, res, next) => {
  try{
        let founduser = await Subscriber.findOne({email: req.body.email});
        if(founduser)
        {
          res.json({success: false, msg: 'Abonnent Email Adresse findes allerede!'})
        }else{
          let subscriber = {
    		    email:req.body.email
          }
          let newSubscriber = new Subscriber(subscriber)
          await newSubscriber.save();
          res.json({success: true, msg: 'Succesfuldt tilmeldt vores nyhedsbrev'})
        }

  }catch(e){
    console.log("Error", e);
    res.json({success: false, msg: 'Kunne ikke tilføje abonnent!'})
  }
}
// TO DO : Complete CRUD for subscriber

