import connectToDatabase from "../../lib/mongodb";
import User from "../../model/account";

export default async function handler(req, res) {
  const { userId, followUserId } = req.body;

  await connectToDatabase();

  try {
    await User.updateOne({ _id: (userId) },
      { $pull: { 'followers': followUserId }}
    );

    await User.updateOne({ _id: (followUserId) },
      { $pull: { 'following': userId }}
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false });
  }
}