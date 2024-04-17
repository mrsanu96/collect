import connectToDatabase from "../../lib/mongodb";
import FormDataModel from "../../model/account";

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

   await connectToDatabase();

  const userData = await FormDataModel.findOne({ walletAddress });

  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(userData);
}