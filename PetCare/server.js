var express = require("express");
var app		= express();
var path 	= require("path");
var mongoose= require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5

/* Application Setup */ 

// For parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serving static files in Express
app.use(express.static(path.join(__dirname, 'public')));
// Configure View engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

/* Database Setup */

// Connect to a database
// NOTE: Dont forget to run 'mongod' (mongoDB daemon) in a different terminal
var connection = mongoose.connect("mongodb://localhost/testDB");
autoIncrement.initialize(connection)

// Import Database schema
var Application = require(__dirname + '/public/models/Application');
var Message = require(__dirname + '/public/models/Message');
var Pet = require(__dirname + '/public/models/Pet');
var Pet_Posting = require(__dirname + '/public/models/Pet_Posting');
var Sitter_Posting = require(__dirname + '/public/models/Sitter_Posting');
var Report = require(__dirname + '/public/models/Report');
var Review = require(__dirname + '/public/models/Review');
var User = require(__dirname + '/public/models/User');

// Insert test data
/**********************************************************************/
var user1 = new User({
	name: 'John Doe',
	email: 'john@gmail.com'
});

user1.save();

var user2 = new User({
	name: 'Leonardo DiCaprio',
	email: 'leo@gmail.com'
});

user2.save();

var user3 = new User({
	name: 'Taewoo Kim',
	email: 'rlaxodn@gmail.com'
});

user3.save();

var msg1 = new Message({
	to: 1,
	from: 2,
	message: 'Where are you?',
	read: false,
});

msg1.save();

var msg2 = new Message({
	to: 2,
	from: 1,
	message: 'somewhere ...',
	read: true,
});

msg2.save();

var msg3 = new Message({
	to: 1,
	from: 3,
	message: 'yo',
	read: true,
});

msg3.save();

var msg4 = new Message({
	to: 3,
	from: 1,
	message: 'blablabla',
	read: true,
});

msg4.save();

var msg5 = new Message({
	to: 3,
	from: 2,
	message: '...',
	read: true,
});

msg5.save();

var pet1 = new Pet({
	name: 'Kitty',
	user: 1,
	type: 'Cat',
	breed: 'Persian',
	gender: 'Male',
	age: 2,
	description: 'Lorem ipsum dolor sit amet, vim id assum assueverit. Mazim appellantur interpretaris ius et, ex meis principes neglegentur eos. Vel tractatos repudiare expetendis in. Aeque inermis eu nec. His libris noster tacimates ne, enim stet vis ex. Ei mel populo causae liberavisse, ei eos iisque erroribus.',
	rating: 2
});

pet1.save();

var petPosting1 = new Pet_Posting({
    user: 1,
    pet: 1,
	title: 'Looking for a kind pet sitter.',
	duration: '1 week',
	location: 'Downtown, Toronto, ON',
	price: '$110 per day',
	supplies: 'Toys, Kennel, Clothes',
	additional_info: 'N/A',
	description: 'Looking for someone to take care of my cat while I am out of the country.',
	thumbnail: '/images/cat1.jpg',
	status: 'open'
});

petPosting1.save();

var sitterPosting1 = new Sitter_Posting({
    user: 1,
	title: 'Cat/Dog Sitter Near Toronto',
	types: 'Dogs, Cats, Birds',
	duration: 'March 3rd to April 1st',
	location: 'Downtown, Toronto, ON',
	price: '20 - 25 per Day',
	experience: '2 years',
	supplies: 'Toys, Kennel, Clothes',
	number_of_pets: 2,
	description: 'I will look after your pets for $25 per hour. Please contact me for more information',
	thumbnail: '/images/default-profile-pic.png',
	status: 'open'
});

sitterPosting1.save();

/**********************************************************************/
													
var dogSchema = new mongoose.Schema({
	name: String,
	age: Number
});

// Take the dogSchema, compile it in to a model and save it in a variable 
var Dog = mongoose.model("Dog", dogSchema);


/* Application Routes */

app.get("/", function(req, res){
	res.render("index.html");
});

app.get("/signup", function(req, res){
	res.render("signup.html");
});

app.get("/signin", function(req, res){
	res.render("signin.html");
});

app.get("/admin", function(req, res){
	res.render("admin.html");
});

app.get("/new_post_pet", function(req, res){
	res.render("new_post_pet.html");
});

app.get("/new_post_petsitter", function(req, res){
	res.render("new_post_petsitter.html");
});

app.get("/post_pet", function(req, res){
	res.render("post_pet.html");
});

app.get("/post_petsitter", function(req, res){
	res.render("post_petsitter.html");
});

app.get("/search_pet", function(req, res){
	res.render("search_pet.html");
});

app.get("/search_petsitter", function(req, res){
	res.render("search_petsitter.html");
});

app.get("/messages", function(req, res){
	res.render("messages.html");
});

app.get("/applications", function(req, res){
	res.render("applications.html");
});

app.get("/user_profile", function(req, res){
	res.render("user_profile.html");
});

/* REST API routes */

app.get("/users/:id", function(req, res){
	var user = [];
	User.findById(req.params.id, function(err, user) {
		if (err) {
			throw err;
		}
		res.json(user)
	});
});

