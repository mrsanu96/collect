import connectToDatabase from "../../lib/mongodb";
import FormDataModel from "../../model/account";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase(); // Connect to MongoDB
      const { walletAddress } = req.query;
      const existingUser = await FormDataModel.findOne({ walletAddress });
      if (existingUser) {
        res.status(200).json({ success: true, message: "User found." });
      } else {
        // Create new user
        const newUser = new FormDataModel({
          walletAddress,
          username: "",
          email: "",
          description: "",
          website: "",
          facebook: "",
          twitter: "",
          instagram: "",
        });
        await newUser.save();
        res.status(200).json({ success: true, message: "User created." });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
