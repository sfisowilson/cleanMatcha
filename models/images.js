var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var imagesSchema = new Schema({
    email: { type: String },
    imageName: { type: String },
    profile: { type: Number, default: 0},
    time : { type : String }
});

module.exports = mongoose.model('Images', imagesSchema);