app.post("/reviews", function(req, res){

	var toUser 			= req.body.data.to;
	var fromUser 		= req.body.data.from;
	var reviewRating 	= req.body.data.rating;
	var reviewComment 	= req.body.data.comment;

	console.log("Review Rating : "+ reviewRating);

	// Save to the user reviwe information to the database
	// TO-DO: Also calclute the average rating and save under user.rating
	// 		  Send avg number back to front-end as res.json()
	// Review.create({
	// 	to: user1._id,
	// 	from: user2._id,
	// 	rating: 3,
	// 	comment: "reviewComment"

	// }, function(err, review){
	// 	if(err){
	// 		console.log("Review.create(): error = "+ err);
	// 	}
	// 	else{
	// 		console.log("Review.create(): successful");
	// 		console.log(review);
	// 	}
	// });

	// Send back a response or end response
	res.json({resData: "data"});
	// res.end();
});

app.get("/pets/:id", function(req, res){
	var pet = [];
	Pet.findById(req.params.id, function(err, pet) {
		if (err) {
			throw err;
		}
		res.json(pet)
	});
});

app.get("/petpostings/:id", function(req, res){
	var petposting = [];
	Pet_Posting.findById(req.params.id, function(err, petposting) {
		if (err) {
			throw err;
		}
		res.json(petposting)
	});
});

app.get("/sitterpostings/:id", function(req, res){
	var sitterposting = [];
	Sitter_Posting.findById(req.params.id, function(err, sitterposting) {
		if (err) {
			throw err;
		}
		res.json(sitterposting)
	});
});

// Inbox and Sent messages of the given user
app.get("/messages/:userId", function(req,res){
	var inbox = [];
	var sent = [];

	Message.find({to: req.params.userId}).populate('from').exec(function(err, inbox) {
		if (err) {
			throw err;
		}
		Message.find({from: req.params.userId}).populate('to').exec(function(err, sent) {
			if (err) {
				throw err;
			}

			// create JSON object
			var data = "{" + JSON.stringify("inbox") + ": [";
			for (var i = 0; i < inbox.length; i++) {
				data += "{" + JSON.stringify("from") + ":" + JSON.stringify(inbox[i]['from']['name']);
				data += "," + JSON.stringify("from_id") + ":" + JSON.stringify(inbox[i]['from']['_id']);
				data += "," + JSON.stringify("created_at") + ":" + JSON.stringify(inbox[i]['created_at']);
				data += "," + JSON.stringify("message") + ":" + JSON.stringify(inbox[i]['message']);
				data += "," + JSON.stringify("read") + ":" + JSON.stringify(inbox[i]['read']);
				data += "," + JSON.stringify("msg_id") + ":" + JSON.stringify(inbox[i]['_id']) + "}";
				if (i != inbox.length - 1) {data += ",";}

			}
			data += "]," + JSON.stringify("sent") + ": ["
			for (var i = 0; i < sent.length; i++) {
				data += "{" + JSON.stringify("to") + ":" + JSON.stringify(sent[i]['to']['name']);
				data += "," + JSON.stringify("created_at") + ":" + JSON.stringify(sent[i]['created_at']);
				data += "," + JSON.stringify("message") + ":" + JSON.stringify(sent[i]['message']);
				data += "," + JSON.stringify("read") + ":" + JSON.stringify(sent[i]['read']) + "}";
				if (i != sent.length - 1) {data += ",";}
			}
			data += "]}"

			console.log(JSON.parse(data));
			res.json(JSON.parse(data));
		});
	});
});

// Update read status of the given message
app.put("/read/:msg_id", function(req, res){
	var msg = [];

	Message.findByIdAndUpdate(req.params.msg_id, {$set: {read:true}}, function(err, msg){
		if (err) throw err;
	});
});

// Post a new message
app.post("/message", function(req, res){
	var msg = new Message({
		from: req.body.from,
		to: req.body.to,
		message: req.body.message,
		read: false,
	});

	msg.save();
});


// Tesing 
app.get("/dogs", function(req, res){
	res.send("Who let the dogs out?");
});

// Testing Route Parameters
// Ex: 	/http://localhost:3000/dogs/1
// 		/http://localhost:3000/dogs/33
app.get("/dogs/:id", function(req, res){
	console.log(req.params);
	res.send("Dog id = "+ req.params.id);
});

// Testing Route Parameters + Database
// Ex: 	/http://localhost:3000/dogs/new/Timmy
// 		/http://localhost:3000/dogs/new/Max
app.get("/dogs/new/:name", function(req, res){
	var dogName = req.params.name;

	// Adding a new dog to the database testDB
	Dog.create({
		name: dogName,
		age: 6

	}, function(err, dog){
		if(err){
			console.log("Dog.create(): error");
		}
		else{
			console.log("Dog.create(): successful");
			console.log(dog);
		}
	});

	res.send("Creating new dog");
});

// Testing Route Parameters + Database
// Ex: 	/http://localhost:3000/dogs/find/Timmy
// 		/http://localhost:3000/dogs/find/Buster
app.get("/dogs/find/:name", function(req, res){
	var dogName = req.params.name;

	var result = [];

	// Find dogs with a given name from the testDB
	Dog.find({name : dogName}, function(err, dogs){
		if(err){
			console.log("Dog.find(): error");
		}
		else{
			console.log("Dog.find(): successful");
			console.log(dogs);
			result = dogs;
			if (result.length != 0 )
				res.send(result[0].name+ " is "+ result[0].age + " years old");
			else
				res.send("No results found");
			}
	});

});

// If none of the above routes matches, display an error
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});


/* Start server */ 

app.listen(3000, function(){
	console.log("PetCare server listening on port 3000");
});
