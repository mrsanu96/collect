import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({

    id:{
        type: String,
        trim: true,
    },
    seq:{
        type:Number,
    }
  
   
});


const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export default Counter;