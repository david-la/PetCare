var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema(
    {
        to: {
            type: Number,
            ref: 'User'
        },
        from: {
            type: Number,
            ref: 'User'
        },
        pet_posting: {
            type: Number,
            ref: 'PetPosting'
        },
        sitter_posting: {
            type: Number,
            ref: 'SitterPosting'
        },
    	message: String,
        isPetPost: Boolean,
    },
    {
        timestamps: { createdAt: 'created_at',
                      updatedAt: 'updated_at' }
    }
);

ApplicationSchema.plugin(autoIncrement.plugin, {
    model:      'Application',
    field:      '_id',
    startAt:    1
});

module.exports = mongoose.model("Application", ApplicationSchema);