import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    genre: String,
    spotify_id: String,
    name: String,
    creator: String,
    likes: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;