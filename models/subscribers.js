var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SubscriberSchema = new Schema({  
email: {
 type: String,
 unique: true
}
},{
  timestamps: true
})


module.exports = mongoose.model('Subscriber', SubscriberSchema, 'subscribers')
