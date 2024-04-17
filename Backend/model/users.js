const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        requried: [true, "Username is Required"],
        trim: true,
        minLength: [6, "Username mustbe larger than 6 characters"],
    },
    email:{
        type: String,
        trim: true,
      
    },
    description:{
        type: String,
        trim: true,
    },
    website:{
        type: String,
        trim: true,
    },
    facebook:{
        type: String,
        trim: true,
    },
    twitter:{
        type: String,
        trim: true,
    },
    instagram:{
        type: String,
        trim: true,
    },

    date:{
        type: Date,
        defaut: Date.now,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User ;
