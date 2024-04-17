import connectToDatabase from "../../lib/mongodb";
import User from '../../model/account';

export default async function handler(req, res) {
    const { userId, followUserId } = req.body;

    await connectToDatabase();

    try {
        const user = await User.findById(userId);
        const isFollowing = user.followers.includes(followUserId);

        res.status(200).json({ success: true, isFollowing });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}