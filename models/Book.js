// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const BookSchema = new Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     tags: [String],
//     author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     chapters: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
// });

// module.exports = mongoose.model('Book', BookSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chapters: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
    thumbnail: { type: String }
});

module.exports = mongoose.model('Book', BookSchema);
