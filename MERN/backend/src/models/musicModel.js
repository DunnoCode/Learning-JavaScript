const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({
    music_name: String,
    category: String,
    composer: String,
    description: String,
    price: Number,
    published: String,
    new_arrival: Boolean,
    music_image: String,
    music_clip: String
})

const Music = mongoose.model('Music', musicSchema);

module.exports = Music