const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    username: String,
    followers: [{ type: String, ref: 'User' }],
    following: [{ type: String, ref: 'User' }]
});



const Follower = mongoose.models.Follower || mongoose.model("Follower", followerSchema);

export default Follower;