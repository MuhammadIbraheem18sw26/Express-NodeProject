const mongoose = require('mongoose');

const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);



const leaderSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },


    image: {
        type: String,
        require: true,


    },


    designation: {
        type: String,
        default: 'employee',


    },

    abbr: {
        type: String,
        require: true,
        min: 5


    },
    description: {
        type: String,
        require: true,


    },

    featured: {
        type: Boolean,
        default: false,


    },


},
    {
        timestamps: true
    });

var Leaders = mongoose.model('Leader', leaderSchema);
module.exports = Leaders;