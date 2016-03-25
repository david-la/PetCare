var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
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
        read: Boolean,
    },
    {
        timestamps: { createdAt: 'created_at',
                      updatedAt: 'updated_at' }
    }
);

MessageSchema.plugin(autoIncrement.plugin, {
    model:      'Message',
    field:      '_id',
    startAt:    1
});

module.exports = mongoose.model("Message", MessageSchema);
