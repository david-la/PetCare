function ready() {

    // Click to show messages and applications
    $(".message .info").click(function() {

        $(this).siblings(".content").slideToggle("fast", function() {
        });
    });

    // Update read status for messages
    $(".inbox .message .info").click(function() {

        // Change message status to read
        $(this).find(".read").text("READ");
        $(this).find(".read").addClass("true");
        

    });
}

/* Module for message page */
(function() {
    var app = angular.module('message', []);

    app.controller('messageController', ['$http', '$scope', function($http, $scope){
        $scope.userId = 1; // TODO: change this to session userId
        $scope.inbox = [];
        $scope.sent = [];

        $scope.replyId; //hold userId to send message
        $scope.reply_msg = "";

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
            $scope.replyId = userId;
        };

        $scope.send = function() {
            var data = $.param({
                from: $scope.userId,
                to: $scope.replyId,
                message: $scope.reply_msg
            });
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http.post('/message', data, config);
            $scope.reply_msg = "";
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


})();


/* Module for user application page */
(function() {
    var app = angular.module('application', []);

    app.controller('ReceivedController', ['$http', '$scope', function($http, $scope){
        $scope.applications = received;

    }]);

    app.controller('SentController', ['$http', '$scope', function($http, $scope){
        $scope.applications = sentApp;

    }]);
})();

//########## dummy data ##########


var received = [
    {
        from: 'Leonardo DiCaprio',
        from_id: 1,
        posting_id: 43,
        date: 'March 14, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',

    },
    {
        from: 'Leonardo DiCaprio',
        from_id: 2,
        posting_id: 22,
        date: 'March 14, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',


    },
    {
        from: 'Bradley Cooper',
        from_id: 3,
        posting_id: 4,
        date: 'March 19, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',

    },
    {
        from: 'Leonardo DiCaprio',
        from_id: 4,
        posting_id: 12,
        date: 'February 20, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',

    }
]

var sentApp = [
    {
        to: 'Leonardo DiCaprio',
        posting_id: 75,
        date: 'March 14, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',

    },
    {
        to: 'Leonardo DiCaprio',
        posting_id: 34,
        date: 'March 14, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',


    },
    {
        to: 'Bradley Cooper',
        posting_id: 21,
        date: 'March 19, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',

    },
    {
        to: 'Leonardo DiCaprio',
        posting_id: 8,
        date: 'February 20, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',

    },
    {
        to: 'Leonardo DiCaprio',
        posting_id: 9,
        date: 'February 20, 2016',
        content: 'Lorem ipsum dolor sit amet, eu mei delenit appetere reprehendunt. Tractatos sententiae ut has, vix cu nihil alienum. Te cum altera adolescens argumentum, ei vel suas rationibus. Eam in eius pertinax. Cum no delenit delicatissimi, qui eu voluptaria adipiscing concludaturque.',
    }
]