var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        to: {
            type: Number,
            ref: 'User'
        },
        from: {
            type: Number,
            ref: 'User'
        },
    	message: String,
    	read: Boolean
    },
    {
        timestamps: { createdAt: 'created_at',
                      updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model("Message", MessageSchema);