var app = angular.module('petCare', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: 	'/layouts/home.html',
			controller: 	'mainController',
			controllerAs: 	'mainCtrl'
		})
		.when('/users/:id', {
			templateUrl: 	'/users/show.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/users/:id/applications', {
			templateUrl: 	'/users/applications.html',
			controller: 	'applicationController',
			controllerAs: 	'appCtrl'
		})
		.when('/users/:id/messages', {
			templateUrl: 	'/users/messages.html',
			controller: 	'messageController',
			controllerAs: 	'messageCtrl'
		})
		.when('/signin', {
			templateUrl: 	'/signin.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/signup', {
			templateUrl: 	'/signup.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/pet_posts', {
			templateUrl: 	'/pet_posts/index.html',
			controller: 	'HireController',
			controllerAs: 	'HireCtrl'
		})
		.when('/new_pet_posts', {
			templateUrl: 	'/pet_posts/new.html',
			controller: 	'petPostingFormController',
			controllerAs: 	'petPostingFormCtrl'
		})
		.when('/pet_posts/:id', {
			templateUrl: 	'/pet_posts/show.html',
			controller: 	'petPostingController',
			controllerAs: 	'petPostingCtrl'
		})
		.when('/petsitter_posts', {
			templateUrl: 	'/petsitter_posts/index.html',
			controller: 	'OfferController',
			controllerAs: 	'OfferCtrl'
		})
		.when('/petsitter_posts/:id', {
			templateUrl: 	'/petsitter_posts/show.html',
			controller: 	'sitterPostingController',
			controllerAs: 	'sitterPostingCtrl'
		})
		.when('/new_petsitter_posts', {
			templateUrl: 	'/petsitter_posts/new.html',
			controller: 	'sitterPostingFormController',
			controllerAs: 	'sitterPostingFormController'
		})
		.when('/admin', {
			templateUrl: 	'/admin/admin.html',
			controller: 	'adminController',
			controllerAs: 	'adminCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.controller('mainController', function() {
});

app.controller('adminController', ['$anchorScroll', '$location', '$http', '$scope', 
	function($anchorScroll, $location, $http, $scope) {

	$scope.users = [];
	$scope.petPostings = [];
	$scope.sitterPostings = [];
	$scope.reports = [];

	$scope.num_users = 0;
	$scope.num_petPostings = 0;
	$scope.num_sitterPostings = 0;
	$scope.num_reports = 0;
	$scope.num_postings = 0;

	// TODO: Format created_at dates

	$http.get('/api/users').success(function(data){
		$scope.users = data;
		$scope.num_users = Object.keys($scope.users).length;
	});

	$http.get('/api/petpostings').success(function(data){
		$scope.petPostings = data;
		$scope.num_petPostings = Object.keys($scope.petPostings).length;
		$scope.num_postings += $scope.num_petPostings;
	});

	$http.get('/api/sitterpostings').success(function(data){
		$scope.sitterPostings = data;
		$scope.num_sitterPostings = Object.keys($scope.sitterPostings).length;
		$scope.num_postings += $scope.num_sitterPostings;
	});

	$http.get('/api/reports').success(function(data){
		$scope.reports = data;
		$scope.num_reports = Object.keys($scope.reports).length;
	});

	$scope.scroll = function(anchor) {
		$location.hash(anchor);
		$anchorScroll();
	};

}]);

app.controller('userController', ['$http', '$scope', function($http, $scope) {
	$scope.user = [];
	$scope.userId = 1;			//TODO: change this to session userId
	$scope.profileUserId = 2;	//TODO: change this to userId from URL
	$scope.msg_content;

	$http.get('/api/users/' + $scope.profileUserId).success(function(data){
		console.log(data);
		$scope.user = data;
	});

	$scope.sendMsg = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.profileUserId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/message', data, config);
        $scope.msg_content = "";
    };
}]);

app.controller('applicationController', ['$http', '$scope', function($http, $scope){
	$scope.userId = 1; // TODO: change this to session userId
	$scope.toId;
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $http.get('/applications/' + $scope.userId).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

   	$scope.sendMsg = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.toId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/message', data, config);
        $scope.msg_content = "";
    };
}]);

app.controller('messageController', ['$http', '$scope', function($http, $scope){
    $scope.userId = 1; // TODO: change this to session userId
    $scope.inbox = [];
    $scope.sent = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";

    $http.get('/messages/' + $scope.userId).success(function(data){
        $scope.inbox = data.inbox;
        $scope.sent = data.sent;
    });

    $scope.isReadInbox = function(read) {
        if (read) {
            return 'READ';
        } else {
            return 'UNREAD';
        }
    };

    $scope.isReadSent = function(read) {
        if (read) {
            return 'SEEN';
        } else {
            return 'UNSEEN';
        }
    };

    // Update message status in database to read
    $scope.setRead = function(msgId) {
        $http.put('/read/' + msgId);
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.toId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/message', data, config);
        $scope.msg_content = "";
    };
}]);

// call jQuery functions after rendering finishes
app.directive('onFinishRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                ready();
            }
        }
    };
});


