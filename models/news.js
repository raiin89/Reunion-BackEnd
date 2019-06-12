var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NewsSchema = new Schema({

  author: {type: String},
  headline: {type: String},
  publishDateTime: {type: Date},
  content: {type: String},
  images:[{type: String}],
  links: [{type: String}],
  newsStatus: {type: String, enum: ['pending', 'published', 'rejected']}
  
},{
  timestamps: true
})

module.exports = mongoose.model('News', NewsSchema, 'news')
