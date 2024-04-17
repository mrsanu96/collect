// utils/mongodb.js
import mongoose from "mongoose";
import { RiContactsBookLine } from "react-icons/ri";

const connectMongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI)
    console.log("Connect")
  } catch (error) {
    console.log(error);
  }
}

export default connectMongoDB