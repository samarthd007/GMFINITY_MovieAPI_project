const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PlayListSchema = new Schema(
    {
        name: {
            type: String,
            maxlength: [20, 'Name can not be more than 20 characters'],
            required: [true, 'please provide playlist name'],
        },
        title: {
            type: String,
            required: [true, 'Please enter the title'],
        },
        year: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            default: 'English',
        },
        imdbID: {
            type: String,
            unique: false,
            trim: true,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        image: {
            type: String,
            required: [true, 'please provide image'],
        },
        type: {
            type: String,
            enum: ['public', 'private'],
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('PlayList', PlayListSchema)
