import connectToDatabase from "../../lib/mongodb";
import FormDataModel from "../../model/account";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', allowedMethods: ['POST'] });
  }

  const { walletAddress, username, email, description, website, facebook, twitter, instagram } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  await connectToDatabase();

  const result = await FormDataModel.updateOne(
    { walletAddress },
    { $set: { username, email, description, website, facebook, twitter, instagram } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ message: 'User data updated successfully' });
}
