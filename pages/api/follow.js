import connectToDatabase from "../../lib/mongodb";
import Follow from "../../model/followUser";
import User from "../../model/account";


export default async function handler(req, res) {
  const { userId, followUserId } = req.body;

  await connectToDatabase();

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followUserId);

    if (!user || !followUser) {
      return res.status(404).json({ success: false });
    }
    if (!user.followers.includes(followUserId)) {
      user.followers.push(followUserId);
    }

    if (!followUser.following.includes(userId)) {
      followUser.following.push(userId);
    }

    await user.save();
    await followUser.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}
