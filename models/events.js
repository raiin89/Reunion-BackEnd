var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventSchema = new Schema({
  name: { type: String, required: true  },
  description: { type: String, required:true },
  targetGroup: { type: String, required:true },
  rejectionReason: { type: String },
  timings:[{type: String}],
  eventType: {type: String,required:true
    //enum: ['open', 'close']
  },
  eventCatagory: {type: String, required:true
    //enum: ['music', 'theater', 'movie', 'show', 'nature', 'motion and sport', 'lectures and debate', 'party and festival', 'ecclesial', 'pedagogical activity', 'vote feast', 'anniversary', 'children and young', 'other']
  },
  location: {
    address: {type: String , required:true},
    zip: {type: String , required:true},
    city: {type: String , required:true}
  },
  arranger: {
    name: {type: String , required:true},
    email: {type: String , required:true},
    phone: {type: String , required:true}
  },
  price: {
    type: Number,
    default: 0
  },
  links: [{ type: String}],
  images: [{ type: String}],
  approvalStatus: {
    type: String,
    enum: ['pending','approved','rejected']
    }
},{
  timestamps: true
})

module.exports = mongoose.model('Event', EventSchema, 'events')
