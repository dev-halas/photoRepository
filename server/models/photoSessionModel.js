const mongoose = require('mongoose');

const photoSessionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
        },
        coverPhoto: {
            type: String,
        },
        images: [
            {
                _id: Number,
                image: String,
                thumbnail: String,
                chosen: {
                    type: Boolean,
                    default: false,
                },
            },
            { _id: false },
        ],
        published: {
            type: Boolean,
            default: false,
        },
        clientPassword: {
            type: String,
            required: function () {
                if (this.published === true) {
                    return 'true';
                }
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PhotoSession', photoSessionSchema);
