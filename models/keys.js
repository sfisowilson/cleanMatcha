var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var keysSchema = new Schema({
    userId: { type: String },
    email: { type: String },
    key: { type: String },
    time : { type : String }
});

module.exports = mongoose.model('Keys', keysSchema);