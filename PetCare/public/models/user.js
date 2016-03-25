var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		name: String,
		email: String,
		hashed_password: String,
		salt: String,
		location: Number,
		description: String,
		rating: Number,
		role: String,
		photo: String,
		banned: Boolean,
		pets: [{
			type: Schema.Types.ObjectId, 
			ref: 'Pet' 
		}],
		pet_postings: [{
			type: Schema.Types.ObjectId, 
			ref: 'PetPosting' 
		}],
		sitter_postings: [{
			type: Schema.Types.ObjectId, 
			ref: 'SitterPosting' 
		}],
		reviews: [{
			type: Schema.Types.ObjectId, 
			ref: 'Review' 
		}],
		reports: [{
			type: Schema.Types.ObjectId, 
			ref: 'Report' 
		}]
	},
	{
	 	timestamps: { createdAt: 'created_at',
	 				  updatedAt: 'updated_at' }
	}
);

UserSchema.plugin(autoIncrement.plugin, {
	model: 		'User',
	field: 		'_id',
	startAt: 	1
});

module.exports = mongoose.model("User", UserSchema);