app.controller('reviewController', ['$http', '$scope', function($http, $scope) {
	
	var rating;

	$scope.submitStar = function(rating){
		// Set rating to the rating level user selected
		this.rating = rating;
	}

	$scope.submitReview = function (){
		// Another way to check for undefined/null/NaN
		if(!Number.isInteger(this.rating))
			this.rating = 0;

		var reviewComment = $scope.reviewComment;
		var reviewRating = this.rating;

		// Creare object to be sent through the post request
		var dataObj = {
    		to: 1,
			from: 2,
			rating: reviewRating,
			comment: reviewComment
		}

		// Make a http post request to the server
		console.log("Make a post request to /reviews");

		$http.post('/api/reviews', {data:dataObj})

			.success(function(data, status, headers, config) {
    			// TO-DO: Get the average rating
			}).error(function(data, status, headers, config) {
    			
			});
	};
}]);

app.controller('petPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	$scope.petPosting = []
	$scope.pet = []
	$scope.postingID = $routeParams.id;

	// TODO: Display message if id not found

	$http.get('/api/petpostings/' + $scope.postingID).success(function(data) {

		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info

		$http.get('/api/pets/' + petID).success(function(data) {

			$scope.pet = data;
		});

	});

	$scope.ratingStar = function(id) {
		var starIndex = id;
        for (var i = 1; i <= starIndex; i++) {
            $('#star' + i).html('&#9733;');
        }
        for (var i = starIndex + 1; i <= 5; i++) {
            $('#star' + i).html('&#9734;');
        }
	};
}]);


app.controller('sitterPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	
	$scope.sitterPosting = [];
	$scope.postingID = $routeParams.id;

	$http.get('/api/sitterpostings/' + $scope.postingID).success(function(data) {

		$scope.sitterPosting = data;
	});

}]);

app.controller('sitterPostingFormController', ['$http', '$scope', function($http, $scope) {

	$scope.createPosting = function (){

		// Create object to be sent through the POST request
		var dataObj = {
		    user: 1,	// TODO: Use user id from session
			title: $scope.title,
			types: $scope.types,
			duration: $scope.duration,
			location: $scope.location,
			price: $scope.price,
			experience: $scope.experience,
			supplies: $scope.supplies,
			number_of_pets: $scope.number_of_pets,
			description: $scope.description,
			thumbnail: '/images/default-profile-pic.png',	// TODO: Get user image
			status: 'open',
		};

		// Make POST request to the /sitterpostings

		$http.post('/api/sitterpostings', {data: dataObj})

			.success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);

app.controller('petPostingFormController', ['$http', '$scope', function($http, $scope) {

	$scope.createPosting = function (){

		console.log("creating pet posting");

		// Create object to be sent through the POST request
		var dataObj = {
		    user: 1,	// TODO: Use user id from session
    		pet: 1,		// TODO: Use actual pet id
			title: $scope.title,
			duration: $scope.duration,
			location: $scope.location,
			price: $scope.price,
			supplies: $scope.supplies,
			additional_info: $scope.additional_info,
			description: $scope.description,
			thumbnail: '/images/cat1.png',	// TODO: Get user image
			status: 'open',
		};

		// Make POST request to the /petpostings

		$http.post('/api/petpostings', {data: dataObj})

			.success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);

app.controller('HireController', ['$http', '$scope', function($http, $scope){
        $scope.posts = sitterPosts;

        $scope.rating = rating;
}]);

// Controller for offer pet sitting search
app.controller('OfferController', ['$http', '$scope', function($http, $scope){
    $scope.posts = offerPosts;

    $scope.rating = rating;
}]);

// Show rating
function rating(numOfStar, index) {
    var res = '';
    for (var i = 0; i < 5; i++) {
        if (i < numOfStar) {
        	res += '&#9733;';
        } else {
        	res += '&#9734;';
        }
    }
    $('#rating'+index).html(res);
}

//####################### dummy data
var sitterPosts = [
	{	
		id: 1,
		title: 'Let me take care of your pet!',
		user_id: 1,
		price_range: '20 ~ 25',
		rate: 2,
		experience: '2 years experience',
		duration: 'March 3rd to April 1st',
		pet_types: ' Cats, Dogs, Hampsters',
		location: 'Downtown, Toronto, ON',
        image: 'images/default-profile-pic.png',
		description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
	},
    {
    	id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price_range: '20 ~ 25',
        rate: 4,
        experience: '2 years experience',
        duration: 'March 3rd to April 1st',
        pet_types: ' Cats, Dogs, Hampsters',
        location: 'Downtown, Toronto, ON',
        image: 'images/default-profile-pic.png',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    }
]

offerPosts = [
    {
    	id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price: 25,
        rate: 2,
        age: 2,
        duration: 'March 3rd to April 1st',
        pet_type: ' Cat',
        location: 'Downtown, Toronto, ON',
        image: 'images/cat1.jpg',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    },
    {
    	id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price: 25,
        rate: 5,
        age: 2,
        duration: 'March 3rd to April 1st',
        pet_type: ' Cat',
        location: 'Downtown, Toronto, ON',
        image: 'images/cat2.jpg',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    }
]