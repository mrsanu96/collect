import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema({
    username:{
        type: String,
        trim: true,
        
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

    walletAddress:{
        type: String,
        trim: true,
    },

    date:{
        type: Date,
        defaut: Date.now,
    },
    following:[{type:Schema.ObjectId, ref: 'User'}], // ObjectId should be unique id which we will get when we save anything in mongodb
    followers:[{type:Schema.ObjectId, ref: 'User'}],
});

const Account = mongoose.models.Accounts || mongoose.model("Accounts", accountSchema);

export default Account;